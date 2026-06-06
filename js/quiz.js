import { getParams, fetchJSON, renderBreadcrumb } from './app.js';

const LEVEL_LABEL = { basic: 'Cơ bản', intermediate: 'Trung bình', advanced: 'Nâng cao' };

let allQuestions = [];
let filtered = [];
let currentIndex = 0;
let mode = null;
let examAnswers = [];

async function init() {
  const { subject, chapter } = getParams();
  if (!subject || !chapter) return;

  const [meta, data] = await Promise.all([
    fetchJSON(`data/${subject}/meta.json`),
    fetchJSON(`data/${subject}/chapter${chapter}.json`)
  ]);

  const chapterMeta = meta.chapters.find(c => c.id === parseInt(chapter));
  document.title = `${data.title} — Quiz`;
  document.getElementById('chapter-title').textContent = data.title;

  const backBtn = document.getElementById('btn-back');
  if (backBtn) backBtn.href = `subject.html?subject=${subject}`;

  renderBreadcrumb(document.getElementById('breadcrumb'), [
    { label: 'Trang chủ', href: 'index.html' },
    { label: meta.title, href: `subject.html?subject=${subject}` },
    { label: chapterMeta ? chapterMeta.title : data.title }
  ]);

  renderTheory(data.theory);

  allQuestions = data.questions;
  filtered = [...allQuestions];

  setupTabs();
  setupLevelFilter();
  setupModeButtons();
}

function renderTheory(theory) {
  const el = document.getElementById('theory-content');
  if (!el) return;
  el.innerHTML = theory.map(s => `
    <div class="theory-section">
      <h3>${s.heading}</h3>
      <p>${s.content}</p>
    </div>
  `).join('');
}

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

function setupLevelFilter() {
  const select = document.getElementById('level-filter');
  if (!select) return;
  select.addEventListener('change', () => {
    const val = select.value;
    filtered = val === 'all' ? [...allQuestions] : allQuestions.filter(q => q.level === val);
  });
}

function setupModeButtons() {
  document.getElementById('btn-practice')?.addEventListener('click', () => startPractice());
  document.getElementById('btn-exam')?.addEventListener('click', () => startExam());
}

function startPractice() {
  mode = 'practice';
  currentIndex = 0;
  if (filtered.length === 0) {
    document.getElementById('quiz-area').innerHTML = '<p class="empty">Không có câu hỏi nào.</p>';
    return;
  }
  document.getElementById('quiz-controls').style.display = 'none';
  renderPracticeQuestion();
}

function renderPracticeQuestion() {
  const area = document.getElementById('quiz-area');
  if (currentIndex >= filtered.length) {
    area.innerHTML = `
      <div class="result-box">
        <div class="score">Hoàn thành!</div>
        <p class="score-label">Bạn đã làm xong ${filtered.length} câu.</p>
      </div>
      <button class="btn primary" id="btn-restart">Làm lại</button>
    `;
    document.getElementById('btn-restart').addEventListener('click', () => {
      currentIndex = 0;
      document.getElementById('quiz-controls').style.display = 'flex';
      area.innerHTML = '';
    });
    return;
  }

  const q = filtered[currentIndex];
  area.innerHTML = `
    <div class="question-card">
      <div class="q-meta">Câu ${currentIndex + 1}/${filtered.length} · ${LEVEL_LABEL[q.level] || q.level}</div>
      <div class="q-text">${q.question}</div>
      <div class="options">
        ${q.options.map((opt, i) => `
          <button class="option-btn" data-index="${i}">${opt}</button>
        `).join('')}
      </div>
      <div class="explanation" id="explanation">${q.explanation}</div>
    </div>
    <div class="quiz-nav">
      <span class="q-counter"></span>
      <button class="btn primary" id="btn-next" style="display:none">Câu tiếp theo →</button>
    </div>
  `;

  area.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = parseInt(btn.dataset.index);
      area.querySelectorAll('.option-btn').forEach(b => {
        b.disabled = true;
        const idx = parseInt(b.dataset.index);
        if (idx === q.answer) b.classList.add('correct');
        else if (idx === chosen) b.classList.add('wrong');
      });
      document.getElementById('explanation').classList.add('show');
      document.getElementById('btn-next').style.display = 'inline-block';
    });
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    currentIndex++;
    renderPracticeQuestion();
  });
}

function startExam() {
  mode = 'exam';
  examAnswers = new Array(filtered.length).fill(null);
  if (filtered.length === 0) {
    document.getElementById('quiz-area').innerHTML = '<p class="empty">Không có câu hỏi nào.</p>';
    return;
  }
  document.getElementById('quiz-controls').style.display = 'none';
  renderExam();
}

function renderExam() {
  const area = document.getElementById('quiz-area');
  area.innerHTML = `
    <div id="exam-questions">
      ${filtered.map((q, qi) => `
        <div class="question-card" id="qcard-${qi}">
          <div class="q-meta">Câu ${qi + 1}/${filtered.length} · ${LEVEL_LABEL[q.level] || q.level}</div>
          <div class="q-text">${q.question}</div>
          <div class="options">
            ${q.options.map((opt, i) => `
              <button class="option-btn" data-qi="${qi}" data-index="${i}">${opt}</button>
            `).join('')}
          </div>
          <div class="explanation" id="exp-${qi}">${q.explanation}</div>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center; margin: 1.5rem 0">
      <button class="btn primary" id="btn-submit">Nộp bài</button>
    </div>
    <div id="exam-result"></div>
  `;

  area.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qi = parseInt(btn.dataset.qi);
      examAnswers[qi] = parseInt(btn.dataset.index);
      area.querySelectorAll(`.option-btn[data-qi="${qi}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('btn-submit').addEventListener('click', submitExam);
}

function submitExam() {
  let correct = 0;
  filtered.forEach((q, qi) => {
    const chosen = examAnswers[qi];
    const card = document.getElementById(`qcard-${qi}`);
    card.querySelectorAll('.option-btn').forEach(b => {
      b.disabled = true;
      b.classList.remove('active');
      const idx = parseInt(b.dataset.index);
      if (idx === q.answer) b.classList.add('correct');
      else if (idx === chosen && chosen !== q.answer) b.classList.add('wrong');
    });
    document.getElementById(`exp-${qi}`).classList.add('show');
    if (chosen === q.answer) correct++;
  });

  document.getElementById('btn-submit').style.display = 'none';
  document.getElementById('exam-result').innerHTML = `
    <div class="result-box">
      <div class="score">${correct}/${filtered.length}</div>
      <p class="score-label">Điểm của bạn · ${Math.round(correct / filtered.length * 100)}%</p>
    </div>
    <div style="text-align:center">
      <button class="btn primary" id="btn-retry">Làm lại</button>
    </div>
  `;
  document.getElementById('btn-retry').addEventListener('click', () => {
    examAnswers = new Array(filtered.length).fill(null);
    document.getElementById('quiz-controls').style.display = 'flex';
    document.getElementById('quiz-area').innerHTML = '';
  });
}

init();
