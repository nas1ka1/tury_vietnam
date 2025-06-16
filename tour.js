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
function smoothScroll(element, scrollAmount) {
  element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

function initializeCarousel(carouselSelector, prevButtonSelector, nextButtonSelector, autoscroll = false) {
  const carousel = document.querySelector(carouselSelector);
  const prevButton = document.querySelector(prevButtonSelector);
  const nextButton = document.querySelector(nextButtonSelector);

  if (!carousel || !prevButton || !nextButton) {
    console.warn('Карусель или кнопки не найдены:', { carousel, prevButton, nextButton });
    return;
  }

  function updateScrollDistance() {
    const card = carousel.querySelector('.tour-card') || carousel.querySelector('.team-member');
    if (!card) {
      console.warn('Карточки не найдены внутри карусели:', carouselSelector);
      return 0;
    }
    const cardStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth;
    const cardMargin = parseInt(cardStyle.marginRight) || 0;
    return cardWidth + cardMargin;
  }

  let scrollDistance = updateScrollDistance();
  console.log('Initial scrollDistance:', scrollDistance);

  prevButton.addEventListener('click', () => {
    smoothScroll(carousel, -scrollDistance);
  });

  nextButton.addEventListener('click', () => {
    smoothScroll(carousel, scrollDistance);
  });

  window.addEventListener('resize', () => {
    scrollDistance = updateScrollDistance();
    console.log('Updated scrollDistance:', scrollDistance);
  });

  if (autoscroll) {
    let intervalId;
    let isAutoscrolling = true;

    function startAutoscroll() {
      if (!isAutoscrolling) return;
      intervalId = setInterval(() => {
        if (carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 1) { // немного запас для точности
          smoothScroll(carousel, scrollDistance);
        } else {
          // возвращение к началу
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

// Инициализация каруселей
initializeCarousel('.tours-carousel', '.carousel-button.prev', '.carousel-button.next', true);
initializeCarousel('.team-carousel', '.team-carousel-button.prev', '.team-carousel-button.next', true);