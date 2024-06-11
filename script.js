// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const mainContent = document.getElementById('main-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = e.target.getAttribute('href');
            loadContent(page);
        });
    });

    function loadContent(page) {
        mainContent.classList.add('fade-out');
        fetch(page)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const newContent = doc.getElementById('main-content').innerHTML;
                mainContent.innerHTML = newContent;
                history.pushState(null, '', page);
                mainContent.classList.remove('fade-out');
                mainContent.classList.add('fade-in');

                if (page === 'contact.html') {
                    const contactForm = document.getElementById('contact-form');
                    contactForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        alert('Mesajınız gönderildi!');
                        contactForm.reset();
                    });
                }
                
                if (page === 'notes.html') {
                    const noteForm = document.getElementById('note-form');
                    const notesGrid = document.querySelector('.notes-grid');

                    noteForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const title = document.getElementById('note-title').value;
                        const content = document.getElementById('note-content').value;
                        addNoteToPage(title, content);
                        noteForm.reset();
                    });

                    function addNoteToPage(title, content) {
                        const noteItem = document.createElement('div');
                        noteItem.classList.add('note-item');
                        noteItem.innerHTML = `
                            <h3>${title}</h3>
                            <p>${content}</p>
                        `;
                        notesGrid.appendChild(noteItem);
                    }
                }
            })
            .catch(error => console.error('Error loading content:', error));
    }

    window.addEventListener('popstate', function() {
        const path = window.location.pathname.split('/').pop();
        loadContent(path || 'index.html');
    });

    const initialPage = window.location.pathname.split('/').pop() || 'index.html';
    loadContent(initialPage);
});
