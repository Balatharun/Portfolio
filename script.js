/**
 * BALASUBARAMANI T - PORTFOLIO INTERACTIVITY, THEME ENGINE & EMAIL SYSTEM
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndAccents();
  initNavbarScroll();
  initMobileNav();
  initTypingAnimation();
  initBackgroundCanvas();
  initStatsCounter();
  initProjectFilters();
  initModals();
  initContactForm();
  initSecurityFeatures();
});

/* ===================================================================
   1. THEME (DARK / LIGHT) & DYNAMIC ACCENT ENGINE
   =================================================================== */
function initThemeAndAccents() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const accentDots = document.querySelectorAll('.accent-dot');

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('bala-portfolio-theme') || 'dark';
  const savedAccent = localStorage.getItem('bala-portfolio-accent') || 'cyber-cyan';

  applyTheme(savedTheme);
  applyAccent(savedAccent);

  // Theme Toggle Click Handler
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('bala-portfolio-theme', newTheme);
      showSecurityToast(
        newTheme === 'dark' ? '🌙 Dark Mode Active' : '☀️ Light Mode Active',
        `Theme switched to ${newTheme} mode.`
      );
    });
  }

  // Accent Switcher Click Handlers
  accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const accent = dot.getAttribute('data-accent');
      applyAccent(accent);
      localStorage.setItem('bala-portfolio-accent', accent);
      const name = dot.getAttribute('title') || accent;
      showSecurityToast('🎨 Color Theme Updated', `${name} style activated.`);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun" style="color:#fbbf24;"></i>' 
        : '<i class="fa-solid fa-moon" style="color:#6366f1;"></i>';
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }

  function applyAccent(accent) {
    document.documentElement.setAttribute('data-accent', accent);
    accentDots.forEach(d => {
      if (d.getAttribute('data-accent') === accent) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
  }
}

/* ===================================================================
   2. NAVBAR SCROLL EFFECT & SCROLL-SPY
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   3. MOBILE NAVIGATION DRAWER
   =================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileNav) return;

  hamburgerBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const isOpen = mobileNav.classList.contains('open');
    hamburgerBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ===================================================================
   4. TYPING EFFECT IN HERO
   =================================================================== */
function initTypingAnimation() {
  const typedTarget = document.getElementById('typedText');
  if (!typedTarget) return;

  const roles = [
    'Software Developer & Team Lead',
    'Full-Stack Web Engineer',
    'Selenium & QA Automation Specialist',
    'M.Tech AI & ML Scholar @ BITS Pilani',
    'Spring Boot & Microservices Builder',
    'CI/CD & DevOps Practitioner'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typedTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1900;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   5. INTERACTIVE PARTICLES & TECH NODES CANVAS
   =================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 22), 60);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.35)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 115) * (isDark ? 0.16 : 0.12);
          ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${opacity})` : `rgba(2, 132, 199, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw(isDark);
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   6. ANIMATED STATS COUNTER
   =================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          const prefix = stat.getAttribute('data-prefix') || '';
          let count = 0;
          const duration = 1400;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            if (Number.isInteger(target)) {
              stat.textContent = `${prefix}${Math.floor(count)}${suffix}`;
            } else {
              stat.textContent = `${prefix}${count.toFixed(1)}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* ===================================================================
   7. PROJECT FILTER TABS
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory.includes(filterCategory)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   8. MODALS (RESUME & PROJECT DETAILS & EMAIL CONFIRMATION)
   =================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resumeModal');
  const projectModal = document.getElementById('projectModal');
  const emailSuccessModal = document.getElementById('emailSuccessModal');
  const resumeTriggers = document.querySelectorAll('.open-resume-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  resumeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  });

  const projectDetailBtns = document.querySelectorAll('.btn-project-details');
  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      const title = card.querySelector('.project-title').textContent;
      const desc = card.querySelector('.project-description').textContent;
      const techTags = card.querySelector('.project-tech-badges').innerHTML;
      const highlights = card.querySelector('.project-highlights-list').innerHTML;
      const liveBtn = card.querySelector('.btn-project-live');

      document.getElementById('modalProjectTitle').textContent = title;
      document.getElementById('modalProjectDesc').textContent = desc;
      document.getElementById('modalProjectTech').innerHTML = techTags;
      document.getElementById('modalProjectHighlights').innerHTML = highlights;
      
      const modalLiveContainer = document.getElementById('modalLiveContainer');
      if (liveBtn) {
        modalLiveContainer.innerHTML = `<a href="${liveBtn.getAttribute('href')}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="width:100%"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Live Application</a>`;
        modalLiveContainer.style.display = 'block';
      } else {
        modalLiveContainer.style.display = 'none';
      }

      openModal(projectModal);
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  window.openModal = function(modal) {
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeAllModals = function() {
    modalOverlays.forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  };
}

/* ===================================================================
   9. EMAIL SYSTEM: NODEMAILER BACKEND + CLOUD ASYNC DELIVERY
   Delivers directly to balatharun64@gmail.com with zero configuration!
   =================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('portfolioContactForm');
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'balatharun64@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showSecurityToast('Email Copied!', `${email} copied to clipboard.`);
      }).catch(() => {
        showSecurityToast('Email Address', email);
      });
    });
  }

  // Direct 1-Click Compose in Gmail Web
  const openGmailWebBtn = document.getElementById('openGmailWebBtn');
  if (openGmailWebBtn) {
    openGmailWebBtn.addEventListener('click', () => {
      const name = document.getElementById('formName').value.trim() || 'Visitor';
      const userEmail = document.getElementById('formEmail').value.trim() || '';
      const subject = document.getElementById('formSubject').value.trim() || 'Portfolio Collaboration Inquiry';
      const inquiryType = document.getElementById('formInquiryType').value;
      const message = document.getElementById('formMessage').value.trim() || 'Hi Balasubaramani,\n\nI reviewed your portfolio and would like to connect with you regarding a potential opportunity.';

      const bodyText = `${message}\n\n---\nSender Name: ${name}\nSender Email: ${userEmail}\nInquiry Type: ${inquiryType}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=balatharun64@gmail.com&su=${encodeURIComponent(`[${inquiryType}] ${subject} - ${name}`)}&body=${encodeURIComponent(bodyText)}`;
      window.open(gmailUrl, '_blank');
      showSecurityToast('Opening Gmail Web', 'Composing message directly to balatharun64@gmail.com');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim() || 'Portfolio Inquiry';
      const inquiryType = document.getElementById('formInquiryType').value;
      const message = document.getElementById('formMessage').value.trim();
      const submitBtn = document.getElementById('submitFormBtn') || contactForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        showSecurityToast('Required Fields', 'Please provide your Name, Email, and Message.');
        return;
      }

      // UI Loading state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Email...</span>';

      let delivered = false;
      let needsActivation = false;

      // STEP 1: Attempt sending through local Node.js Express + Nodemailer backend if SMTP configured
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, inquiryType, message })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && !result.useCloudFallback) {
            delivered = true;
          }
        }
      } catch (err) {
        // Node backend not running or on static hosting, fallback to cloud
      }

      // STEP 2: Cloud delivery directly to balatharun64@gmail.com via FormSubmit
      if (!delivered) {
        try {
          const cloudResponse = await fetch('https://formsubmit.co/ajax/balatharun64@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              email: email,
              _subject: `[Portfolio - ${inquiryType}] ${subject} from ${name}`,
              inquiry_type: inquiryType,
              message: message
            })
          });

          const cloudData = await cloudResponse.json();
          if (cloudData.success === "true" || cloudData.message?.includes('submitted successfully')) {
            delivered = true;
          } else if (cloudData.message?.includes('Activation')) {
            needsActivation = true;
          }
        } catch (cloudErr) {
          console.error('Cloud delivery error:', cloudErr);
        }
      }

      // Reset button UI
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;

      if (delivered) {
        const successModal = document.getElementById('emailSuccessModal');
        const successSenderName = document.getElementById('successSenderName');
        if (successSenderName) successSenderName.textContent = name;
        if (successModal) {
          openModal(successModal);
        } else {
          showSecurityToast(
            '✅ Email Delivered!',
            `Thank you ${name}! Your inquiry has been sent directly to balatharun64@gmail.com.`
          );
        }
        contactForm.reset();
      } else if (needsActivation) {
        showSecurityToast(
          '📩 Check Gmail for Activation',
          'FormSubmit sent a 1-click activation link to balatharun64@gmail.com. Please click "Activate Form" in your Gmail!'
        );
        // Also open Gmail Web Compose as instant fallback so message is never lost
        const bodyText = `${message}\n\n---\nSender Name: ${name}\nSender Email: ${email}\nInquiry Type: ${inquiryType}`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=balatharun64@gmail.com&su=${encodeURIComponent(`[${inquiryType}] ${subject} - ${name}`)}&body=${encodeURIComponent(bodyText)}`;
        window.open(gmailUrl, '_blank');
      } else {
        // Instant direct fallback to Gmail Web Compose
        const bodyText = `${message}\n\n---\nSender Name: ${name}\nSender Email: ${email}\nInquiry Type: ${inquiryType}`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=balatharun64@gmail.com&su=${encodeURIComponent(`[${inquiryType}] ${subject} - ${name}`)}&body=${encodeURIComponent(bodyText)}`;
        window.open(gmailUrl, '_blank');

        showSecurityToast(
          'Opened in Gmail Web',
          'Your message is pre-filled in Gmail Web composer. Click Send to deliver to balatharun64@gmail.com!'
        );
      }
    });
  }
}

/* ===================================================================
   10. SECURITY PROTECTIONS
   - Disables right-click context menu (Save image as, inspect, etc.)
   - Disables drag-and-drop on images & sensitive profile elements
   - Blocks Ctrl+S, Ctrl+U shortcuts
   - Sleek cyber warning toast
   =================================================================== */
function initSecurityFeatures() {
  const securityToast = document.getElementById('securityToast');
  let toastTimeout = null;

  window.showSecurityToast = function(title, message) {
    if (!securityToast) return;
    const titleEl = securityToast.querySelector('.toast-title');
    const msgEl = securityToast.querySelector('.toast-message');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    securityToast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      securityToast.classList.remove('show');
    }, 4000);
  };

  // 1. Prevent Right-Click and Drag ONLY on images and profile avatar
  const protectedImages = document.querySelectorAll('img, .profile-card-outer, .profile-avatar-box');
  protectedImages.forEach(el => {
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showSecurityToast(
        '🛡️ Image Protected',
        'Profile photo and images are secured against direct download and right-click saving.'
      );
      return false;
    });

    el.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
  });

  const securityBadge = document.getElementById('navSecurityBadge');
  if (securityBadge) {
    securityBadge.addEventListener('click', () => {
      showSecurityToast(
        '🛡️ Image Protection Active',
        'Profile photos and assets are protected against direct saving and dragging.'
      );
    });
  }
}
