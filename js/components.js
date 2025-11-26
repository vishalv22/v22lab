// Reusable header component
function createHeader(activePage) {
    return `
        <a href="index.html"><img src="assets/logo.png" alt="v22lab Logo" width="60"></a>
        <nav>
            <a href="index.html" class="nav-btn ${activePage === 'home' ? 'active' : ''}">Home</a>
            <a href="projects.html" class="nav-btn ${activePage === 'projects' ? 'active' : ''}">Projects</a>
            <a href="gallery.html" class="nav-btn ${activePage === 'gallery' ? 'active' : ''}">Gallery</a>
            <a href="notes.html" class="nav-btn ${activePage === 'notes' ? 'active' : ''}">Notes</a>
            <a href="about.html" class="nav-btn ${activePage === 'about' ? 'active' : ''}">About Me</a>
        </nav>
    `;
}

// Reusable footer component
function createFooter() {
    return `<p>Made by <span class="highlight">Vishal</span></p>`;
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const activePage = document.body.dataset.page;
    
    if (header) header.innerHTML = createHeader(activePage);
    if (footer) footer.innerHTML = createFooter();
});
