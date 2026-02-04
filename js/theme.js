
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
        const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        if (theme === 'dark') {
            toggleBtn.textContent = '☀️ Light';
        } else {
            toggleBtn.textContent = '🌙 Dark';
        }
    }
}

function getTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        return saved;
    }
    return getSystemTheme();
}

function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

document.addEventListener('DOMContentLoaded', function() {
    const theme = getTheme();
    setTheme(theme);
    
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
        const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});
