// Reusable header component
function createHeader(activePage) {
    return `
        <div class="header-left">
            <a href="index.html"><img src="assets/logo.png" alt="v22lab Logo" width="60"></a>
            <nav>
                <a href="index.html" class="nav-btn ${activePage === 'home' ? 'active' : ''}">Home</a>
                <a href="projects.html" class="nav-btn ${activePage === 'projects' ? 'active' : ''}">Projects</a>
                <a href="gallery.html" class="nav-btn ${activePage === 'gallery' ? 'active' : ''}">Gallery</a>
                <a href="notes.html" class="nav-btn ${activePage === 'notes' ? 'active' : ''}">Notes</a>
                <a href="about.html" class="nav-btn ${activePage === 'about' ? 'active' : ''}">About</a>
            </nav>
        </div>
        <a href="about.html#contact" class="header-cta">Get in Touch</a>
    `;
}

// Reusable footer component
function createFooter() {
    const year = new Date().getFullYear();
    return `
        <div class="footer-content">
            <p>© ${year} v22lab. All rights reserved.</p>
            <p>Designed & Developed by <span class="highlight">Vishal</span></p>
        </div>
    `;
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const activePage = document.body.dataset.page;
    
    if (header) header.innerHTML = createHeader(activePage);
    if (footer) footer.innerHTML = createFooter();
});
