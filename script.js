document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');

  // Мобильное меню
  hamburger.addEventListener('click', () => {
    mobileMenu.style.display = 'flex'; 
  });

  closeMenu.addEventListener('click', () => {
    mobileMenu.style.display = 'none'; 
  });

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.style.display = 'none'; 
    });
  });

  // Функция плавной прокрутки
  function smoothScroll(element, distance) {
    element.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  }

  // Функция для прокрутки к секции по id
  function scrollToSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Обработка внутренних навигационных ссылок
  document.querySelectorAll('header nav a').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      // Проверяем, есть ли у ссылки хэш (например, index.html#tours)
      const url = new URL(this.href, window.location.origin);
      const hash = url.hash; // например, '#tours'

      if (hash) {
        // Перенаправляем на главную страницу с хэшем
        window.location.href = `index.html${hash}`;
      } else {
        // Если ссылка внутренняя, обрабатываем как обычно
        const targetId = this.textContent.trim().toLowerCase();
        switch (targetId) {
          case 'компания':
            scrollToSection('reasons');
            break;
          case 'туры':
            scrollToSection('tours');
            break;
          case 'что включено':
            scrollToSection('included-section');
            break;
          case 'отзывы': 
            scrollToSection('comments-page');
            break;
        }
      }
    });
  });

  // Обработка кнопок "Забронировать тур" и "Посмотреть туры"
  const bookTourButton = document.getElementById('bookTourButton');
  if (bookTourButton) {
    bookTourButton.addEventListener('click', () => {
      scrollToSection('contact'); 
    });
  }

  const viewToursButton = document.getElementById('viewToursButton');
  if (viewToursButton) {
    viewToursButton.addEventListener('click', () => {
      scrollToSection('included-section'); 
    });
  }

  // Инициализация каруселей (оставляем без изменений)
  function initializeCarousel(carouselSelector, prevButtonSelector, nextButtonSelector, autoscroll = false) {
    const carousel = document.querySelector(carouselSelector);
    const prevButton = document.querySelector(prevButtonSelector);
    const nextButton = document.querySelector(nextButtonSelector);

    if (!carousel || !prevButton || !nextButton) {
      console.warn('Карусель или кнопки не найдены.');
      return;
    }

    function updateScrollDistance() {
      const card = carousel.querySelector('.tour-card') || carousel.querySelector('.team-member'); 
      if (!card) return; 

      const cardWidth = card.offsetWidth; 
      const cardMargin = parseInt(window.getComputedStyle(card).marginRight) || 0; 

      return cardWidth + cardMargin;
    }

    let scrollDistance = updateScrollDistance(); 
    prevButton.addEventListener('click', () => {
      smoothScroll(carousel, -scrollDistance);
    });

    nextButton.addEventListener('click', () => {
      smoothScroll(carousel, scrollDistance);
    });

    window.addEventListener('resize', () => {
      scrollDistance = updateScrollDistance();
    });

    if (autoscroll) {
      let intervalId;
      let isAutoscrolling = true;

      function startAutoscroll() {
        if (!isAutoscrolling) return;
        intervalId = setInterval(() => {
          if (carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth) {
            smoothScroll(carousel, scrollDistance);
          } else {
            smoothScroll(carousel, -carousel.scrollLeft);
          }
        }, 3000);
      }

      function stopAutoscroll() {
        clearInterval(intervalId);
      }

      carousel.addEventListener('mouseenter', () => {
        isAutoscrolling = false;
        stopAutoscroll();
      });

      carousel.addEventListener('mouseleave', () => {
        isAutoscrolling = true;
        startAutoscroll();
      });

      startAutoscroll();
    }
  }

  initializeCarousel('.tours-carousel', '.carousel-button.prev', '.carousel-button.next', true);
  initializeCarousel('.team-carousel', '.team-carousel-button.prev', '.team-carousel-button.next', true);

  // Кнопка "Наверх"
  const backToTopButton = document.querySelector('.back-to-top-button');
  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Комментарии
  const commentsContainer = document.querySelector('.comments-container');
  const commentForm = document.getElementById('commentForm');

  function getCurrentDateTime() {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return now.toLocaleDateString('ru-RU', options);
  }

  let comments = [
    {
      name: 'Елена Смирнова',
      comment: 'Отличный тур! Все было организовано на высшем уровне, гид - профессионал. Рекомендую!',
      date: '20 октября 2024, 14:30'
    },
    {
      name: 'Иван Петров',
      comment: 'Незабываемое путешествие! Красивые места, вкусная еда, отличная компания. Хочу еще!',
      date: '19 октября 2024, 10:15'
    },
    {
      name: 'Мария Иванова',
      comment: 'Спасибо за прекрасный отдых! Все было идеально, от трансфера до проживания.Семья в восторге)',
      date: '18 октября 2024, 17:45'
    }
  ];

  function renderComments() {
    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
      const commentCard = document.createElement('div');
      commentCard.classList.add('comment-card');
      commentCard.innerHTML = `
        <h3>${comment.name}</h3>
        <p>${comment.comment}</p>
        <p class="comment-date">${comment.date}</p>
      `;
      commentsContainer.appendChild(commentCard);
    });
  }

  renderComments();

  if (commentForm) {
    commentForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const commentText = document.getElementById('commentText').value;
      if (name.trim() !== '' && commentText.trim() !== '') {
        addNewComment(name, commentText);
      }
    });
  }

  function addNewComment(name, commentText) {
    const newComment = {
      name: name,
      comment: commentText,
      date: getCurrentDateTime()
    };
    comments.push(newComment);
    renderComments();
    document.getElementById('name').value = '';
    document.getElementById('commentText').value = '';
  }

  // Обработка формы обратной связи
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = document.getElementById('email').value;
      if (!isValidEmail(email)) {
        alert('Пожалуйста, введите корректный адрес электронной почты.');
        return;
      }
      alert('Ваша заявка отправлена!');
      contactForm.reset();
    });
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // Автоматическая прокрутка при загрузке, если есть хэш
  const hash = window.location.hash;
  if (hash) {
    const targetId = hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
});


function goToTeamSection() {
  window.location.href = "index.html#tours";
  window.location.href = "index.html#reasons";
  window.location.href = "index.html#included";
  window.location.href = "index.html#comments";
}
