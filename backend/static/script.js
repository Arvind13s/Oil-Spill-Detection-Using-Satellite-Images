// Theme toggle with persistence
function toggleMode() {
  document.body.classList.toggle('light-mode');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}
(function() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = '🌙';
  }
})();

// Mobile menu
function toggleMenu() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  createParticles();
  initCounters();
  initDropZone();
  initFAQ();
});

// Particles
function createParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 15) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    container.appendChild(p);
  }
}

// Animated counters
function initCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isFloat = String(target).includes('.');
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, 25);
  });
}

// Drag & drop upload
function initDropZone() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const previewContainer = document.getElementById('previewContainer');
  const previewImg = document.getElementById('previewImg');
  const removeBtn = document.getElementById('previewRemove');
  const submitBtn = document.getElementById('submitBtn');
  if (!dropZone) return;

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) { fileInput.files = e.dataTransfer.files; showPreview(e.dataTransfer.files[0]); }
  });
  fileInput.addEventListener('change', e => { if (e.target.files[0]) showPreview(e.target.files[0]); });

  function showPreview(file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewContainer.classList.add('active');
      dropZone.style.display = 'none';
      submitBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  if (removeBtn) removeBtn.addEventListener('click', e => {
    e.stopPropagation();
    previewContainer.classList.remove('active');
    dropZone.style.display = 'block';
    fileInput.value = '';
    submitBtn.disabled = true;
  });

  // Form submit loading
  const form = document.getElementById('uploadForm');
  if (form) form.addEventListener('submit', () => { submitBtn.classList.add('loading'); submitBtn.disabled = true; });
}

// FAQ accordion
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      document.querySelectorAll('.faq-item').forEach(i => { if (i !== item) i.classList.remove('open'); });
      item.classList.toggle('open');
    });
  });
}

// Image preview (legacy support)
function previewImage(event) {
  const preview = document.getElementById('preview-img');
  if (preview && event.target.files && event.target.files[0]) {
    preview.src = URL.createObjectURL(event.target.files[0]);
    preview.style.display = 'block';
  }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});