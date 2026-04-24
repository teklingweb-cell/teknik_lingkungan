// ─── NAVBAR SCROLL ───
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileOverlay = document.querySelector('.mobile-overlay');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── MOBILE MENU ───
if (hamburger && mobileOverlay) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
  });
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay || e.target.closest('.mobile-drawer') === null) {
      hamburger.classList.remove('open');
      mobileOverlay.classList.remove('open');
    }
  });
}

// ─── ACTIVE NAV LINK ───
const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;
  const linkPath = href.replace(/\/$/, '');
  if (currentPath.endsWith(linkPath) || (linkPath === 'index.html' && (currentPath === '' || currentPath.endsWith('/')))) {
    link.classList.add('active');
    const li = link.closest('.nav-links li');
    if (li) {
      const bar = document.createElement('span');
      bar.className = 'active-bar';
      li.appendChild(bar);
    }
  }
});

// ─── SCROLL ANIMATIONS ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '-40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ─── FAQ ACCORDION ───
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── RESEARCH FILTER ───
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.research-card-wrap').forEach(card => {
      const cat = card.dataset.cat || '';
      card.style.display = (filter === 'all' || cat === filter) ? 'flex' : 'none';
    });
  });
});

// ─── STAFF TABS ───
const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.style.display = panel.dataset.panel === tab ? 'block' : 'none';
    });
  });
});

// ─── STAFF SEARCH ───
const staffSearch = document.getElementById('staffSearch');
if (staffSearch) {
  staffSearch.addEventListener('input', () => {
    const q = staffSearch.value.toLowerCase();
    document.querySelectorAll('.staff-searchable').forEach(card => {
      const text = card.dataset.search || '';
      card.style.display = text.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ─── CONTACT FORM ───
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Mengirim...';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '✉ Kirim Pesan';
      contactForm.reset();
      if (formSuccess) {
        formSuccess.style.display = 'flex';
        setTimeout(() => formSuccess.style.display = 'none', 5000);
      }
    }, 1200);
  });
}

// ─── FOOTER YEAR ───
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
