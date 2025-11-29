// Gallery filter functionality
const filterBtns = document.querySelectorAll('.gallery-filters > .filter-btn');
const dropdownBtn = document.querySelector('.filter-dropdown > .filter-btn');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const filterDropdown = document.querySelector('.filter-dropdown');
const galleryItems = document.querySelectorAll('.gallery-item');
const emptyState = document.querySelector('.empty-state');
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxDownload = document.querySelector('.lightbox-download');
const lightboxLike = document.querySelector('.lightbox-like');
const lightboxShare = document.querySelector('.lightbox-share');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxCounter = document.querySelector('.lightbox-counter');
const lightboxZoom = document.querySelector('.lightbox-zoom');
const lightboxFullscreen = document.querySelector('.lightbox-fullscreen');
const lightboxLoader = document.querySelector('.lightbox-loader');
const infoViews = document.querySelector('.info-views');
const infoSize = document.querySelector('.info-size');
let currentImageIndex = 0;
let visibleImages = [];
let isZoomed = false;
let sessionViewed = new Set();
let sessionLiked = new Set();

// Regular filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        dropdownBtn.classList.remove('active');
        btn.classList.add('active');
        filterDropdown.classList.remove('open');
        
        filterGallery(btn.dataset.filter);
    });
});

// Dropdown toggle
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('open');
    });
}

// Dropdown items
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        filterBtns.forEach(b => b.classList.remove('active'));
        dropdownBtn.classList.add('active');
        filterDropdown.classList.remove('open');
        
        filterGallery(item.dataset.filter);
    });
});

// Close dropdown on outside click
document.addEventListener('click', () => {
    filterDropdown.classList.remove('open');
});

function filterGallery(filter) {
    let visibleCount = 0;
    const galleryGrid = document.querySelector('.gallery-grid');
    const itemsArray = Array.from(galleryItems);
    
    // Sort if needed
    if (filter === 'popular' || filter === 'most-liked') {
        itemsArray.sort((a, b) => {
            const imgA = a.querySelector('img');
            const imgB = b.querySelector('img');
            if (!imgA || !imgB) return 0;
            
            if (filter === 'popular') {
                return getViews(imgB.src) - getViews(imgA.src);
            } else {
                return getLikes(imgB.src) - getLikes(imgA.src);
            }
        });
        
        // Reorder DOM
        itemsArray.forEach(item => galleryGrid.appendChild(item));
    }
    
    galleryItems.forEach(item => {
        const category = item.dataset.category;
        const subcategory = item.dataset.subcategory;
        let show = false;
        
        if (filter === 'all' || filter === 'popular' || filter === 'most-liked') {
            show = true;
        } else if (filter === 'wallpaper') {
            show = category === 'wallpaper';
        } else if (filter === 'wallpaper-phone') {
            show = category === 'wallpaper' && subcategory === 'phone';
        } else if (filter === 'wallpaper-desktop') {
            show = category === 'wallpaper' && subcategory === 'desktop';
        } else {
            show = category === filter;
        }
        
        if (show) {
            visibleCount++;
            item.classList.remove('hide');
            item.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            item.classList.add('hide');
        }
    });
    
    if (visibleCount === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
    }
}

// Image loading animation and stats display
galleryItems.forEach(item => {
    const img = item.querySelector('img');
    if (img) {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        if (img.complete) {
            img.classList.add('loaded');
        }
        
        // Load stats for each image
        const likesEl = item.querySelector('.likes');
        const viewsEl = item.querySelector('.views');
        if (likesEl && viewsEl) {
            likesEl.textContent = getLikes(img.src);
            viewsEl.textContent = getViews(img.src);
        }
    }
});

// Lightbox functionality
function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => !item.classList.contains('hide') && item.querySelector('img'));
}

function showImage(index) {
    if (visibleImages.length === 0) return;
    currentImageIndex = (index + visibleImages.length) % visibleImages.length;
    const img = visibleImages[currentImageIndex].querySelector('img');
    
    lightboxLoader.classList.add('active');
    lightboxImg.style.opacity = '0';
    
    lightboxImg.onload = () => {
        lightboxLoader.classList.remove('active');
        lightboxImg.style.opacity = '1';
        updateImageInfo(img);
    };
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${visibleImages.length}`;
    updateLikeDisplay(img.src);
    incrementViews(img.src);
    preloadAdjacentImages();
    isZoomed = false;
    lightboxImg.classList.remove('zoomed');
}

function preloadAdjacentImages() {
    const nextIndex = (currentImageIndex + 1) % visibleImages.length;
    const prevIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    
    [nextIndex, prevIndex].forEach(idx => {
        const img = new Image();
        img.src = visibleImages[idx].querySelector('img').src;
    });
}

function getViews(imageSrc) {
    const views = JSON.parse(localStorage.getItem('galleryViews') || '{}');
    return views[imageSrc] || 0;
}

function incrementViews(imageSrc) {
    if (sessionViewed.has(imageSrc)) {
        infoViews.textContent = getViews(imageSrc);
        return;
    }
    
    const views = JSON.parse(localStorage.getItem('galleryViews') || '{}');
    views[imageSrc] = (views[imageSrc] || 0) + 1;
    localStorage.setItem('galleryViews', JSON.stringify(views));
    infoViews.textContent = views[imageSrc];
    sessionViewed.add(imageSrc);
}

function updateImageInfo(img) {
    fetch(img.src)
        .then(res => res.blob())
        .then(blob => {
            const size = (blob.size / 1024).toFixed(1) + ' KB';
            infoSize.textContent = size;
        })
        .catch(() => infoSize.textContent = '-');
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            updateVisibleImages();
            currentImageIndex = visibleImages.indexOf(item);
            showImage(currentImageIndex);
            lightbox.classList.add('active');
        }
    });
});

lightboxPrev.addEventListener('click', () => {
    showImage(currentImageIndex - 1);
});

lightboxNext.addEventListener('click', () => {
    showImage(currentImageIndex + 1);
});

lightboxZoom.addEventListener('click', () => {
    isZoomed = !isZoomed;
    lightboxImg.classList.toggle('zoomed');
});

lightboxFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        lightbox.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
});

lightboxImg.addEventListener('dblclick', () => {
    isZoomed = !isZoomed;
    lightboxImg.classList.toggle('zoomed');
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightboxDownload.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = lightboxImg.src;
    link.download = 'image.jpg';
    link.click();
});

// Like system with localStorage
function getLikes(imageSrc) {
    const likes = JSON.parse(localStorage.getItem('galleryLikes') || '{}');
    return likes[imageSrc] || 0;
}

function saveLikes(imageSrc, count) {
    const likes = JSON.parse(localStorage.getItem('galleryLikes') || '{}');
    likes[imageSrc] = count;
    localStorage.setItem('galleryLikes', JSON.stringify(likes));
}

function updateLikeDisplay(imageSrc) {
    const count = getLikes(imageSrc);
    document.querySelector('.like-count').textContent = count;
}

lightboxLike.addEventListener('click', () => {
    const imageSrc = lightboxImg.src;
    
    if (sessionLiked.has(imageSrc)) {
        return;
    }
    
    const currentLikes = getLikes(imageSrc);
    const newLikes = currentLikes + 1;
    saveLikes(imageSrc, newLikes);
    updateLikeDisplay(imageSrc);
    sessionLiked.add(imageSrc);
    lightboxLike.classList.add('liked');
    setTimeout(() => lightboxLike.classList.remove('liked'), 300);
});

lightboxShare.addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Gallery Image',
                text: 'Check out this image from v22lab',
                url: window.location.href
            });
        } catch (err) {
            console.log('Share cancelled');
        }
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        const clickX = e.clientX;
        const windowWidth = window.innerWidth;
        const leftBoundary = windowWidth * 0.2;
        const rightBoundary = windowWidth * 0.8;
        
        // Close only if clicking in center area (not on left/right 20%)
        if (clickX > leftBoundary && clickX < rightBoundary) {
            lightbox.classList.remove('active');
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
    } else if (e.key === 'ArrowLeft') {
        showImage(currentImageIndex - 1);
    } else if (e.key === 'ArrowRight') {
        showImage(currentImageIndex + 1);
    }
});
