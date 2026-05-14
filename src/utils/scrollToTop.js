if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  window.scrollTo(0, 0);
});
