document.addEventListener('DOMContentLoaded', () => {
    // Hide images that fail to load so the placeholder text shows
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                if (el.classList.contains('fade-in-up')) {
                    el.classList.add('animate-fade-in-up');
                } else if (el.classList.contains('fade-in')) {
                    el.classList.add('animate-fade-in');
                } else if (el.classList.contains('slide-up')) {
                    el.classList.add('animate-slide-up');
                } else if (el.classList.contains('slide-left')) {
                    el.classList.add('animate-slide-left');
                } else if (el.classList.contains('slide-right')) {
                    el.classList.add('animate-slide-right');
                }
                
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-up, .slide-left, .slide-right');
    animatedElements.forEach(el => observer.observe(el));
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Lógica do Carrossel de Vídeos ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const dots = Array.from(dotsNav.children);

    let currentSlideIndex = 0;

    const moveToSlide = (index) => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + slideWidth * index + 'px)';
        
        // Atualizar dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentSlideIndex = index;
    };

    nextButton.addEventListener('click', () => {
        if (currentSlideIndex === slides.length - 1) {
            moveToSlide(0); // Voltar ao início
        } else {
            moveToSlide(currentSlideIndex + 1);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentSlideIndex === 0) {
            moveToSlide(slides.length - 1); // Ir para o fim
        } else {
            moveToSlide(currentSlideIndex - 1);
        }
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        moveToSlide(targetIndex);
    });

    // Recalcular quando a janela é redimensionada
    window.addEventListener('resize', () => {
        moveToSlide(currentSlideIndex);
    });
});
