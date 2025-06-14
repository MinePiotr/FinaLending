// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Check for saved theme
const currentTheme = localStorage.getItem('theme') || 'dark';
setTheme(currentTheme);

// Toggle theme
themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavLinks = document.getElementById('mobileNavLinks');
const closeMenu = document.getElementById('closeMenu');
const overlay = document.getElementById('overlay');

function toggleMobileMenu() {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNavLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
closeMenu.addEventListener('click', toggleMobileMenu);
overlay.addEventListener('click', toggleMobileMenu);

// Закрытие меню при клике на ссылки
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');
const nameInput = contactForm.querySelector('input[name="name"]');
const emailInput = contactForm.querySelector('input[name="email"]');
const phoneInput = contactForm.querySelector('input[name="phone"]');
const messageInput = contactForm.querySelector('textarea[name="message"]');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const messageError = document.getElementById('message-error');

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Валидация телефона (базовая)
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]{7,15}$/;
    return re.test(phone);
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Сброс ошибок
    nameError.classList.remove('active');
    emailError.classList.remove('active');
    phoneError.classList.remove('active');
    messageError.classList.remove('active');

    let isValid = true;
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Проверка полей
    if (!nameInput.value.trim()) {
        nameError.classList.add('active');
        isValid = false;
    }

    if (!validateEmail(emailInput.value.trim())) {
        emailError.classList.add('active');
        isValid = false;
    }

    // Проверка телефона
    if (!phoneInput.value.trim()) {
        phoneError.textContent = 'Пожалуйста, введите ваш телефон';
        phoneError.classList.add('active');
        isValid = false;
    } else if (!validatePhone(phoneInput.value.trim())) {
        phoneError.textContent = 'Пожалуйста, введите корректный телефон';
        phoneError.classList.add('active');
        isValid = false;
    }

    if (!messageInput.value.trim()) {
        messageError.classList.add('active');
        isValid = false;
    }

    if (!isValid) return;

    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        // Отправка через Formspree
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Успешная отправка
            alert('Спасибо! Мы свяжемся с вами в течение 24 часов.');
            contactForm.reset();
        } else {
            // Ошибка сервера
            const errorData = await response.json();
            let errorMessage = 'Ошибка отправки. Пожалуйста, напишите нам напрямую.';

            if (errorData.errors) {
                errorMessage = errorData.errors.map(err => err.message).join('\n');
            }

            alert(errorMessage);
        }
    } catch (error) {
        // Ошибка сети
        alert('Ошибка сети. Пожалуйста, попробуйте позже.');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        header.style.background = 'var(--header-bg)';
    } else {
        header.style.boxShadow = 'none';
        header.style.background = 'transparent';
    }
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});