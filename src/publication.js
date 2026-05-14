import './utils/scrollToTop.js'
import './styles/main.scss'
import { publications } from './data/publications.js'

// ── Boilerplate ───────────────────────────────────────────────────────────────

const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('preloader--hidden');
    document.body.classList.add('is-loaded');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    startReveal();
  }, 1400);
});

const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
});

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

document.querySelectorAll('.header__lang-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.header__lang-link').forEach(l => l.classList.remove('header__lang-link--active'));
    link.classList.add('header__lang-link--active');
  });
});

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

  requestAnimationFrame(() => {
    document.querySelectorAll('.publications__item').forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.dataset.delay = 100 + i * 80;
      revealObserver.observe(el);
    });
  });
}

// ── Article rendering ─────────────────────────────────────────────────────────

function groupPublicationTextBlocks(container) {
  const groupableSelectors = 'ol, ul, p';

  container.querySelectorAll('.pub-subheading').forEach((heading) => {
    const next = heading.nextElementSibling;
    if (!next?.matches(groupableSelectors)) return;

    const group = document.createElement('div');
    group.className = 'pub-text-group';
    heading.parentNode.insertBefore(group, heading);
    group.append(heading, next);
  });
}

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const article = publications.find(p => p.id === id) || publications[0];

document.title = `${article.title} — hlegal Law Company`;

const articleEl = document.getElementById('pub-article');
const heroEl    = document.getElementById('pub-hero');
const heroImg   = document.getElementById('pub-hero-img');
const titleEl   = document.getElementById('pub-title');
const dateEl    = document.getElementById('pub-date');
const bodyEl    = document.getElementById('pub-body');

if (article.cover) {
  heroImg.src = article.cover;
  heroImg.alt = article.title;
} else {
  heroEl.remove();
  articleEl.classList.add('pub-article--no-cover');
}

titleEl.textContent = article.title;
dateEl.textContent  = article.date;
dateEl.setAttribute('datetime', article.datetime);
bodyEl.innerHTML    = article.body;
groupPublicationTextBlocks(bodyEl);

// Reveal body blocks with stagger
bodyEl.querySelectorAll('p, .pub-highlight, .pub-text-group, .pub-figure').forEach((el, i) => {
  el.setAttribute('data-reveal', '');
  el.dataset.delay = i * 80;
});

// ── Recommended cards ─────────────────────────────────────────────────────────

const recommended = publications
  .filter(p => p.id !== article.id)
  .slice(0, 3);

const listEl = document.getElementById('pub-recommended-list');
listEl.innerHTML = recommended.map((p, i) => `
  <li class="publications__item" data-reveal data-delay="${100 + i * 100}">
    <a href="/publication.html?id=${p.id}" class="publications__card-link">
      <article class="publications__card">
        ${p.cover
          ? `<div class="publications__card-image" style="background-image:url('${p.cover}');background-size:cover;background-position:center;"></div>`
          : ''}
        <div class="publications__card-body${p.cover ? '' : ' publications__card-body--no-image'}">
          <p class="publications__card-title">${p.title}</p>
          <time class="publications__card-date" datetime="${p.datetime}">${p.date}</time>
          <p class="publications__card-text">${p.intro}</p>
        </div>
      </article>
    </a>
  </li>
`).join('');
