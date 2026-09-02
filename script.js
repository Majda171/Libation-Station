document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('is-open');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    });
  });
}

const siteHeader = document.querySelector('.site-header');
const updateHeader = () => {
  if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Mobile menu categories. Desktop keeps the original two-card layout.
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCategories = document.querySelectorAll('[data-menu-category]');
if (menuTabs.length && menuCategories.length) {
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.menuTarget;
      menuTabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      menuCategories.forEach(category => {
        category.classList.toggle('is-active', category.dataset.menuCategory === target);
      });
    });
  });
}

// Today's opening hours in Prague time; does not try to infer live open/closed state.
const todayHours = document.getElementById('today-hours');
if (todayHours) {
  const dayName = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'Europe/Prague'
  }).format(new Date());
  const schedule = {
    Monday: 'Zavřeno',
    Tuesday: '16:00–23:00',
    Wednesday: '16:00–23:00',
    Thursday: '16:00–23:00',
    Friday: '16:00–04:00',
    Saturday: '16:00–04:00',
    Sunday: '16:00–23:00'
  };
  todayHours.textContent = `Dnes · ${schedule[dayName] || ''}`;
}

// Original gallery behaviour: one image visible, smooth auto-slide every 3 seconds.
const slider = document.querySelector('.photogallery .slider');
if (slider && slider.children.length > 1) {
  window.setInterval(() => {
    const firstImage = slider.children[0];
    slider.style.transition = 'transform 1.5s ease-in-out';
    slider.style.transform = 'translateX(-100%)';

    window.setTimeout(() => {
      slider.style.transition = 'none';
      slider.style.transform = 'translateX(0)';
      slider.appendChild(firstImage);
      void slider.offsetWidth;
    }, 1500);
  }, 3000);
}

// Reliable back-to-top behaviour for footer logo and "Nahoru".
document.querySelectorAll('.to-top').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});
