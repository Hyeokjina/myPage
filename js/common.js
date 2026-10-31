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

// fav-modal처럼 모달이 열린 채로 목록이 다시 그려져 trapFocus가 재호출될 수 있어
// (1) focusable 목록은 Tab을 누를 때마다 새로 조회하고 (제거된 요소에 포커스가 걸려 트랩이 깨지는 것 방지)
// (2) 이미 트랩 중이면 리스너/복귀 대상을 다시 만들지 않는다 (중복 등록·복귀 대상 덮어쓰기 방지)
function trapFocus(modalEl) {
    const focusable = Array.from(modalEl.querySelectorAll(FOCUSABLE_SEL));
    if (!focusable.length) return;
    if (!modalEl._focusTrapHandler) {
        modalEl._focusReturnEl = document.activeElement;
        modalEl._focusTrapHandler = e => {
            if (e.key !== 'Tab') return;
            const current = Array.from(modalEl.querySelectorAll(FOCUSABLE_SEL));
            if (!current.length) return;
            const first = current[0];
            const last  = current[current.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
            }
        };
        modalEl.addEventListener('keydown', modalEl._focusTrapHandler);
    }
    focusable[0].focus();
}

function releaseFocus(modalEl) {
    if (modalEl._focusTrapHandler) {
        modalEl.removeEventListener('keydown', modalEl._focusTrapHandler);
        delete modalEl._focusTrapHandler;
    }
    modalEl._focusReturnEl?.focus();
    delete modalEl._focusReturnEl;
}

// 관광지 상세 모달 공통 로직 — about.js(인천 소개), region-detail.js(지역 상세 페이지) 공용
// dataMap: { key: { title, desc, info[], img? } } 형태의 상세 데이터
// img 필드가 있는 페이지만 #detail-img를 사용하고, 없으면 건드리지 않음
function initDetailModal(dataMap) {
    function openDetail(key) {
        const d = dataMap[key];
        if (!d) return;

        const imgEl = document.getElementById('detail-img');
        if (imgEl) {
            if (d.img) {
                imgEl.src = d.img;
                imgEl.alt = d.title;
                imgEl.style.display = '';
            } else {
                imgEl.style.display = 'none';
            }
        }

        document.getElementById('detail-title').textContent = d.title;
        document.getElementById('detail-desc').textContent = d.desc;
        const infoEl = document.getElementById('detail-info');
        infoEl.innerHTML = '';
        d.info.forEach(i => {
            const span = document.createElement('span');
            span.textContent = i;
            infoEl.appendChild(span);
        });

        // 카카오맵 버튼
        let mapBtn = document.getElementById('detail-map-btn');
        if (!mapBtn) {
            mapBtn = document.createElement('a');
            mapBtn.id = 'detail-map-btn';
            mapBtn.className = 'detail-map-btn';
            mapBtn.target = '_blank';
            mapBtn.rel = 'noopener noreferrer';
            infoEl.after(mapBtn);
        }
        mapBtn.href = `https://map.kakao.com/?q=${encodeURIComponent(d.title)}`;
        mapBtn.textContent = '🗺️ 카카오맵에서 보기';

        const overlay = document.getElementById('detail-overlay');
        overlay.classList.add('open');
        trapFocus(overlay);
    }

    function closeDetail() {
        const overlay = document.getElementById('detail-overlay');
        overlay.classList.remove('open');
        releaseFocus(overlay);
    }

    document.querySelectorAll('[data-detail]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            openDetail(link.dataset.detail);
        });
    });
    document.getElementById('detail-overlay')?.addEventListener('click', e => {
        if (e.target === document.getElementById('detail-overlay')) closeDetail();
    });
    document.querySelector('.detail-close')?.addEventListener('click', closeDetail);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDetail();
    });
}

// 사이드 메뉴 스크롤 스파이 공통 로직 — about.js, region-detail.js 공용
function initScrollSpy() {
    const menuLinks = document.querySelectorAll('.side-menu a[href^="#"]');
    if (!menuLinks.length) return;

    const sectionIds = Array.from(menuLinks).map(a => a.getAttribute('href').slice(1));
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    const setActive = (id) => {
        menuLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
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

// localStorage에 JSON을 읽고 쓰는 공통 헬퍼 — common.js/reviews.js/planner.js 공용
// silent가 true면 저장 실패 시에도 토스트 없이 조용히 넘어감 (같은 동작 안에서 토스트가 중복되지 않게)
function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function writeJSON(key, value, silent = false) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        if (!silent) showToast('저장 공간이 부족합니다. 일부 데이터를 삭제해주세요.');
        return false;
    }
}

// 필터/탭 버튼 공통 로직 — food/festival/reviews/lodging/regions 페이지에서 공통으로 사용
// 컨테이너 안에서 버튼 클릭 → 클릭된 버튼에만 active 클래스 부여 → onSelect(dataset, 버튼) 호출
function initFilterGroup(containerSelector, itemSelector, onSelect) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.addEventListener('click', e => {
        const item = e.target.closest(itemSelector);
        if (!item) return;
        container.querySelectorAll(itemSelector).forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        onSelect(item.dataset, item);
    });
}

// 글자수 카운터 공통 로직 — contact.js, reviews.js 공용
// maxlength 속성으로 입력 자체가 막혀있는 필드는 warnAtMax:true로 호출해 글자수 도달 즉시 경고 표시
// (contact.js의 문의 내용은 maxlength가 없어 실제로 초과 입력이 가능하므로 기본값 false 사용)
function bindCharCounter(input, counterEl, max, { warnAtMax = false } = {}) {
    input.addEventListener('input', () => {
        const len = input.value.length;
        counterEl.textContent = `${len} / ${max}`;
        counterEl.classList.toggle('over', warnAtMax ? len >= max : len > max);
    });
}

document.querySelector('.hamburger')?.addEventListener('click', toggleNav);
document.getElementById('dark-btn')?.addEventListener('click', toggleDark);
document.getElementById('back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// 모바일 메뉴: 바깥 클릭 / Esc 키로 닫기
document.addEventListener('click', e => {
    const nav = document.querySelector('header nav');
    const hamburger = document.querySelector('.hamburger');
    if (!nav?.classList.contains('open')) return;
    if (nav.contains(e.target) || hamburger?.contains(e.target)) return;
    toggleNav();
});
document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const nav = document.querySelector('header nav');
    if (nav?.classList.contains('open')) toggleNav();
});

// 즐겨찾기(찜) 공통 로직 — index.html, lodging.html, 지역 상세 페이지 공통
// (버튼은 페이지마다 다르게 만들어지지만, 저장·배지·모달 동작은 이 한 곳에서만 처리)
const FAV_KEY = 'incheon_favorites';

function getFavs() {
    return readJSON(FAV_KEY, []);
}

function saveFavs(favs) {
    writeJSON(FAV_KEY, favs);
}

function updateFavBadge() {
    const badge = document.getElementById('fav-badge');
    if (badge) badge.textContent = getFavs().length;
}

// STAMP_DESTINATIONS는 파일 아래쪽에 선언돼 있지만, 함수 선언은 호이스팅되고
// 실제 호출은 그 선언 이후(trackStamp 실행 직후)에만 이뤄지므로 문제없음
// 저장된 값 중 현재 스탬프 대상인 것만 세서, 헤더 배지와 모달 진행률이 항상 같은 기준을 쓰도록 함
function getCollectedStamps() {
    const stamps = readJSON('travel_stamps', []);
    return Object.keys(STAMP_DESTINATIONS).filter(file => stamps.includes(file));
}

function updateStampBadge() {
    const badge = document.getElementById('stamp-badge');
    if (!badge) return;
    const total = Object.keys(STAMP_DESTINATIONS).length;
    badge.textContent = `${getCollectedStamps().length}/${total}`;
}

function syncFavButtons() {
    const favs = getFavs();
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const name = btn.dataset.name;
        if (!name) return;
        const active = favs.includes(name);
        btn.textContent = active ? '♥' : '♡';
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-label', active ? '찜 취소' : '찜하기');
    });
}

function toggleFav(name) {
    let favs = getFavs();
    favs = favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name];
    saveFavs(favs);
    updateFavBadge();
    syncFavButtons();
}

function removeFav(name) {
    saveFavs(getFavs().filter(f => f !== name));
    updateFavBadge();
    syncFavButtons();
    openFavModal();
}

function openFavModal() {
    const modal = document.getElementById('fav-modal');
    if (!modal) return;
    const favs = getFavs();
    const list = document.getElementById('fav-list');
    const empty = document.getElementById('fav-empty');
    list.innerHTML = '';
    if (favs.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        favs.forEach(name => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = `♥ ${name}`;
            const delBtn = document.createElement('button');
            delBtn.textContent = '✕';
            delBtn.title = '삭제';
            delBtn.addEventListener('click', () => removeFav(name));
            li.appendChild(span);
            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }
    modal.classList.add('open');
    trapFocus(modal);
}

function closeFavModal() {
    const modal = document.getElementById('fav-modal');
    if (!modal) return;
    modal.classList.remove('open');
    releaseFocus(modal);
}

// 스탬프 모달 — 6개 지역 중 모은 것/못 모은 것을 그리드로 표시
function openStampModal() {
    const modal = document.getElementById('stamp-modal');
    if (!modal) return;
    const collectedStamps = getCollectedStamps();
    const grid = document.getElementById('stamp-grid');
    grid.innerHTML = '';
    Object.entries(STAMP_DESTINATIONS).forEach(([file, dest]) => {
        const collected = collectedStamps.includes(file);
        const item = document.createElement('div');
        item.className = 'stamp-item' + (collected ? ' collected' : '');
        item.innerHTML = `<span class="stamp-emoji">${dest.emoji}</span><span class="stamp-name">${dest.name}</span>`;
        grid.appendChild(item);
    });

    // 진행률 — showToast·detail-map-btn처럼 없으면 만들고, 있으면 값만 갱신
    let progress = document.getElementById('stamp-progress');
    if (!progress) {
        progress = document.createElement('div');
        progress.id = 'stamp-progress';
        progress.className = 'stamp-progress';
        progress.innerHTML =
            '<div class="stamp-progress-bar"><div class="stamp-progress-fill"></div></div>' +
            '<span class="stamp-progress-label"></span>';
        grid.before(progress);
    }
    const total = Object.keys(STAMP_DESTINATIONS).length;
    const done = collectedStamps.length;
    const allDone = done === total;
    progress.querySelector('.stamp-progress-fill').style.width = `${(done / total) * 100}%`;
    progress.querySelector('.stamp-progress-label').textContent =
        allDone ? '🎉 전국 제패!' : `${done} / ${total} 수집`;
    progress.classList.toggle('done-all', allDone);

    modal.classList.add('open');
    trapFocus(modal);
}

function closeStampModal() {
    const modal = document.getElementById('stamp-modal');
    if (!modal) return;
    modal.classList.remove('open');
    releaseFocus(modal);
}

// 즐겨찾기 버튼은 나중에 동적으로 추가되는 경우도 있어, 이벤트 위임으로 한 번만 등록
document.addEventListener('click', e => {
    const btn = e.target.closest('.fav-btn');
    if (!btn?.dataset.name) return;
    e.stopPropagation();
    toggleFav(btn.dataset.name);
});

// fav-modal, stamp-modal 두 모달이 같은 페이지에 함께 있을 수 있어
// .modal-close/바깥 클릭/Esc 처리는 어느 모달인지 id로 구분해서 공용으로 처리
document.querySelector('.fav-count')?.addEventListener('click', openFavModal);
document.querySelector('.stamp-count')?.addEventListener('click', openStampModal);
document.addEventListener('click', e => {
    const closeBtn = e.target.closest('.modal-close');
    const modal = closeBtn ? closeBtn.closest('.modal-overlay') : (e.target.classList.contains('modal-overlay') ? e.target : null);
    if (!modal) return;
    if (modal.id === 'fav-modal') closeFavModal();
    else if (modal.id === 'stamp-modal') closeStampModal();
});
document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('fav-modal')?.classList.contains('open')) closeFavModal();
    else if (document.getElementById('stamp-modal')?.classList.contains('open')) closeStampModal();
});

updateFavBadge();
syncFavButtons();

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
    let recent = readJSON('recently_viewed', []);
    recent = recent.filter(r => r.href !== file);
    recent.unshift({ name: info.name, href: file, img: info.img });
    recent = recent.slice(0, 5);
    writeJSON('recently_viewed', recent, true);
})();

// 여행 스탬프 — 방문 기록
// 6개 지역 페이지만 "진짜 여행지"로 보고 스탬프 대상으로 삼음 (숙소 세일/인기 지역 같은 목록 페이지는 제외)
// 모달 등 다른 곳에서도 이름/이모지가 필요해서 최상위 상수로 선언
const STAMP_DESTINATIONS = {
    'about.html':    { name: '인천', emoji: '🛳️' },
    'seoul.html':    { name: '서울', emoji: '🏯' },
    'busan.html':    { name: '부산', emoji: '🌊' },
    'jeju.html':     { name: '제주', emoji: '🍊' },
    'gangwon.html':  { name: '강원', emoji: '🏔️' },
    'gyeongju.html': { name: '경주', emoji: '🏛️' },
};

(function trackStamp() {
    const file = location.pathname.split('/').pop() || 'index.html';
    const dest = STAMP_DESTINATIONS[file];
    if (!dest) return;
    const stamps = readJSON('travel_stamps', []);
    if (stamps.includes(file)) return; // 이미 모은 스탬프면 중복 저장하지 않음
    stamps.push(file);
    writeJSON('travel_stamps', stamps, true);
    showToast(`${dest.emoji} ${dest.name} 스탬프 획득!`);
})();

updateStampBadge();

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

// 서비스워커 등록 — 설치(PWA)와 오프라인 캐싱을 담당하는 sw.js를 연결
// 페이지 로드가 다 끝난 뒤에 등록해서 초기 렌더링을 방해하지 않게 함
// file://로 직접 열면 등록이 항상 실패하니, 로컬 서버(http://)로 띄워서 테스트해야 함
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .catch(err => console.warn('서비스워커 등록 실패:', err));
    });
}
