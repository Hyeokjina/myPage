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
    document.querySelector('header nav').classList.toggle('open');
}

function toggleDark() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('dark', isDark);
    document.getElementById('dark-btn').textContent = isDark ? '☀️' : '🌙';
}

window.addEventListener('scroll', () => {
    document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 300);
});

// 다크모드 초기화: 저장값 우선, 없으면 OS 설정 따름
const savedDark = localStorage.getItem('dark');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDarkMode = savedDark !== null ? savedDark === 'true' : prefersDark;

if (isDarkMode) {
    document.body.classList.add('dark');
    document.getElementById('dark-btn').textContent = '☀️';
}

// OS 다크모드 변경 감지 (저장값 없을 때만 반응)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('dark') !== null) return;
    document.body.classList.toggle('dark', e.matches);
    document.getElementById('dark-btn').textContent = e.matches ? '☀️' : '🌙';
});

// 네비게이션 active 자동화 (헤더 nav + 하단 탭바 공통)
const currentFile = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a, .bottom-nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === currentFile) {
        a.classList.add('active');
    }
});

const FOCUSABLE_SEL = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(modalEl) {
    const focusable = Array.from(modalEl.querySelectorAll(FOCUSABLE_SEL));
    if (!focusable.length) return;
    modalEl._focusReturnEl = document.activeElement;
    focusable[0].focus();
    modalEl._focusTrapHandler = e => {
        if (e.key !== 'Tab') return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
    };
    modalEl.addEventListener('keydown', modalEl._focusTrapHandler);
}

function releaseFocus(modalEl) {
    if (modalEl._focusTrapHandler) {
        modalEl.removeEventListener('keydown', modalEl._focusTrapHandler);
        delete modalEl._focusTrapHandler;
    }
    modalEl._focusReturnEl?.focus();
    delete modalEl._focusReturnEl;
}

function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelector('.hamburger')?.addEventListener('click', toggleNav);
document.getElementById('dark-btn')?.addEventListener('click', toggleDark);
document.getElementById('back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
