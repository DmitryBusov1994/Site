document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__link');
  const sections = document.querySelectorAll('section[id]');

  // 1. Header scroll effect
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  }, { passive: true });

  // 2. Mobile menu toggle
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('header__nav--open');
    burger.setAttribute('aria-label',
      nav.classList.contains('header__nav--open') ? 'Закрыть меню' : 'Открыть меню'
    );
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('header__nav--open');
    });
  });

  // 3. Accordion
  const accordion = document.querySelector('.accordion');
  if (accordion) {
    accordion.addEventListener('click', (e) => {
      const trigger = e.target.closest('.accordion__trigger');
      if (!trigger) return;

      const item = trigger.parentElement;
      const panel = trigger.nextElementSibling;
      const isOpen = item.classList.contains('accordion__item--open');

      // Close all others
      accordion.querySelectorAll('.accordion__item--open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('accordion__item--open');
          const p = openItem.querySelector('.accordion__panel');
          const t = openItem.querySelector('.accordion__trigger');
          p.style.maxHeight = '0';
          t.setAttribute('aria-expanded', 'false');
          p.setAttribute('aria-hidden', 'true');
        }
      });

      if (isOpen) {
        panel.style.maxHeight = '0';
        trigger.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
      }

      item.classList.toggle('accordion__item--open');
    });
  }

  // 4. Scroll animations
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger cards in grids
        const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animObserver.observe(el);
  });

  // 5. Active nav link on scroll
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-70px 0px 0px 0px' });

  sections.forEach(section => navObserver.observe(section));

  // 6. Stagger hero elements already visible
  document.querySelectorAll('.hero__content .animate-fade-in').forEach((el, i) => {
    el.style.animationDelay = (0.1 + i * 0.18) + 's';
  });
});
