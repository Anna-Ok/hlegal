import './utils/scrollToTop.js'
import './styles/main.scss'

// Preloader
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('preloader--hidden');
    document.body.classList.add('is-loaded');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  }, 1400);
});

// Custom cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, [data-tab]').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
});

// Active nav link on scroll
const navLinks = document.querySelectorAll('.header__nav-link');
const mobileLabel = document.querySelector('.header__mobile-label');
const sections = document.querySelectorAll('section[id], footer[id]');

const sectionIdFromHref = (href) => {
  if (!href || !href.startsWith('#')) return null;
  return href.slice(1);
};

const updateActiveSection = () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id || current;
    }
  });

  navLinks.forEach(link => {
    const sectionId = sectionIdFromHref(link.getAttribute('href') || '');
    link.classList.toggle('header__nav-link--active', sectionId !== null && sectionId === current);
  });

  document.querySelectorAll('.header__mobile-nav-link').forEach(link => {
    const sectionId = sectionIdFromHref(link.getAttribute('href') || '');
    link.classList.toggle('header__mobile-nav-link--active', sectionId !== null && sectionId === current);
  });

  if (mobileLabel && current) {
    mobileLabel.textContent = current.replace('-', ' ');
  }
};

window.addEventListener('scroll', updateActiveSection, { passive: true });
updateActiveSection();

// Burger menu
const burger = document.querySelector('.header__burger');
const mobileMenu = document.querySelector('.header__mobile-menu');

const closeMenu = () => {
  mobileMenu.classList.remove('header__mobile-menu--open');
  burger.classList.remove('header__burger--open');
  document.body.style.overflow = '';
};

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('header__mobile-menu--open');
    burger.classList.toggle('header__burger--open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) updateActiveSection();
  });

  mobileMenu.querySelector('.header__mobile-menu-close')?.addEventListener('click', closeMenu);
  mobileMenu.querySelector('.header__mobile-menu-overlay')?.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('.header__mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Language switcher
const langLinks = document.querySelectorAll('.header__lang-link');

langLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    langLinks.forEach(l => l.classList.remove('header__lang-link--active'));
    link.classList.add('header__lang-link--active');
  });
});

// About tabs
const aboutItems = document.querySelectorAll('.about__list-item');
const aboutPanels = document.querySelectorAll('.about__panel');

aboutItems.forEach(item => {
  item.addEventListener('click', () => {
    const tab = item.dataset.tab;
    aboutItems.forEach(i => i.classList.remove('about__list-item--active'));
    aboutPanels.forEach(p => p.classList.remove('about__panel--active'));
    item.classList.add('about__list-item--active');
    document.querySelector(`.about__panel[data-tab="${tab}"]`).classList.add('about__panel--active');
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = Number(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('is-visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

requestAnimationFrame(() => {
  [
    { sel: '.services__item', type: '',      step: 80  },
    { sel: '.clients__item',  type: 'scale', step: 45  },
    { sel: '.publications__card', type: '',  step: 120 },
  ].forEach(({ sel, type, step }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', type);
      el.dataset.delay = i * step;
      revealObserver.observe(el);
    });
  });
});

const dots = document.querySelectorAll('.team__dot');
const track = document.querySelector('.team__track');

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    dots.forEach(d => d.classList.remove('team__dot--active'));
    dot.classList.add('team__dot--active');
    track.style.transform = `translateX(-${index * 100}%)`;
  });
});
