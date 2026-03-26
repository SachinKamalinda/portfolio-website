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
   CONTACT FORM — Google Apps Script / Google Sheets
   Use the deployed Web App URL here, not the Apps Script editor URL.
   =================================================================== */
const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyv7APKxQoT2hhr2-0rftDxP7KqpudNV_12zM9tRGZWkYxH_YH5tZ2YBRBkVpIn64wH/exec';

const contactForm = document.getElementById('contactForm');
const contactFormStatus = document.getElementById('contactFormStatus');

function setContactFormStatus(message, type = '') {
  if (!contactFormStatus) return;

  contactFormStatus.textContent = message;
  contactFormStatus.classList.remove('is-success', 'is-error');

  if (type) {
    contactFormStatus.classList.add(type);
  }
}

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    if (!CONTACT_FORM_ENDPOINT) {
      setContactFormStatus('Contact form is not connected yet. Add your Apps Script Web App URL in src/main.js.', 'is-error');
      return;
    }

    const formData = {
      name: contactForm.querySelector('#cf-name')?.value.trim() || '',
      email: contactForm.querySelector('#cf-email')?.value.trim() || '',
      subject: contactForm.querySelector('#cf-subject')?.value.trim() || '',
      message: contactForm.querySelector('#cf-message')?.value.trim() || '',
      submittedAt: new Date().toISOString(),
    };

    submitButton.disabled = true;
    setContactFormStatus('Sending message...');

    try {
      await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(formData),
      });

      contactForm.reset();
      setContactFormStatus('Message sent successfully.', 'is-success');
    } catch (error) {
      setContactFormStatus('Message failed to send. Please try again later.', 'is-error');
    } finally {
      submitButton.disabled = false;
    }
  });
}


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


/* ===================================================================
   CV DOWNLOAD HANDLER
   =================================================================== */
function handleCVDownload(e) {
  e.preventDefault();
  
  const cvUrl = '/SachinKamalinda.pdf';
  const fileName = 'SachinKamalinda.pdf';
  
  // Fetch the PDF file
  fetch(cvUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch CV');
      }
      return response.blob();
    })
    .then(blob => {
      // Create a blob URL and download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('CV download error:', error);
      // Fallback to direct link
      window.open(cvUrl, '_blank');
    });
}

// Attach click handlers to all CV download buttons
document.querySelectorAll('a[href="/SachinKamalinda.pdf"]').forEach(link => {
  link.addEventListener('click', handleCVDownload);
});
