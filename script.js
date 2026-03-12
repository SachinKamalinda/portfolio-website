/* ================================================
   SACHIN KAMALINDA – PORTFOLIO SCRIPT
   ================================================ */

'use strict';

/* ===================================================================
   TYPEWRITER EFFECT
   =================================================================== */
const phrases = [
  'Full-Stack Developer',
  'CS Undergraduate',
  'React Developer',
  'Problem Solver',
  'ML Enthusiast',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

const typewriterEl = document.getElementById('typewriter');

function typeWriter() {
  if (!typewriterEl) return;

  const current = phrases[phraseIndex];

  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  // Finished typing — pause then delete
  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => {
      isDeleting = true;
      typeWriter();
    }, 2200);
    return;
  }

  // Finished deleting — move to next phrase
  if (isDeleting && charIndex === 0) {
    isDeleting   = false;
    phraseIndex  = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(typeWriter, isDeleting ? 55 : 95);
}

// Start after hero animations settle
setTimeout(typeWriter, 1600);


/* ===================================================================
   NAVBAR — scroll style + active link tracking
   =================================================================== */
const navbar = document.getElementById('navbar');

function onScroll() {
  // Scrolled style
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  updateActiveLink();
}

function updateActiveLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const threshold = window.scrollY + window.innerHeight * 0.3;

  let activeId = null;

  sections.forEach(section => {
    if (section.offsetTop <= threshold) {
      activeId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${activeId}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
// Run once on load to set initial active state
onScroll();


/* ===================================================================
   MOBILE MENU — hamburger toggle
   =================================================================== */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close menu when a nav link is clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (
    navMenu.classList.contains('open') &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});


/* ===================================================================
   SCROLL-TRIGGERED REVEAL ANIMATIONS
   =================================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after first reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ===================================================================
   SMOOTH SCROLL — anchor links
   =================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ===================================================================
   PROJECT CARDS — tilt effect on hover
   =================================================================== */
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;   // max ±5deg
    const rotY = ((x - cx) / cx) *  5;

    card.style.transform  = `translateY(-7px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease';
  });
});


/* ===================================================================
   SKILL TAG — subtle color cycle on hover (handled via CSS),
   but add a ripple click effect here
   =================================================================== */
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', function () {
    this.style.transform = 'scale(0.92)';
    setTimeout(() => { this.style.transform = ''; }, 140);
  });
});


/* ===================================================================
   CONTACT ITEM — copy-to-clipboard on Ctrl+Click
   =================================================================== */
document.querySelectorAll('.contact-item').forEach(item => {
  item.addEventListener('click', async e => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();

    const valueEl = item.querySelector('.ci-value');
    if (!valueEl) return;

    const text = valueEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      const original = valueEl.textContent;
      valueEl.textContent = 'Copied!';
      setTimeout(() => { valueEl.textContent = original; }, 1500);
    } catch (_) {
      // Clipboard API unavailable — silently ignore
    }
  });
});


/* ===================================================================
   ACTIVE SECTION INDICATOR — update <title> on scroll (nice touch)
   =================================================================== */
const sectionTitles = {
  home:         'Sachin Kamalinda',
  about:        'About – Sachin Kamalinda',
  skills:       'Skills – Sachin Kamalinda',
  projects:     'Projects – Sachin Kamalinda',
  education:    'Education – Sachin Kamalinda',
  certificates: 'Certificates – Sachin Kamalinda',
  softskills:   'Soft Skills – Sachin Kamalinda',
  contact:      'Contact – Sachin Kamalinda',
};

const titleObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id && sectionTitles[id]) {
          document.title = sectionTitles[id];
        }
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('section[id]').forEach(s => titleObserver.observe(s));
