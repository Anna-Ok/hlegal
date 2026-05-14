import './styles/main.scss'

// Preloader
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('preloader--hidden');
    document.body.classList.add('is-loaded');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    startReveal();
  }, 1400);
});

// Custom cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
});

// Burger menu
const burger = document.querySelector('.header__burger');
const mobileMenu = document.querySelector('.header__mobile-menu');

const closeMenu = () => {
  mobileMenu?.classList.remove('header__mobile-menu--open');
  burger?.classList.remove('header__burger--open');
  document.body.style.overflow = '';
};

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('header__mobile-menu--open');
    burger.classList.toggle('header__burger--open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelector('.header__mobile-menu-close')?.addEventListener('click', closeMenu);
  mobileMenu.querySelector('.header__mobile-menu-overlay')?.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('.header__mobile-nav-link').forEach(link => link.addEventListener('click', closeMenu));
}

// Language switcher
document.querySelectorAll('.header__lang-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.header__lang-link').forEach(l => l.classList.remove('header__lang-link--active'));
    link.classList.add('header__lang-link--active');
  });
});

// Input clear buttons
document.querySelectorAll('.contact-page__field').forEach(field => {
  const input = field.querySelector('.contact-page__input');
  const clear = field.querySelector('.contact-page__clear');

  input.addEventListener('input', () => {
    field.classList.toggle('contact-page__field--filled', input.value.length > 0);
  });

  clear.addEventListener('click', () => {
    input.value = '';
    field.classList.remove('contact-page__field--filled');
    input.focus();
  });
});

// Form submit
document.querySelector('.contact-page__form')?.addEventListener('submit', e => e.preventDefault());

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = Number(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('is-visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

function startReveal() {
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}
