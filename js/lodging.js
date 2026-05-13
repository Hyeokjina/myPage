const cards = document.querySelectorAll('.lodging-card');
const emptyMsg = document.getElementById('lodging-empty');

let activeRegion = '전체';
let activePrice = '전체';

function matchesPrice(price, range) {
    if (range === '전체') return true;
    if (range === 'under10') return price < 100000;
    if (range === '10to20') return price >= 100000 && price < 200000;
    if (range === 'over20') return price >= 200000;
    return true;
}

function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
        const regionMatch = activeRegion === '전체' || card.dataset.region === activeRegion;
        const priceMatch = matchesPrice(Number(card.dataset.price || 0), activePrice);
        const show = regionMatch && priceMatch;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
    });
    emptyMsg.style.display = visible === 0 ? 'block' : 'none';
}

document.getElementById('region-filter').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('#region-filter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeRegion = btn.dataset.filter;
    applyFilters();
});

document.getElementById('price-filter').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('#price-filter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePrice = btn.dataset.price;
    applyFilters();
});
