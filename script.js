// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
  });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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

// Navigation Background Change on Scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Reveal Elements on Scroll
const revealElements = document.querySelectorAll('.reveal');
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Parallax Effect for Hero Image
const heroImage = document.querySelector('.hero-image img');
window.addEventListener('scroll', () => {
  if (heroImage) {
    const scrollValue = window.scrollY;
    heroImage.style.transform = `translateY(${scrollValue * 0.4}px)`;
  }
});

// Audio Player Logic
const audio = document.getElementById('background-audio');
const audioToggle = document.querySelector('.audio-toggle');
const audioIconPlay = document.querySelector('.audio-icon-play');
const audioIconPause = document.querySelector('.audio-icon-pause');
const audioCurrent = document.querySelector('.audio-current');
const audioDuration = document.querySelector('.audio-duration');

if (audio && audioToggle) {
  audioToggle.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      audioIconPlay.style.display = 'none';
      audioIconPause.style.display = 'block';
    } else {
      audio.pause();
      audioIconPlay.style.display = 'block';
      audioIconPause.style.display = 'none';
    }
  });

  audio.addEventListener('timeupdate', () => {
    const current = Math.floor(audio.currentTime);
    const duration = Math.floor(audio.duration);
    audioCurrent.textContent = formatTime(current);
    if (!isNaN(duration)) {
      audioDuration.textContent = formatTime(duration);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    audioDuration.textContent = formatTime(Math.floor(audio.duration));
  });
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Google Apps Script Hook Handling
const form = document.querySelector('#contact-form');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyu7xPVb6b0GPo2CM2C1E6NJlDSVGNaXqpUb2oWya9aMLYzK4HMHcW_JGTsOPakrtpl/exec'; // Сюда нужно будет вставить ссылку

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Отправка...';
    btn.disabled = true;

    // Собираем данные
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    
    try {
      // Используем простой POST запрос без сложных заголовков
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Важно для обхода CORS у Google
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString()
      });

      // В режиме no-cors мы не получим ответ, поэтому считаем успех, 
      // если не вылетело сетевое исключение
      btn.textContent = 'Отправлено!';
      btn.style.background = '#8e6c4a';
      form.reset();
      
    } catch (error) {
      console.error(error);
      btn.textContent = 'Ошибка';
      btn.style.background = '#ff4b2b';
    } finally {
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }
  });
}
