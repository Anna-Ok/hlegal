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

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
});

// Mobile menu
const burger = document.querySelector('.header__burger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = mobileMenu?.querySelector('.header__mobile-menu-overlay');
const closeBtn = mobileMenu?.querySelector('.header__mobile-menu-close');

function openMenu() {
  mobileMenu.classList.add('header__mobile-menu--open');
  burger.classList.add('header__burger--open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('header__mobile-menu--open');
  burger.classList.remove('header__burger--open');
  document.body.style.overflow = '';
}

burger?.addEventListener('click', openMenu);
overlay?.addEventListener('click', closeMenu);
closeBtn?.addEventListener('click', closeMenu);

// Achievements slider
const slider = document.getElementById('achievementsSlider');
const track = document.getElementById('achievementsTrack');
const dotsContainer = document.getElementById('achievementsDots');
const items = Array.from(track.querySelectorAll('.achievements__item'));
const GAP = 40;
let currentPage = 0;
let totalPages = 1;
let autoplay = null;

function getItemsPerPage() {
  const w = window.innerWidth;
  if (w >= 1024) return 4;
  if (w >= 768) return 2;
  return 1;
}

function setup() {
  const containerWidth = slider.offsetWidth;
  const perPage = getItemsPerPage();
  totalPages = Math.ceil(items.length / perPage);
  const itemWidth = (containerWidth - (perPage - 1) * GAP) / perPage;

  items.forEach(item => { item.style.width = itemWidth + 'px'; });
  currentPage = Math.min(currentPage, totalPages - 1);

  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('button');
    dot.className = 'achievements__dot' + (i === currentPage ? ' achievements__dot--active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    dotsContainer.appendChild(dot);
  }

  goTo(currentPage);
}

function goTo(page) {
  const perPage = getItemsPerPage();
  const containerWidth = slider.offsetWidth;
  const itemWidth = (containerWidth - (perPage - 1) * GAP) / perPage;

  currentPage = page;
  track.style.transform = `translateX(-${page * perPage * (itemWidth + GAP)}px)`;

  dotsContainer.querySelectorAll('.achievements__dot').forEach((dot, i) => {
    dot.classList.toggle('achievements__dot--active', i === page);
  });
}

function startAutoplay() {
  autoplay = setInterval(() => {
    goTo((currentPage + 1) % totalPages);
  }, 4500);
}

function resetAutoplay() {
  clearInterval(autoplay);
  startAutoplay();
}

window.addEventListener('load', () => {
  setup();
  startAutoplay();
});

window.addEventListener('resize', () => {
  setup();
  resetAutoplay();
});

slider.addEventListener('mouseenter', () => clearInterval(autoplay));
slider.addEventListener('mouseleave', startAutoplay);

// Reveal on scroll
const reveals = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));
