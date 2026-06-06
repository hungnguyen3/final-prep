# Quiz Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static multi-page quiz web app for exam review across 4 subjects (DEVOPS, RL, TKM, CI/CD), deployable to GitHub Pages.

**Architecture:** Pure HTML/CSS/JS, no framework. Three HTML pages (index, subject, chapter) share one CSS file and two JS files. All question/theory data lives in per-subject JSON files fetched at runtime via `fetch()`. Navigation uses query strings (`?subject=devops&chapter=1`).

**Tech Stack:** HTML5, CSS3 (vanilla), JavaScript ES6+ (modules via `<script type="module">`), GitHub Pages

---

## File Map

| File | Role |
|------|------|
| `index.html` | Trang chủ — grid 4 môn |
| `subject.html` | Trang môn — danh sách chương |
| `chapter.html` | Trang chương — tab lý thuyết + quiz |
| `css/style.css` | Toàn bộ giao diện (tối giản, responsive) |
| `js/app.js` | Render trang chủ + trang môn, helper `getParams()` |
| `js/quiz.js` | Render trang chương, logic luyện tập + thi thử |
| `data/devops/meta.json` | Metadata môn DevOps |
| `data/devops/chapter1.json` | Lý thuyết + câu hỏi chương 1 DevOps (sample) |
| `data/rl/meta.json` | Metadata môn RL |
| `data/rl/chapter1.json` | Sample chương 1 RL |
| `data/tkm/meta.json` | Metadata môn TKM |
| `data/tkm/chapter1.json` | Sample chương 1 TKM |
| `data/cicd/meta.json` | Metadata môn CI/CD |
| `data/cicd/chapter1.json` | Sample chương 1 CI/CD |

---

## Task 1: CSS — Giao diện tối giản

**Files:**
- Create: `css/style.css`

- [ ] **Step 1: Tạo file CSS với reset, variables, layout cơ bản**

```css
/* css/style.css */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #ffffff;
  --surface: #f5f5f5;
  --border: #e0e0e0;
  --text: #1a1a1a;
  --text-muted: #666666;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --correct: #16a34a;
  --correct-bg: #dcfce7;
  --wrong: #dc2626;
  --wrong-bg: #fee2e2;
  --radius: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

.container { max-width: 900px; margin: 0 auto; padding: 0 1rem; }

/* Header */
header {
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
  margin-bottom: 2rem;
}
header .container { display: flex; align-items: center; gap: 1rem; }
header h1 { font-size: 1.25rem; font-weight: 700; }
header h1 a { text-decoration: none; color: var(--text); }

/* Breadcrumb */
.breadcrumb { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; }
.breadcrumb a { color: var(--primary); text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb span { margin: 0 0.4rem; }

/* Cards grid */
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
  text-decoration: none;
  color: var(--text);
  display: block;
}
.card:hover { box-shadow: var(--shadow); border-color: var(--primary); }
.card h2 { font-size: 1.1rem; margin-bottom: 0.4rem; }
.card p { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.75rem; }
.card .meta { font-size: 0.8rem; color: var(--text-muted); }

/* Page title */
.page-title { margin-bottom: 0.5rem; font-size: 1.75rem; }
.page-desc { color: var(--text-muted); margin-bottom: 1.5rem; }

/* Tabs */
.tabs { display: flex; gap: 0; border-bottom: 2px solid var(--border); margin-bottom: 1.5rem; }
.tab-btn {
  padding: 0.6rem 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.15s;
}
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 600; }
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* Theory */
.theory-section { margin-bottom: 1.5rem; }
.theory-section h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
.theory-section p { color: var(--text-muted); }

/* Quiz controls */
.quiz-controls { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem; }
.btn {
  padding: 0.5rem 1.1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s, border-color 0.15s;
}
.btn:hover { background: var(--border); }
.btn.primary { background: var(--primary); color: #fff; border-color: var(--primary); }
.btn.primary:hover { background: var(--primary-hover); border-color: var(--primary-hover); }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

select {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 0.9rem;
  cursor: pointer;
}

/* Question card */
.question-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 1rem;
}
.question-card .q-meta { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.question-card .q-text { font-size: 1rem; font-weight: 500; margin-bottom: 1rem; }
.options { display: flex; flex-direction: column; gap: 0.5rem; }
.option-btn {
  text-align: left;
  padding: 0.6rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.15s, border-color 0.15s;
}
.option-btn:hover:not(:disabled) { border-color: var(--primary); background: #eff6ff; }
.option-btn.correct { background: var(--correct-bg); border-color: var(--correct); color: var(--correct); }
.option-btn.wrong { background: var(--wrong-bg); border-color: var(--wrong); color: var(--wrong); }
.option-btn:disabled { cursor: default; }

.explanation {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  border-radius: 0 var(--radius) var(--radius) 0;
  font-size: 0.875rem;
  display: none;
}
.explanation.show { display: block; }

/* Quiz navigation */
.quiz-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
.q-counter { font-size: 0.875rem; color: var(--text-muted); }

/* Result */
.result-box {
  text-align: center;
  padding: 2rem;
  background: var(--surface);
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}
.result-box .score { font-size: 2.5rem; font-weight: 700; color: var(--primary); }
.result-box .score-label { color: var(--text-muted); }

/* Empty state */
.empty { text-align: center; padding: 3rem; color: var(--text-muted); }

/* Loading */
.loading { text-align: center; padding: 2rem; color: var(--text-muted); }

/* Responsive */
@media (max-width: 600px) {
  .cards { grid-template-columns: 1fr 1fr; }
  .page-title { font-size: 1.4rem; }
}
@media (max-width: 400px) {
  .cards { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/style.css
git commit -m "feat: add base CSS styles"
```

---

## Task 2: Data — JSON mẫu cho 4 môn

**Files:**
- Create: `data/devops/meta.json`
- Create: `data/devops/chapter1.json`
- Create: `data/rl/meta.json`
- Create: `data/rl/chapter1.json`
- Create: `data/tkm/meta.json`
- Create: `data/tkm/chapter1.json`
- Create: `data/cicd/meta.json`
- Create: `data/cicd/chapter1.json`

- [ ] **Step 1: Tạo data/devops/meta.json**

```json
{
  "id": "devops",
  "title": "DevOps",
  "description": "Văn hóa, quy trình và công cụ DevOps",
  "chapters": [
    { "id": 1, "title": "Giới thiệu DevOps" }
  ]
}
```

- [ ] **Step 2: Tạo data/devops/chapter1.json**

```json
{
  "title": "Chương 1: Giới thiệu DevOps",
  "theory": [
    {
      "heading": "DevOps là gì?",
      "content": "DevOps là sự kết hợp giữa Development (phát triển) và Operations (vận hành). Mục tiêu là rút ngắn vòng đời phát triển phần mềm và cung cấp phần mềm chất lượng cao liên tục."
    },
    {
      "heading": "Lợi ích của DevOps",
      "content": "Triển khai nhanh hơn, ít lỗi hơn, phục hồi nhanh khi có sự cố, tăng cường cộng tác giữa team Dev và Ops."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "basic",
      "question": "DevOps là sự kết hợp của?",
      "options": ["Development + Operations", "Design + Optimization", "Deploy + Orchestration", "Data + Operations"],
      "answer": 0,
      "explanation": "DevOps = Development (phát triển) + Operations (vận hành)."
    },
    {
      "id": 2,
      "level": "basic",
      "question": "Mục tiêu chính của DevOps là gì?",
      "options": ["Rút ngắn vòng đời phát triển phần mềm", "Tăng số lượng lập trình viên", "Loại bỏ testing", "Chỉ tập trung vào vận hành"],
      "answer": 0,
      "explanation": "DevOps hướng đến việc rút ngắn chu kỳ phát triển và cung cấp phần mềm liên tục với chất lượng cao."
    },
    {
      "id": 3,
      "level": "intermediate",
      "question": "Thực hành nào KHÔNG thuộc về DevOps?",
      "options": ["Waterfall development", "Continuous Integration", "Infrastructure as Code", "Automated Testing"],
      "answer": 0,
      "explanation": "Waterfall là mô hình phát triển tuần tự truyền thống, không phù hợp với triết lý DevOps vốn đề cao tính liên tục và lặp lại."
    }
  ]
}
```

- [ ] **Step 3: Tạo data/rl/meta.json**

```json
{
  "id": "rl",
  "title": "RL",
  "description": "Reinforcement Learning — Học tăng cường",
  "chapters": [
    { "id": 1, "title": "Giới thiệu Reinforcement Learning" }
  ]
}
```

- [ ] **Step 4: Tạo data/rl/chapter1.json**

```json
{
  "title": "Chương 1: Giới thiệu Reinforcement Learning",
  "theory": [
    {
      "heading": "Reinforcement Learning là gì?",
      "content": "RL là một nhánh của Machine Learning, trong đó một agent học cách hành động trong môi trường để tối đa hóa phần thưởng tích lũy theo thời gian."
    },
    {
      "heading": "Các thành phần cơ bản",
      "content": "Agent, Environment, State (trạng thái), Action (hành động), Reward (phần thưởng), Policy (chính sách)."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "basic",
      "question": "Trong RL, 'agent' là gì?",
      "options": ["Thực thể học và đưa ra quyết định", "Môi trường mà agent hoạt động trong đó", "Phần thưởng nhận được", "Trạng thái hiện tại"],
      "answer": 0,
      "explanation": "Agent là thực thể học hỏi và đưa ra các hành động trong môi trường để tối đa hóa phần thưởng."
    },
    {
      "id": 2,
      "level": "basic",
      "question": "Mục tiêu của agent trong RL là?",
      "options": ["Tối đa hóa tổng phần thưởng tích lũy", "Tối thiểu hóa số bước hành động", "Khám phá toàn bộ môi trường", "Tìm trạng thái khởi đầu tốt nhất"],
      "answer": 0,
      "explanation": "Agent học để tối đa hóa cumulative reward (tổng phần thưởng tích lũy) theo thời gian."
    },
    {
      "id": 3,
      "level": "intermediate",
      "question": "Policy trong RL là gì?",
      "options": ["Hàm ánh xạ từ state sang action", "Hàm tính phần thưởng", "Mô hình của môi trường", "Tập hợp tất cả các state"],
      "answer": 0,
      "explanation": "Policy (π) là chiến lược của agent: ánh xạ từ mỗi state sang action mà agent sẽ thực hiện."
    }
  ]
}
```

- [ ] **Step 5: Tạo data/tkm/meta.json**

```json
{
  "id": "tkm",
  "title": "TKM",
  "description": "Toán kinh tế / Toán kỹ thuật — Tối ưu hóa và mô hình toán",
  "chapters": [
    { "id": 1, "title": "Giới thiệu TKM" }
  ]
}
```

- [ ] **Step 6: Tạo data/tkm/chapter1.json**

```json
{
  "title": "Chương 1: Giới thiệu TKM",
  "theory": [
    {
      "heading": "TKM là gì?",
      "content": "TKM (Toán Kỹ thuật / Toán Kinh tế) nghiên cứu các phương pháp toán học ứng dụng vào giải quyết bài toán kỹ thuật và kinh tế."
    },
    {
      "heading": "Các phương pháp chính",
      "content": "Quy hoạch tuyến tính, quy hoạch động, lý thuyết đồ thị, mô hình xác suất."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "basic",
      "question": "Quy hoạch tuyến tính giải quyết bài toán nào?",
      "options": ["Tối ưu hóa hàm mục tiêu tuyến tính với ràng buộc tuyến tính", "Giải phương trình vi phân", "Tìm nghiệm của đa thức", "Phân tích chuỗi thời gian"],
      "answer": 0,
      "explanation": "Linear Programming (quy hoạch tuyến tính) tìm cực trị của hàm mục tiêu tuyến tính subject to các ràng buộc tuyến tính."
    },
    {
      "id": 2,
      "level": "basic",
      "question": "Phương pháp simplex được dùng để?",
      "options": ["Giải bài toán quy hoạch tuyến tính", "Giải bài toán quy hoạch động", "Tìm đường đi ngắn nhất", "Tối ưu hóa mạng"],
      "answer": 0,
      "explanation": "Simplex là thuật toán cổ điển để giải bài toán quy hoạch tuyến tính."
    },
    {
      "id": 3,
      "level": "intermediate",
      "question": "Trong quy hoạch động, nguyên lý tối ưu Bellman phát biểu?",
      "options": ["Lời giải tối ưu của bài toán con là phần của lời giải tối ưu toàn cục", "Hàm mục tiêu luôn là tuyến tính", "Không thể chia bài toán thành bài toán con", "Chỉ áp dụng cho bài toán có ràng buộc nguyên"],
      "answer": 0,
      "explanation": "Bellman's principle of optimality: một chính sách tối ưu có tính chất là tại bất kỳ state nào, các quyết định còn lại phải tạo thành chính sách tối ưu."
    }
  ]
}
```

- [ ] **Step 7: Tạo data/cicd/meta.json**

```json
{
  "id": "cicd",
  "title": "CI/CD",
  "description": "Continuous Integration / Continuous Deployment",
  "chapters": [
    { "id": 1, "title": "Giới thiệu CI/CD" }
  ]
}
```

- [ ] **Step 8: Tạo data/cicd/chapter1.json**

```json
{
  "title": "Chương 1: Giới thiệu CI/CD",
  "theory": [
    {
      "heading": "CI là gì?",
      "content": "Continuous Integration (CI) là thực hành tích hợp code thường xuyên vào một nhánh chung, kèm theo chạy automated tests để phát hiện lỗi sớm."
    },
    {
      "heading": "CD là gì?",
      "content": "Continuous Delivery/Deployment (CD) là tự động hóa quá trình đưa phần mềm đã được test lên môi trường staging hoặc production."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "basic",
      "question": "CI viết tắt của?",
      "options": ["Continuous Integration", "Continuous Improvement", "Code Integration", "Container Infrastructure"],
      "answer": 0,
      "explanation": "CI = Continuous Integration — tích hợp code liên tục vào nhánh chung."
    },
    {
      "id": 2,
      "level": "basic",
      "question": "Lợi ích chính của CI là?",
      "options": ["Phát hiện lỗi sớm nhờ tích hợp thường xuyên", "Loại bỏ hoàn toàn lỗi phần mềm", "Không cần viết test", "Tăng tốc độ gõ code"],
      "answer": 0,
      "explanation": "CI giúp phát hiện lỗi tích hợp sớm vì code được merge và test thường xuyên."
    },
    {
      "id": 3,
      "level": "intermediate",
      "question": "Sự khác biệt giữa Continuous Delivery và Continuous Deployment là?",
      "options": ["Delivery cần approval thủ công trước khi lên production, Deployment tự động hoàn toàn", "Delivery nhanh hơn Deployment", "Deployment chỉ dùng cho staging", "Không có sự khác biệt"],
      "answer": 0,
      "explanation": "Continuous Delivery: pipeline tự động đến staging, cần bước approve thủ công trước production. Continuous Deployment: tự động deploy lên production không cần can thiệp."
    }
  ]
}
```

- [ ] **Step 9: Commit tất cả data**

```bash
git add data/
git commit -m "feat: add sample JSON data for all 4 subjects"
```

---

## Task 3: app.js — Navigation helper + render trang chủ + trang môn

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: Tạo js/app.js**

```js
// js/app.js
const SUBJECTS = ['devops', 'rl', 'tkm', 'cicd'];

export function getParams() {
  const p = new URLSearchParams(window.location.search);
  return { subject: p.get('subject'), chapter: p.get('chapter') };
}

export async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Cannot fetch ${path}`);
  return res.json();
}

export function renderBreadcrumb(el, items) {
  el.innerHTML = items.map((item, i) =>
    i < items.length - 1
      ? `<a href="${item.href}">${item.label}</a><span>›</span>`
      : `<span>${item.label}</span>`
  ).join('');
}

// --- Trang chủ (index.html) ---
async function initHome() {
  const grid = document.getElementById('subject-grid');
  if (!grid) return;
  grid.innerHTML = '<p class="loading">Đang tải...</p>';

  const metas = await Promise.all(
    SUBJECTS.map(s => fetchJSON(`data/${s}/meta.json`).catch(() => null))
  );

  grid.innerHTML = metas.filter(Boolean).map(m => `
    <a class="card" href="subject.html?subject=${m.id}">
      <h2>${m.title}</h2>
      <p>${m.description}</p>
      <div class="meta">${m.chapters.length} chương</div>
    </a>
  `).join('');
}

// --- Trang môn (subject.html) ---
async function initSubject() {
  const grid = document.getElementById('chapter-grid');
  if (!grid) return;
  const { subject } = getParams();
  if (!subject) { grid.innerHTML = '<p class="empty">Không tìm thấy môn học.</p>'; return; }

  const meta = await fetchJSON(`data/${subject}/meta.json`);

  document.getElementById('subject-title').textContent = meta.title;
  document.getElementById('subject-desc').textContent = meta.description;
  document.title = `${meta.title} — Quiz`;

  renderBreadcrumb(document.getElementById('breadcrumb'), [
    { label: 'Trang chủ', href: 'index.html' },
    { label: meta.title }
  ]);

  // Fetch all chapters to get question counts
  const chapters = await Promise.all(
    meta.chapters.map(c =>
      fetchJSON(`data/${subject}/chapter${c.id}.json`)
        .then(data => ({ ...c, count: data.questions.length }))
        .catch(() => ({ ...c, count: 0 }))
    )
  );

  grid.innerHTML = chapters.map(c => `
    <a class="card" href="chapter.html?subject=${subject}&chapter=${c.id}">
      <h2>Chương ${c.id}</h2>
      <p>${c.title}</p>
      <div class="meta">${c.count} câu hỏi</div>
    </a>
  `).join('');
}

initHome();
initSubject();
```

- [ ] **Step 2: Commit**

```bash
git add js/app.js
git commit -m "feat: add app.js for home and subject page rendering"
```

---

## Task 4: quiz.js — Logic trang chương (lý thuyết + luyện tập + thi thử)

**Files:**
- Create: `js/quiz.js`

- [ ] **Step 1: Tạo js/quiz.js**

```js
// js/quiz.js
import { getParams, fetchJSON, renderBreadcrumb } from './app.js';

const LEVEL_LABEL = { basic: 'Cơ bản', intermediate: 'Trung bình', advanced: 'Nâng cao' };

let allQuestions = [];
let filtered = [];
let currentIndex = 0;
let mode = null; // 'practice' | 'exam'
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

// ---- PRACTICE MODE ----
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

// ---- EXAM MODE ----
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
```

- [ ] **Step 2: Commit**

```bash
git add js/quiz.js
git commit -m "feat: add quiz.js with practice and exam modes"
```

---

## Task 5: index.html — Trang chủ

**Files:**
- Create: `index.html`

- [ ] **Step 1: Tạo index.html**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ôn tập cuối kỳ</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header>
    <div class="container">
      <h1><a href="index.html">Ôn tập cuối kỳ</a></h1>
    </div>
  </header>
  <main class="container">
    <h2 class="page-title">Chọn môn học</h2>
    <p class="page-desc">4 môn · Lý thuyết + Trắc nghiệm từ cơ bản đến nâng cao</p>
    <div class="cards" id="subject-grid">
      <p class="loading">Đang tải...</p>
    </div>
  </main>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add index.html home page"
```

---

## Task 6: subject.html — Trang môn học

**Files:**
- Create: `subject.html`

- [ ] **Step 1: Tạo subject.html**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Môn học — Ôn tập cuối kỳ</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header>
    <div class="container">
      <h1><a href="index.html">Ôn tập cuối kỳ</a></h1>
    </div>
  </header>
  <main class="container">
    <div class="breadcrumb" id="breadcrumb"></div>
    <h2 class="page-title" id="subject-title">Đang tải...</h2>
    <p class="page-desc" id="subject-desc"></p>
    <div class="cards" id="chapter-grid"></div>
  </main>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add subject.html
git commit -m "feat: add subject.html subject page"
```

---

## Task 7: chapter.html — Trang chương (lý thuyết + quiz)

**Files:**
- Create: `chapter.html`

- [ ] **Step 1: Tạo chapter.html**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chương — Ôn tập cuối kỳ</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header>
    <div class="container">
      <h1><a href="index.html">Ôn tập cuối kỳ</a></h1>
    </div>
  </header>
  <main class="container">
    <div class="breadcrumb" id="breadcrumb"></div>
    <h2 class="page-title" id="chapter-title">Đang tải...</h2>

    <div class="tabs">
      <button class="tab-btn active" data-tab="tab-theory">Lý thuyết</button>
      <button class="tab-btn" data-tab="tab-quiz">Trắc nghiệm</button>
    </div>

    <!-- Tab lý thuyết -->
    <div class="tab-panel active" id="tab-theory">
      <div id="theory-content"></div>
    </div>

    <!-- Tab trắc nghiệm -->
    <div class="tab-panel" id="tab-quiz">
      <div class="quiz-controls" id="quiz-controls">
        <select id="level-filter">
          <option value="all">Tất cả cấp độ</option>
          <option value="basic">Cơ bản</option>
          <option value="intermediate">Trung bình</option>
          <option value="advanced">Nâng cao</option>
        </select>
        <button class="btn primary" id="btn-practice">▶ Luyện tập</button>
        <button class="btn" id="btn-exam">📝 Thi thử</button>
      </div>
      <div id="quiz-area"></div>
    </div>
  </main>
  <script type="module" src="js/quiz.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add chapter.html
git commit -m "feat: add chapter.html with theory and quiz tabs"
```

---

## Task 8: GitHub Pages setup

**Files:**
- No new files needed

- [ ] **Step 1: Kiểm tra repo có public không và enable GitHub Pages**

Truy cập: `https://github.com/DoanThao013/final-prep/settings/pages`
- Source: `Deploy from a branch`
- Branch: `main` / `/ (root)`
- Save

- [ ] **Step 2: Push tất cả code lên GitHub**

```bash
git push origin main
```

- [ ] **Step 3: Verify web chạy được**

Truy cập: `https://DoanThao013.github.io/final-prep/`
Kiểm tra:
- Trang chủ hiện 4 card môn học
- Click vào DevOps → hiện danh sách chương
- Click vào Chương 1 → hiện tab Lý thuyết + Trắc nghiệm
- Chế độ Luyện tập: chọn đáp án → highlight đúng/sai + giải thích
- Chế độ Thi thử: làm hết → Nộp bài → hiện điểm

---

## Checklist tổng

- [ ] Task 1: CSS
- [ ] Task 2: JSON data (4 môn)
- [ ] Task 3: app.js
- [ ] Task 4: quiz.js
- [ ] Task 5: index.html
- [ ] Task 6: subject.html
- [ ] Task 7: chapter.html
- [ ] Task 8: GitHub Pages deploy
