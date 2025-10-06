const state = { lang: localStorage.getItem('lang') || 'ru', dict: {} };

async function loadLang(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  state.dict = await res.json();
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelector('#lang-code').textContent = lang.toUpperCase();
  applyI18n();
}

function t(path) {
  return path.split('.').reduce((o, k) => (o || {})[k], state.dict) ?? '';
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // language menu
  const btn = document.getElementById('lang-btn');
  const menu = document.getElementById('lang-menu');
  btn.addEventListener('click', () => menu.style.display = menu.style.display === 'block' ? 'none' : 'block');
  menu.querySelectorAll('li').forEach(li => li.addEventListener('click', () => {
    menu.style.display = 'none';
    loadLang(li.dataset.lang);
  }));
  document.addEventListener('click', e => { if (!btn.contains(e.target) && !menu.contains(e.target)) menu.style.display='none'; });

  // boot
  loadLang(state.lang);
});
