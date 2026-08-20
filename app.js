
const now = new Date();
const greeting = document.getElementById('greeting');
const todayLabel = document.getElementById('todayLabel');
const hour = now.getHours();

greeting.textContent =
  hour < 12 ? 'Good morning' :
  hour < 18 ? 'Good afternoon' : 'Good evening';

todayLabel.textContent = new Intl.DateTimeFormat('zh-CN', {
  weekday:'long',
  year:'numeric',
  month:'long',
  day:'numeric'
}).format(now);

// PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn?.classList.remove('hidden');
});

installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add('hidden');
});

window.addEventListener('appinstalled', () => {
  installBtn?.classList.add('hidden');
});

// ---------- Quick Capture / Inbox ----------
const STORAGE_KEY = 'ai_workspace_inbox';
const captureDialog = document.getElementById('captureDialog');
const captureText = document.getElementById('captureText');
const quickAdd = document.getElementById('quickAdd');
const saveCapture = document.getElementById('saveCapture');

function getInbox() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveInbox(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  })[ch]);
}

function renderInbox() {
  const container = document.getElementById('inboxList');
  if (!container) return;

  const items = getInbox();

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-card">
        <strong>Inbox 还是空的</strong>
        <p>点底部中央的「＋」记录一个想法，保存后会出现在这里。</p>
      </div>`;
    return;
  }

  container.innerHTML = items.map((item, index) => {
    const d = new Date(item.createdAt);
    const timeLabel = Number.isNaN(d.getTime()) ? '' :
      new Intl.DateTimeFormat('zh-CN', {
        month:'short',
        day:'numeric',
        hour:'2-digit',
        minute:'2-digit'
      }).format(d);

    return `
      <article class="inbox-item">
        <div>
          <p>${escapeHtml(item.text)}</p>
          <time>${timeLabel}</time>
        </div>
        <button class="delete-btn" data-delete="${index}">删除</button>
      </article>`;
  }).join('');

  container.querySelectorAll('[data-delete]').forEach(button => {
    button.addEventListener('click', () => {
      const items = getInbox();
      items.splice(Number(button.dataset.delete), 1);
      saveInbox(items);
      renderInbox();
    });
  });
}

quickAdd?.addEventListener('click', () => {
  captureDialog?.showModal();
  setTimeout(() => captureText?.focus(), 50);
});

saveCapture?.addEventListener('click', (event) => {
  const text = captureText?.value.trim() || '';

  if (!text) {
    event.preventDefault();
    return;
  }

  const items = getInbox();
  items.unshift({
    text,
    createdAt: new Date().toISOString()
  });

  saveInbox(items);
  captureText.value = '';
  renderInbox();
});

document.getElementById('clearInboxBtn')?.addEventListener('click', () => {
  if (confirm('确定要清空 Inbox 里的全部记录吗？')) {
    saveInbox([]);
    renderInbox();
  }
});

// ---------- Navigation ----------
const views = {
  home: document.getElementById('homeView'),
  projects: document.getElementById('projectsView'),
  inbox: document.getElementById('inboxView'),
  me: document.getElementById('meView')
};

function showView(name) {
  Object.values(views).forEach(view => {
    view?.classList.add('hidden-view');
  });

  views[name]?.classList.remove('hidden-view');

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === name);
  });

  if (name === 'inbox') {
    renderInbox();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-item').forEach(button => {
  button.addEventListener('click', () => {
    showView(button.dataset.view);
  });
});

renderInbox();
