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

// Horizontal scroll with wheel
const scrollContainer = document.querySelector('.highlight-scroll-container');
if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY * 3;
    }, { passive: false });
}

