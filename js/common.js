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
    const nav = document.querySelector('header nav');
    nav.classList.toggle('open');
    document.querySelector('.hamburger')
        ?.setAttribute('aria-expanded', nav.classList.contains('open'));
}

function toggleDark() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('dark', isDark);
    const btn = document.getElementById('dark-btn');
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? '라이트모드로 전환' : '다크모드로 전환');
}

window.addEventListener('scroll', () => {
    document.getElementById('back-to-top')?.classList.toggle('visible', window.scrollY > 300);

    const el = document.getElementById('scroll-progress');
    if (el) {
        const scrolled = document.documentElement.scrollTop;
        const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        el.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
    }
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
const REGION_SUBPAGES = new Set(['seoul.html', 'busan.html', 'jeju.html', 'gangwon.html', 'gyeongju.html']);
const currentFile = location.pathname.split('/').pop() || 'index.html';
const activeFile = REGION_SUBPAGES.has(currentFile) ? 'regions.html' : currentFile;
document.querySelectorAll('nav a, .bottom-nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === activeFile) {
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

// 최근 본 여행지 추적
(function trackRecentlyViewed() {
    const PAGE_MAP = {
        'seoul.html':    { name: '서울',     img: './images/seoul.png' },
        'busan.html':    { name: '부산',     img: './images/busan.png' },
        'jeju.html':     { name: '제주',     img: './images/jeju.png' },
        'gangwon.html':  { name: '강원',     img: './images/gangwon.png' },
        'gyeongju.html': { name: '경주',     img: './images/gyeongju.png' },
        'about.html':    { name: '인천',     img: './images/town.png' },
        'lodging.html':  { name: '숙소 세일', img: './images/lo1.png' },
        'regions.html':  { name: '인기 지역', img: './images/seoul.png' },
    };
    const file = location.pathname.split('/').pop() || 'index.html';
    const info = PAGE_MAP[file];
    if (!info) return;
    try {
        let recent = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
        recent = recent.filter(r => r.href !== file);
        recent.unshift({ name: info.name, href: file, img: info.img });
        recent = recent.slice(0, 5);
        localStorage.setItem('recently_viewed', JSON.stringify(recent));
    } catch {}
})();

// 라이트박스
(function initLightbox() {
    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="닫기">✕</button>
        <img class="lightbox-img" src="" alt="">
        <p class="lightbox-caption"></p>`;
    document.body.appendChild(overlay);

    const img = overlay.querySelector('.lightbox-img');
    const caption = overlay.querySelector('.lightbox-caption');

    function open(src, alt) {
        img.src = src;
        img.alt = alt;
        caption.textContent = alt;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        overlay.querySelector('.lightbox-close').focus();
    }

    function close() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        img.src = '';
    }

    document.addEventListener('click', e => {
        const target = e.target.closest('.card-img-wrap img, .lodging-img-wrap img');
        if (!target || target.src.includes('/icon/')) return;
        e.stopPropagation();
        const alt = target.alt || target.closest('li, .lodging-card')?.querySelector('h3')?.textContent || '';
        open(target.src, alt);
    });

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
})();

// 공유 버튼 (동적 주입)
(function initShareBtn() {
    if (!navigator.share) return;
    const btn = document.createElement('button');
    btn.id = 'share-btn';
    btn.className = 'share-btn';
    btn.setAttribute('aria-label', '페이지 공유');
    btn.innerHTML = '&#x1F517; 공유';
    btn.addEventListener('click', () => {
        navigator.share({ title: document.title, url: location.href }).catch(() => {});
    });
    document.body.appendChild(btn);
})();

// 푸터 연도 자동화
document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});

// 접근성 초기화
(function initA11y() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.setAttribute('aria-label', '메뉴 열기/닫기');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'main-nav');
        document.querySelector('header nav')?.setAttribute('id', 'main-nav');
    }

    const darkBtn = document.getElementById('dark-btn');
    if (darkBtn) {
        const isDark = document.body.classList.contains('dark');
        darkBtn.setAttribute('aria-label', isDark ? '라이트모드로 전환' : '다크모드로 전환');
    }

    document.getElementById('back-to-top')
        ?.setAttribute('aria-label', '맨 위로 이동');

    document.querySelector('.fav-count')
        ?.setAttribute('aria-label', '즐겨찾기 목록 열기');

    document.querySelector('.bottom-nav')
        ?.setAttribute('aria-label', '하단 탭 메뉴');

    document.querySelector('header nav')
        ?.setAttribute('aria-label', '주요 메뉴');
})();
