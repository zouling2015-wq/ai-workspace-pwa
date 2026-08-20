
const now = new Date();
const greeting = document.getElementById('greeting');
const todayLabel = document.getElementById('todayLabel');
const hour = now.getHours();
greeting.textContent = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
todayLabel.textContent = new Intl.DateTimeFormat('zh-CN', {
  weekday:'long', year:'numeric', month:'long', day:'numeric'
}).format(now);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.classList.remove('hidden');
});
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add('hidden');
});
window.addEventListener('appinstalled', () => installBtn.classList.add('hidden'));

const captureDialog = document.getElementById('captureDialog');
document.getElementById('quickAdd').addEventListener('click', () => captureDialog.showModal());
document.getElementById('saveCapture').addEventListener('click', () => {
  const input = document.getElementById('captureText');
  if (input.value.trim()) {
    const inbox = JSON.parse(localStorage.getItem('ai_workspace_inbox') || '[]');
    inbox.unshift({ text: input.value.trim(), createdAt: new Date().toISOString() });
    localStorage.setItem('ai_workspace_inbox', JSON.stringify(inbox));
    input.value = '';
  }
});

const mainSections = [...document.querySelectorAll('main > section:not(#projectsView)')];
const projectsView = document.getElementById('projectsView');
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    if (view === 'projects') {
      mainSections.forEach(s => s.classList.add('hidden-view'));
      projectsView.classList.remove('hidden-view');
    } else {
      projectsView.classList.add('hidden-view');
      mainSections.forEach(s => s.classList.remove('hidden-view'));
      if (view !== 'home') {
        window.scrollTo({top: 0, behavior:'smooth'});
      }
    }
  });
});
