// 스크롤 애니메이션
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.places li, .lodging li, .card, .region-card, .lodging-card').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    el.classList.add('reveal');
    revealObserver.observe(el);
});

function toggleNav() {
    document.querySelector('nav').classList.toggle('open');
}

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
