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

    // --- Lógica da Galeria Dinâmica com Lightbox ---
    const galleryContainer = document.getElementById('dynamicGallery');
    
    // Configuração do Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxPrev = document.getElementById('lightboxPrev');
    let currentLightboxIndex = -1;

    const openLightbox = (index) => {
        currentLightboxIndex = index;
        const ficheiro = galeriaFicheiros[index];
        const extensao = ficheiro.split('.').pop().toLowerCase();
        const caminho = `galeria/${ficheiro}`;
        
        lightboxContent.innerHTML = ''; 
        
        if (['mp4', 'webm', 'ogg'].includes(extensao)) {
            lightboxContent.innerHTML = `<video controls autoplay><source src="${caminho}" type="video/${extensao}"></video>`;
        } else {
            lightboxContent.innerHTML = `<img src="${caminho}">`;
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightboxContent.innerHTML = '';
        document.body.style.overflow = '';
    };

    const nextMedia = () => {
        if (currentLightboxIndex < galeriaFicheiros.length - 1) {
            openLightbox(currentLightboxIndex + 1);
        } else {
            openLightbox(0);
        }
    };

    const prevMedia = () => {
        if (currentLightboxIndex > 0) {
            openLightbox(currentLightboxIndex - 1);
        } else {
            openLightbox(galeriaFicheiros.length - 1);
        }
    };

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', nextMedia);
        lightboxPrev.addEventListener('click', prevMedia);
        
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextMedia();
            if (e.key === 'ArrowLeft') prevMedia();
        });
    }

    // --- Lógica de Paginação da Galeria ---
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    let currentPage = 1;
    let itemsPerPage = 20;

    const renderGallery = () => {
        if (!galleryContainer || typeof galeriaFicheiros === 'undefined') return;
        
        galleryContainer.innerHTML = ''; 
        
        if (galeriaFicheiros.length === 0) {
            galleryContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--text-secondary);">Não há ficheiros na galeria.</p>';
            if (pageInfo) pageInfo.textContent = 'Página 0 de 0';
            return;
        }

        const totalPages = Math.ceil(galeriaFicheiros.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = galeriaFicheiros.slice(startIndex, endIndex);
        
        currentItems.forEach((ficheiro, loopIndex) => {
            const actualIndex = startIndex + loopIndex;
            const extensao = ficheiro.split('.').pop().toLowerCase();
            const caminho = `galeria/${ficheiro}`;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'gallery-item fade-in';
            
            if (['mp4', 'webm', 'ogg'].includes(extensao)) {
                itemDiv.innerHTML = `
                    <video preload="metadata">
                        <source src="${caminho}#t=0.1" type="video/${extensao}">
                    </video>
                `;
            } else {
                itemDiv.innerHTML = `
                    <img src="${caminho}" loading="lazy" alt="Galeria ${actualIndex + 1}" onerror="this.style.display='none'">
                `;
            }
            
            itemDiv.addEventListener('click', () => openLightbox(actualIndex));
            
            galleryContainer.appendChild(itemDiv);
            observer.observe(itemDiv);
        });
        
        // Atualizar os controlos de UI
        if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
        
        // Voltar os novos items a ser renderizados com os ícones Lucide, caso necessário
        if (window.lucide) {
            lucide.createIcons();
        }
    };

    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1; // Voltar à primeira página ao mudar o limite
            renderGallery();
        });
        
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderGallery();
            }
        });
        
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(galeriaFicheiros.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderGallery();
            }
        });
        
        // Renderizar a primeira vez
        renderGallery();
    } else if (galleryContainer && typeof galeriaFicheiros !== 'undefined') {
        // Fallback no caso de não existir html de paginação (por segurança)
        renderGallery();
    }
});
