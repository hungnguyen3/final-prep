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
          <button type="button" class="option-btn" data-index="${i}">${opt}</button>
        `).join('')}
      </div>
      <div class="explanation" id="explanation">${q.explanation}</div>
    </div>
    <div class="quiz-nav">
      <span class="q-counter"></span>
      <button type="button" class="btn primary" id="btn-next" style="display:none">Câu tiếp theo →</button>
    </div>
  `;

  area.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = parseInt(btn.dataset.index, 10);
      const correctIdx = parseInt(q.answer, 10);
      area.querySelectorAll('.option-btn').forEach(b => {
        b.disabled = true;
        const idx = parseInt(b.dataset.index, 10);
        if (idx === correctIdx) b.classList.add('correct');
        else if (idx === chosen && chosen !== correctIdx) b.classList.add('wrong');
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

  const container = document.createElement('div');
  container.id = 'exam-questions';

  filtered.forEach((q, qi) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `qcard-${qi}`;

    const meta = document.createElement('div');
    meta.className = 'q-meta';
    meta.textContent = `Câu ${qi + 1}/${filtered.length} · ${LEVEL_LABEL[q.level] || q.level}`;

    const qtext = document.createElement('div');
    qtext.className = 'q-text';
    qtext.textContent = q.question;

    const opts = document.createElement('div');
    opts.className = 'options';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        examAnswers[qi] = i;
        opts.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      opts.appendChild(btn);
    });

    const exp = document.createElement('div');
    exp.className = 'explanation';
    exp.id = `exp-${qi}`;
    exp.textContent = q.explanation;

    card.append(meta, qtext, opts, exp);
    container.appendChild(card);
  });

  const submitWrap = document.createElement('div');
  submitWrap.style.cssText = 'text-align:center; margin: 1.5rem 0';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'btn primary';
  submitBtn.id = 'btn-submit';
  submitBtn.textContent = 'Nộp bài';
  submitBtn.addEventListener('click', submitExam);
  submitWrap.appendChild(submitBtn);

  const resultDiv = document.createElement('div');
  resultDiv.id = 'exam-result';

  area.innerHTML = '';
  area.append(container, submitWrap, resultDiv);
}

function submitExam() {
  let correct = 0;
  filtered.forEach((q, qi) => {
    const chosen = examAnswers[qi];
    const correctIdx = parseInt(q.answer, 10);
    const card = document.getElementById(`qcard-${qi}`);
    const optBtns = card.querySelectorAll('.option-btn');
    optBtns.forEach((b, idx) => {
      b.disabled = true;
      b.classList.remove('active');
      if (idx === correctIdx) b.classList.add('correct');
      else if (idx === chosen && chosen !== correctIdx) b.classList.add('wrong');
    });
    document.getElementById(`exp-${qi}`).classList.add('show');
    if (chosen === correctIdx) correct++;
  });

  document.getElementById('btn-submit').style.display = 'none';
  const resultDiv = document.getElementById('exam-result');

  const box = document.createElement('div');
  box.className = 'result-box';
  box.innerHTML = `<div class="score">${correct}/${filtered.length}</div><p class="score-label">Điểm của bạn · ${Math.round(correct / filtered.length * 100)}%</p>`;

  const retryWrap = document.createElement('div');
  retryWrap.style.textAlign = 'center';
  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className = 'btn primary';
  retryBtn.textContent = 'Làm lại';
  retryBtn.addEventListener('click', () => {
    examAnswers = new Array(filtered.length).fill(null);
    document.getElementById('quiz-controls').style.display = 'flex';
    document.getElementById('quiz-area').innerHTML = '';
  });
  retryWrap.appendChild(retryBtn);
  resultDiv.append(box, retryWrap);
}

init();
