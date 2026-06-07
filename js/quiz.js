import { getParams, fetchJSON, renderBreadcrumb } from './app.js';

const LEVEL_LABEL = { basic: 'Cơ bản', intermediate: 'Trung bình', advanced: 'Nâng cao' };

let allQuestions = [];
let filtered = [];
let currentIndex = 0;
let examIndex = 0;
let mode = null;
let examAnswers = [];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Init ───────────────────────────────────────────────────────────────────

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

  function parseContent(raw) {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    let html = '';
    let inList = false;

    const formatInline = s => s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    lines.forEach(line => {
      if (line.startsWith('- ') || line.startsWith('• ')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${formatInline(line.slice(2))}</li>`;
      } else if (/^\d+\)/.test(line)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${formatInline(line.replace(/^\d+\)\s*/, ''))}</li>`;
      } else if (line.startsWith('⚠️') || line.startsWith('NOTE:') || line.startsWith('Lưu ý:')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<div class="note">${formatInline(line)}</div>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p>${formatInline(line)}</p>`;
      }
    });
    if (inList) html += '</ul>';
    return html;
  }

  el.innerHTML = theory.map(s => `
    <div class="theory-section">
      <h3>${s.heading}</h3>
      <div class="theory-body">${parseContent(s.content)}</div>
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

// ─── Shared helpers ──────────────────────────────────────────────────────────

function showControls() {
  document.getElementById('quiz-controls').style.display = 'flex';
  document.getElementById('quiz-area').innerHTML = '';
}

function hideControls() {
  document.getElementById('quiz-controls').style.display = 'none';
}

// "Thoát" button shown while doing a quiz — top of quiz-area
function makeExitBtn() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn';
  btn.style.cssText = 'margin-bottom:1rem; font-size:0.85rem;';
  btn.textContent = '✕ Thoát';
  btn.addEventListener('click', showControls);
  return btn;
}

// Bottom bar shown after finishing
function makeResultBar() {
  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap; margin: 1rem 0 2rem';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'btn';
  backBtn.textContent = '↩ Chọn chế độ khác';
  backBtn.addEventListener('click', showControls);

  const shuffleBtn = document.createElement('button');
  shuffleBtn.type = 'button';
  shuffleBtn.className = 'btn primary';
  shuffleBtn.textContent = '🔀 Làm lại (shuffle)';
  shuffleBtn.addEventListener('click', () => {
    filtered = shuffle(filtered);
    if (mode === 'practice') {
      currentIndex = 0;
      renderPracticeQuestion();
    } else {
      examIndex = 0;
      examAnswers = new Array(filtered.length).fill(null);
      renderExamQuestion();
    }
  });

  bar.append(backBtn, shuffleBtn);
  return bar;
}

// ─── Practice mode ───────────────────────────────────────────────────────────

function startPractice() {
  mode = 'practice';
  currentIndex = 0;
  filtered = shuffle(filtered);
  if (filtered.length === 0) {
    document.getElementById('quiz-area').innerHTML = '<p class="empty">Không có câu hỏi nào.</p>';
    return;
  }
  hideControls();
  renderPracticeQuestion();
}

function renderPracticeQuestion() {
  const area = document.getElementById('quiz-area');
  area.innerHTML = '';

  // Exit button
  area.appendChild(makeExitBtn());

  if (currentIndex >= filtered.length) {
    const box = document.createElement('div');
    box.className = 'result-box';
    box.innerHTML = `<div class="score">Hoàn thành!</div><p class="score-label">Bạn đã làm xong ${filtered.length} câu.</p>`;
    area.appendChild(box);
    area.appendChild(makeResultBar());
    return;
  }

  const q = filtered[currentIndex];

  // Question card
  const card = document.createElement('div');
  card.className = 'question-card';

  const qmeta = document.createElement('div');
  qmeta.className = 'q-meta';
  qmeta.textContent = `Câu ${currentIndex + 1}/${filtered.length} · ${LEVEL_LABEL[q.level] || q.level}`;

  const qtext = document.createElement('div');
  qtext.className = 'q-text';
  qtext.textContent = q.question;

  const opts = document.createElement('div');
  opts.className = 'options';

  const exp = document.createElement('div');
  exp.className = 'explanation';
  exp.textContent = q.explanation;

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      const correctIdx = parseInt(q.answer, 10);
      opts.querySelectorAll('.option-btn').forEach((b, idx) => {
        b.disabled = true;
        if (idx === correctIdx) b.classList.add('correct');
        else if (idx === i && i !== correctIdx) b.classList.add('wrong');
      });
      exp.classList.add('show');
      nextBtn.style.display = 'inline-block';
    });
    opts.appendChild(btn);
  });

  card.append(qmeta, qtext, opts, exp);
  area.appendChild(card);

  // Nav
  const nav = document.createElement('div');
  nav.className = 'quiz-nav';
  nav.style.marginTop = '1rem';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'btn primary';
  nextBtn.textContent = currentIndex === filtered.length - 1 ? 'Kết thúc ✓' : 'Câu tiếp theo →';
  nextBtn.style.display = 'none';
  nextBtn.addEventListener('click', () => {
    currentIndex++;
    renderPracticeQuestion();
  });

  nav.appendChild(nextBtn);
  area.appendChild(nav);
}

// ─── Exam mode ───────────────────────────────────────────────────────────────

function startExam() {
  mode = 'exam';
  examIndex = 0;
  filtered = shuffle(filtered);
  examAnswers = new Array(filtered.length).fill(null);
  if (filtered.length === 0) {
    document.getElementById('quiz-area').innerHTML = '<p class="empty">Không có câu hỏi nào.</p>';
    return;
  }
  hideControls();
  renderExamQuestion();
}

function renderExamQuestion() {
  const area = document.getElementById('quiz-area');
  area.innerHTML = '';

  // Exit button
  area.appendChild(makeExitBtn());

  const q = filtered[examIndex];
  const isLast = examIndex === filtered.length - 1;

  // Question card
  const card = document.createElement('div');
  card.className = 'question-card';

  const qmeta = document.createElement('div');
  qmeta.className = 'q-meta';
  qmeta.textContent = `Câu ${examIndex + 1}/${filtered.length} · ${LEVEL_LABEL[q.level] || q.level}`;

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
    if (examAnswers[examIndex] === i) btn.classList.add('active');
    btn.addEventListener('click', () => {
      examAnswers[examIndex] = i;
      opts.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    opts.appendChild(btn);
  });

  card.append(qmeta, qtext, opts);
  area.appendChild(card);

  // Nav
  const nav = document.createElement('div');
  nav.className = 'quiz-nav';
  nav.style.marginTop = '1rem';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'btn';
  prevBtn.textContent = '← Câu trước';
  prevBtn.disabled = examIndex === 0;
  prevBtn.addEventListener('click', () => { examIndex--; renderExamQuestion(); });

  const counter = document.createElement('span');
  counter.className = 'q-counter';
  counter.textContent = `${examIndex + 1} / ${filtered.length}`;

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = isLast ? 'btn primary' : 'btn';
  nextBtn.textContent = isLast ? '✓ Nộp bài' : 'Câu tiếp →';
  nextBtn.addEventListener('click', () => {
    if (isLast) submitExam();
    else { examIndex++; renderExamQuestion(); }
  });

  nav.append(prevBtn, counter, nextBtn);
  area.appendChild(nav);
}

function submitExam() {
  const area = document.getElementById('quiz-area');
  area.innerHTML = '';

  let correct = 0;

  // Score box first
  const box = document.createElement('div');
  box.className = 'result-box';
  area.appendChild(box);

  area.appendChild(makeResultBar());

  // All questions review
  filtered.forEach((q, qi) => {
    const chosen = examAnswers[qi];
    const correctIdx = parseInt(q.answer, 10);
    if (chosen === correctIdx) correct++;

    const card = document.createElement('div');
    card.className = 'question-card';

    const qmeta = document.createElement('div');
    qmeta.className = 'q-meta';
    qmeta.textContent = `Câu ${qi + 1}/${filtered.length} · ${LEVEL_LABEL[q.level] || q.level}`;

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
      btn.disabled = true;
      if (i === correctIdx) btn.classList.add('correct');
      else if (i === chosen && chosen !== correctIdx) btn.classList.add('wrong');
      opts.appendChild(btn);
    });

    const exp = document.createElement('div');
    exp.className = 'explanation show';
    exp.textContent = q.explanation;

    card.append(qmeta, qtext, opts, exp);
    area.appendChild(card);
  });

  // Fill score now that correct is calculated
  box.innerHTML = `<div class="score">${correct}/${filtered.length}</div><p class="score-label">Điểm của bạn · ${Math.round(correct / filtered.length * 100)}%</p>`;
}

init();
