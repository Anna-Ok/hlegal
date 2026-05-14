import './styles/main.scss'

const MEMBERS = {
  alex: {
    name: 'Alexander Alexandrovsky',
    role: 'Managing partner',
    email: 'alex@forstudy.space',
    linkedin: '#',
    photo: './src/assets/alex.webp',
    bio: [
      'Alexander heads the corporate and M&A practice. He specialises in complex cross-border transactions, corporate restructuring, and dispute resolution for leading Ukrainian and international companies.',
      'He advises clients on mergers, acquisitions, joint ventures, and the full range of corporate governance issues.',
    ],
    education: 'Kyiv National Taras Shevchenko University, Master of Law.',
    experience: 'Over 15 years of experience advising major corporations and financial institutions. Represents clients before Ukrainian courts and international arbitration tribunals including ICC, SCC, and UNCITRAL.',
  },
  evgeny: {
    name: 'Evgeny Patrikov',
    role: 'Equity partner, Attorney-at-law',
    email: 'patrikov@forstudy.space',
    linkedin: '#',
    photo: './src/assets/evgeny.webp',
    bio: [
      'Evgeny leads the litigation and dispute resolution practice. He has extensive experience representing clients in commercial, tax, and administrative disputes.',
      'He advises domestic and foreign clients on a wide range of litigation matters and enforcement proceedings.',
    ],
    education: 'National Law University named after Yaroslav Mudryi, Master of Law.',
    experience: 'More than 12 years of courtroom experience across all levels of Ukrainian judiciary. Regularly represents clients in the Supreme Court of Ukraine and specialised courts.',
  },
  vlad: {
    name: 'Vladislav Melnik',
    role: 'Associate',
    email: 'melnik@forstudy.space',
    linkedin: '#',
    photo: './src/assets/vlad.webp',
    bio: [
      'Vladislav focuses on real estate, construction law, and land relations. He assists clients throughout the full property transaction cycle, from due diligence to registration.',
      'He also advises on urban planning regulations and permit procedures.',
    ],
    education: 'Kyiv National University of Construction and Architecture, Master of Law.',
    experience: 'Five years of practice in real estate and land law. Has supported over 100 property transactions and permit procedures for residential and commercial developers.',
  },
  sergey: {
    name: 'Sergey Binn',
    role: 'Associate',
    email: 'binn@forstudy.space',
    linkedin: '#',
    photo: './src/assets/sergey.webp',
    bio: [
      'Sergey specialises in tax law and financial regulation. He advises businesses on tax planning, transfer pricing, and representing clients in disputes with fiscal authorities.',
      'He has significant experience with VAT refund procedures and tax audit support.',
    ],
    education: 'Ivan Franko National University of Lviv, Master of Law.',
    experience: 'Seven years advising companies on Ukrainian tax law. Successfully resolved major tax disputes totalling over UAH 500 million for clients in manufacturing, retail, and IT sectors.',
  },
  oksana: {
    name: 'Oksana Kobzar',
    role: 'Equity partner, Attorney-at-law',
    email: 'kobzar@forstudy.space',
    linkedin: '#',
    photo: './src/assets/oksana.webp',
    bio: [
      'Oksana heads the practice of international trade and shipping. She specialises in resolving disputes related to the purchase and sale of raw materials and transportation of goods by sea.',
      'She represents the interests of shipowners, freight forwarders, cargo owners, shipping agents, container lines, as well as international banks and P&I clubs.',
    ],
    education: 'National University "Odessa Law Academy", Master of Law.',
    experience: 'Her professional experience includes resolving disputes under English law and representing interests in foreign commercial arbitrations such as GAFTA, FOSFA and LMAA. She also represents the interests of clients in the state courts of Ukraine on similar disputes, as well as in the ICAC and IAC at the CCI of Ukraine.',
  },
  julia: {
    name: 'Julia Wolk',
    role: 'Associate, Attorney-at-law',
    email: 'wolk@forstudy.space',
    linkedin: '#',
    photo: './src/assets/julia.webp',
    bio: [
      'Julia focuses on employment law and immigration. She advises employers and employees on labour relations, employment contracts, and workforce restructuring.',
      'She also manages work permit and residency applications for foreign nationals working in Ukraine.',
    ],
    education: 'Taras Shevchenko National University of Kyiv, Master of Law.',
    experience: 'Six years of practice in employment and immigration law. Has advised over 50 international companies on Ukrainian labour compliance and supported hundreds of work permit applications.',
  },
};

function renderMember(id) {
  const member = MEMBERS[id];
  if (!member) {
    document.querySelector('.member__inner').innerHTML = '<p style="padding:40px;color:#9E9EA8">Member not found.</p>';
    return;
  }

  document.title = `${member.name} — hlegal Law Company`;

  const photo = document.getElementById('memberPhoto');
  photo.src = member.photo;
  photo.alt = member.name;

  document.getElementById('memberName').textContent = member.name;
  document.getElementById('memberRole').textContent = member.role;

  const emailEl = document.getElementById('memberEmail');
  emailEl.textContent = member.email;
  emailEl.href = `mailto:${member.email}`;

  document.getElementById('memberLinkedin').href = member.linkedin;
  document.getElementById('memberEducation').textContent = member.education;
  document.getElementById('memberExperience').textContent = member.experience;

  const bioEl = document.getElementById('memberBio');
  bioEl.innerHTML = member.bio.map(p => `<p class="member__bio-para">${p}</p>`).join('');
}

// ── Init ──────────────────────────────────────────────────────────────────────

const params = new URLSearchParams(window.location.search);
renderMember(params.get('id') || 'oksana');

// ── Preloader ─────────────────────────────────────────────────────────────────

const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('preloader--hidden');
    document.body.classList.add('is-loaded');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    startReveal();
  }, 1400);
});

// ── Cursor ────────────────────────────────────────────────────────────────────

const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
});

// ── Burger menu ───────────────────────────────────────────────────────────────

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

// ── Scroll reveal ─────────────────────────────────────────────────────────────

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = Number(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('is-visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });

function startReveal() {
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}
