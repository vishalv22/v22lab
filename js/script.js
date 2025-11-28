// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Typing effect
const typingText = document.getElementById('typing-text');
if (typingText) {
    const text = 'Vishal';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 150);
        } else {
            document.querySelector('.cursor').style.animation = 'blink 1s infinite';
        }
    }
    
    setTimeout(type, 500);
}

// Cursor light effect with throttling
const cards = document.querySelectorAll('.hero-console, .highlight-card');
let ticking = false;

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Horizontal scroll with wheel - buttery smooth scrolling
const scrollContainer = document.querySelector('.highlight-scroll-container');
if (scrollContainer) {
    let targetScrollLeft = scrollContainer.scrollLeft;
    let currentScrollLeft = scrollContainer.scrollLeft;
    let rafId = null;
    const cards = scrollContainer.querySelectorAll('.highlight-card');

    function updateCenterCard() {
        const viewportCenter = window.innerWidth / 2;
        
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(viewportCenter - cardCenter);
            
            if (distance < cardRect.width / 2) {
                card.classList.add('center-active');
            } else {
                card.classList.remove('center-active');
            }
        });
    }

    function smoothScroll() {
        const diff = targetScrollLeft - currentScrollLeft;
        const delta = diff * 0.08;
        
        if (Math.abs(diff) > 0.1) {
            currentScrollLeft += delta;
            scrollContainer.scrollLeft = currentScrollLeft;
            updateCenterCard();
            rafId = requestAnimationFrame(smoothScroll);
        } else {
            currentScrollLeft = targetScrollLeft;
            scrollContainer.scrollLeft = targetScrollLeft;
            updateCenterCard();
            rafId = null;
        }
    }

    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        targetScrollLeft += e.deltaY * 2;
        targetScrollLeft = Math.max(0, Math.min(
            targetScrollLeft,
            scrollContainer.scrollWidth - scrollContainer.clientWidth
        ));
        
        if (!rafId) {
            currentScrollLeft = scrollContainer.scrollLeft;
            rafId = requestAnimationFrame(smoothScroll);
        }
    }, { passive: false });

    scrollContainer.addEventListener('scroll', () => {
        updateCenterCard();
    });

    updateCenterCard();
}

