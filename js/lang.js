// Language management
let currentLang = localStorage.getItem('lang') || 'it';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
  });
  document.querySelectorAll('[data-it]').forEach(el => {
    el.textContent = lang === 'it' ? el.getAttribute('data-it') : el.getAttribute('data-en');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
});
