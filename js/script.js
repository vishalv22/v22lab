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

// Scroll reveal animation
const revealElements = document.querySelectorAll('.scroll-reveal');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            el.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

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
const interactiveCards = document.querySelectorAll('.hero-console, .highlight-card, .stat-card, .featured-card');
let ticking = false;

interactiveCards.forEach(card => {
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

// Button ripple effect
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
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

// Add ripple animation keyframes dynamically
if (!document.querySelector('#ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
        @keyframes ripple {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
