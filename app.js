const state = { lang: localStorage.getItem('lang') || 'ru', dict: {} };

async function loadLang(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  state.dict = await res.json();
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelector('#lang-code').textContent = lang.toUpperCase();
  const mobileLangCode = document.querySelector('#mobile-lang-code');
  if (mobileLangCode) mobileLangCode.textContent = lang.toUpperCase();
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
  // language menu (desktop)
  const btn = document.getElementById('lang-btn');
  const menu = document.getElementById('lang-menu');
  btn.addEventListener('click', () => menu.style.display = menu.style.display === 'block' ? 'none' : 'block');
  menu.querySelectorAll('li').forEach(li => li.addEventListener('click', () => {
    menu.style.display = 'none';
    loadLang(li.dataset.lang);
  }));
  document.addEventListener('click', e => { if (!btn.contains(e.target) && !menu.contains(e.target)) menu.style.display='none'; });

  // language menu (mobile)
  const mobileBtn = document.getElementById('mobile-lang-btn');
  const mobileMenu = document.getElementById('mobile-lang-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block');
    mobileMenu.querySelectorAll('li').forEach(li => li.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
      loadLang(li.dataset.lang);
    }));
    document.addEventListener('click', e => { 
      if (mobileBtn && mobileMenu && !mobileBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.style.display='none';
      }
    });
  }

  // hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileNavMenu = document.getElementById('mobile-menu');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNavMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on links
  mobileNavMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNavMenu.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNavMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileNavMenu.classList.remove('active');
    }
  });

  // boot
  loadLang(state.lang);
});
