// Hoàng Thảo Mộc Landing Page — Form handler
// Gửi dữ liệu về Google Form/Sheet qua Apps Script Web App

const FORM_LINK = 'https://docs.google.com/forms/d/1mC3vI0kk0Gwbd-1cDbslDNfwTJ9qxhFDSZoqbi4ugHM/viewform';
// Không tự gửi dữ liệu sang máy chủ lạ. Mở Google Form khi người dùng gửi biểu mẫu.
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzEy1l3x7bYzZTFGGcQx-8wAf5N5k5goC1TkX9Cogd2J495UIPTTMeF94-rGsGjaZ6t/exec';

const form = document.getElementById('leadForm');
const statusEl = document.getElementById('formStatus');

function showToast(message, type = 'success') {
  statusEl.textContent = message;
  statusEl.className = type;
}

function setLoading(isLoading) {
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Đang gửi...' : 'NHẬN TƯ VẤN NGAY';
}

function validateForm() {
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const product = form.product.value;

  if (!name || !phone || !product) {
    showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
    return false;
  }
  if (!/^\d{9,11}$/.test(phone.replace(/\D/g, ''))) {
    showToast('Số điện thoại không hợp lệ', 'error');
    return false;
  }
  return true;
}

async function submitForm() {
  if (!validateForm()) return;

  setLoading(true);
  const data = new FormData(form);
  data.append('timestamp', new Date().toISOString());
  data.append('source', 'landing-hoangthaomoc');

  try {
    if (!FORM_ENDPOINT) {
      window.open(FORM_LINK, '_blank', 'noopener,noreferrer');
      showToast('Đã mở biểu mẫu liên hệ an toàn.', 'success');
      return;
    }
    await fetch(FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: data
    });
    showToast('✅ Đã gửi thành công! Chúng tôi sẽ liên hệ sớm nhất.', 'success');
    form.reset();
  } catch (err) {
    showToast('❌ Có lỗi xảy ra, vui lòng thử lại.', 'error');
  } finally {
    setLoading(false);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitForm();
});

// Smooth scroll for nav links
document.querySelectorAll('#mainNav a, .hero-actions a, .contact-info a, .footer-grid a').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('mainNav');
toggle.addEventListener('click', () => nav.classList.toggle('open'));

// Header shadow on scroll
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 18px #244b3a18';
  } else {
    header.style.boxShadow = 'none';
  }
});