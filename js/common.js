function toggleDark() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('dark', isDark);
    document.getElementById('dark-btn').textContent = isDark ? '☀️' : '🌙';
}

window.addEventListener('scroll', () => {
    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 300);
});

if (localStorage.getItem('dark') === 'true') {
    document.body.classList.add('dark');
    document.getElementById('dark-btn').textContent = '☀️';
}
