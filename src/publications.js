import './utils/scrollToTop.js'
import './styles/main.scss'
import { publications } from './data/publications.js'

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
    revealPublicationItems(document.querySelectorAll('.publications__item:not([hidden])'));
  });
}

function revealPublicationItems(nodes) {
  nodes.forEach((el, i) => {
    if (el.classList.contains('is-visible')) return;
    el.setAttribute('data-reveal', '');
    el.dataset.delay = String(100 + i * 80);
    revealObserver.observe(el);
  });
}

// Tabs filtering + random load more
const INITIAL_VISIBLE = 6;
const LOAD_BATCH = 3;
const tabs = document.querySelectorAll('.pub-page__tab');
const listEl = document.getElementById('pub-list');
const moreBtn = document.getElementById('pub-more-btn');
const moreWrap = document.querySelector('.pub-page__more');

function getActiveCategory() {
  return document.querySelector('.pub-page__tab--active')?.dataset.tab || 'news';
}

function getListItems() {
  return listEl ? Array.from(listEl.querySelectorAll('.publications__item')) : [];
}

function getPublicationId(item) {
  const href = item.querySelector('a')?.getAttribute('href') || '';
  return new URLSearchParams(href.split('?')[1] || '').get('id');
}

function getVisibleIds(category) {
  return getListItems()
    .filter(item => !item.hidden)
    .map(getPublicationId)
    .filter(Boolean);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createPublicationItem(pub, extraOn) {
  const item = document.createElement('li');
  item.className = 'publications__item';
  item.dataset.category = pub.category;
  item.dataset.extraOn = extraOn;

  const cover = pub.cover
    ? `<div class="publications__card-image" style="background-image:url('${pub.cover}');background-size:cover;background-position:center;"></div>`
    : '';

  item.innerHTML = `
    <a href="publication.html?id=${pub.id}" class="publications__card-link">
      <article class="publications__card">
        ${cover}
        <div class="publications__card-body${pub.cover ? '' : ' publications__card-body--no-image'}">
          <p class="publications__card-title">${pub.title}</p>
          <time class="publications__card-date" datetime="${pub.datetime}">${pub.date}</time>
          <p class="publications__card-text">${pub.intro}</p>
        </div>
      </article>
    </a>
  `;

  return item;
}

function getStaticCategoryCount(category) {
  return getListItems().filter(item => !item.dataset.extraOn && item.dataset.category === category).length;
}

function updatePublicationsList() {
  const category = getActiveCategory();

  getListItems().forEach(item => {
    if (item.dataset.extraOn) {
      item.hidden = item.dataset.extraOn !== category;
      return;
    }

    if (item.dataset.category !== category) {
      item.hidden = true;
      return;
    }

    const index = getListItems()
      .filter(listItem => !listItem.dataset.extraOn && listItem.dataset.category === category)
      .indexOf(item);
    item.hidden = index < 0 || (category === 'news' && index >= INITIAL_VISIBLE);
  });

  const visibleIds = new Set(getVisibleIds(category));
  const canLoadMore = publications.some(pub => !visibleIds.has(pub.id));
  const showMoreButton = category === 'news'
    && getStaticCategoryCount(category) >= INITIAL_VISIBLE
    && canLoadMore;

  if (moreWrap) moreWrap.hidden = !showMoreButton;
  if (moreBtn) {
    moreBtn.disabled = !showMoreButton;
    moreBtn.setAttribute('aria-expanded', String(!showMoreButton));
  }
}

function clearExtraItems() {
  getListItems()
    .filter(item => item.dataset.extraOn)
    .forEach(item => item.remove());
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('pub-page__tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('pub-page__tab--active');
    tab.setAttribute('aria-selected', 'true');
    clearExtraItems();
    updatePublicationsList();
    revealPublicationItems(getListItems().filter(item => !item.hidden));
  });
});

moreBtn?.addEventListener('click', () => {
  const category = getActiveCategory();
  const visibleIds = new Set(getVisibleIds(category));
  const picked = shuffle(publications.filter(pub => !visibleIds.has(pub.id))).slice(0, LOAD_BATCH);

  picked.forEach(pub => {
    const item = createPublicationItem(pub, category);
    listEl.appendChild(item);
    revealPublicationItems([item]);
  });

  updatePublicationsList();
});

if (document.querySelector('.pub-page__tab--active')) {
  updatePublicationsList();
}
