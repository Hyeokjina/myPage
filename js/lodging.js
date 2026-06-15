const grid = document.getElementById('lodging-grid');
const emptyMsg = document.getElementById('lodging-empty');
const sortSelect = document.getElementById('lodging-sort');

let activeRegion = '전체';
let activePrice = '전체';
let activeSort = 'default';

// 초기 HTML 순서를 기억해 "기본순" 복원에 사용
Array.from(grid.querySelectorAll('.lodging-card')).forEach((card, i) => {
    card.dataset.originalIndex = i;
});

function getCards() {
    return Array.from(grid.querySelectorAll('.lodging-card'));
}

function matchesPrice(price, range) {
    if (range === '전체') return true;
    if (range === 'under10') return price < 100000;
    if (range === '10to20') return price >= 100000 && price < 200000;
    if (range === 'over20') return price >= 200000;
    return true;
}

function applyFilters() {
    const cards = getCards();

    // 필터 적용
    let visible = 0;
    cards.forEach(card => {
        const regionMatch = activeRegion === '전체' || card.dataset.region === activeRegion;
        const priceMatch = matchesPrice(Number(card.dataset.price || 0), activePrice);
        const show = regionMatch && priceMatch;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
    });
    emptyMsg.style.display = visible === 0 ? 'block' : 'none';

    // 정렬 적용 — 기본순은 originalIndex로 복원
    const sorted = cards.slice().sort((a, b) => {
        if (activeSort === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
        if (activeSort === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
        return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
    });
    sorted.forEach(card => grid.appendChild(card));
}

function resetSort() {
    activeSort = 'default';
    sortSelect.value = 'default';
}

document.getElementById('region-filter').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('#region-filter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeRegion = btn.dataset.filter;
    resetSort();
    applyFilters();
});

document.getElementById('price-filter').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('#price-filter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePrice = btn.dataset.price;
    resetSort();
    applyFilters();
});

sortSelect.addEventListener('change', e => {
    activeSort = e.target.value;
    applyFilters();
});

// ── 숙소 찜하기 ──────────────────────────────────────
const FAV_KEY = 'incheon_favorites';

function getLodgingFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
}

function saveLodgingFavs(favs) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch {}
}

function updateFavBtns() {
    const favs = getLodgingFavs();
    document.querySelectorAll('.lodging-fav-btn').forEach(btn => {
        const active = favs.includes(btn.dataset.name);
        btn.textContent = active ? '♥' : '♡';
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-label', active ? '찜 취소' : '찜하기');
    });
}

function toggleLodgingFav(e, name) {
    e.stopPropagation();
    let favs = getLodgingFavs();
    favs = favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name];
    saveLodgingFavs(favs);
    updateFavBtns();
}

// 각 카드 이미지 영역에 ♡ 버튼 동적 삽입
getCards().forEach(card => {
    const name = card.querySelector('h3')?.textContent.trim();
    if (!name) return;
    const btn = document.createElement('button');
    btn.className = 'lodging-fav-btn';
    btn.dataset.name = name;
    btn.textContent = '♡';
    btn.setAttribute('aria-label', '찜하기');
    btn.addEventListener('click', e => toggleLodgingFav(e, name));
    card.querySelector('.lodging-img-wrap').appendChild(btn);
});

updateFavBtns();
