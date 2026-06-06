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
