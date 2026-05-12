import './styles/main.scss'

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

const dots = document.querySelectorAll('.team__dot');
const track = document.querySelector('.team__track');

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    dots.forEach(d => d.classList.remove('team__dot--active'));
    dot.classList.add('team__dot--active');
    track.style.transform = `translateX(-${index * 100}%)`;
  });
});
