const FAV_KEY = 'incheon_favorites';

function getFavs() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveFavs(favs) {
    try {
        localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    } catch {
        showToast('저장 공간이 부족합니다. 일부 데이터를 삭제해주세요.');
    }
}

function updateBadge() {
    document.getElementById('fav-badge').textContent = getFavs().length;
}

function updateButtons() {
    const favs = getFavs();
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const name = btn.dataset.name;
        if (!name) return;
        if (favs.includes(name)) {
            btn.textContent = '♥';
            btn.classList.add('active');
        } else {
            btn.textContent = '♡';
            btn.classList.remove('active');
        }
    });
}

function toggleFav(event, name) {
    event.stopPropagation();
    let favs = getFavs();
    favs = favs.includes(name) ? favs.filter(f => f !== name) : [...favs, name];
    saveFavs(favs);
    updateBadge();
    updateButtons();
}

function openFavModal() {
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
            const btn = document.createElement('button');
            btn.textContent = '✕';
            btn.title = '삭제';
            btn.addEventListener('click', () => removeFav(name));
            li.appendChild(span);
            li.appendChild(btn);
            list.appendChild(li);
        });
    }
    document.getElementById('fav-modal').classList.add('open');
    trapFocus(document.getElementById('fav-modal'));
}

function removeFav(name) {
    saveFavs(getFavs().filter(f => f !== name));
    updateBadge();
    updateButtons();
    openFavModal();
}

function closeFavModal() {
    const modal = document.getElementById('fav-modal');
    modal.classList.remove('open');
    releaseFocus(modal);
}

function closeFavModalOutside(event) {
    if (event.target === document.getElementById('fav-modal')) closeFavModal();
}

// 자동완성 후보 목록
const AUTOCOMPLETE_ITEMS = [
    { name: '차이나타운',      href: null },
    { name: '송도 센트럴파크', href: null },
    { name: '월미도',          href: null },
    { name: '서울',            href: 'seoul.html' },
    { name: '부산',            href: 'busan.html' },
    { name: '제주',            href: 'jeju.html' },
    { name: '강원',            href: 'gangwon.html' },
    { name: '경주',            href: 'gyeongju.html' },
    { name: '인천',            href: 'about.html' },
    { name: '송도 뷰 호텔',    href: 'lodging.html' },
    { name: '월미도 씨사이드 펜션', href: 'lodging.html' },
    { name: '차이나타운 게스트하우스', href: 'lodging.html' },
];

(function initAutocomplete() {
    const input = document.getElementById('search-input');
    if (!input) return;

    const box = document.createElement('ul');
    box.id = 'autocomplete-list';
    box.className = 'autocomplete-list';
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(box);

    let activeIdx = -1;

    function closeList() {
        box.innerHTML = '';
        box.style.display = 'none';
        activeIdx = -1;
    }

    function renderList(query) {
        const q = query.trim().toLowerCase();
        if (!q) { closeList(); return; }
        const matches = AUTOCOMPLETE_ITEMS.filter(item =>
            item.name.toLowerCase().includes(q)
        );
        if (matches.length === 0) { closeList(); return; }

        box.innerHTML = '';
        activeIdx = -1;
        matches.forEach((item, i) => {
            const li = document.createElement('li');
            li.className = 'autocomplete-item';
            li.innerHTML = item.name.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
            li.addEventListener('mousedown', e => {
                e.preventDefault();
                if (item.href) { window.location.href = item.href; return; }
                input.value = item.name;
                searchPlaces();
                document.getElementById('places')?.scrollIntoView({ behavior: 'smooth' });
                closeList();
            });
            box.appendChild(li);
        });
        box.style.display = 'block';
    }

    input.addEventListener('input', () => renderList(input.value));
    input.addEventListener('focus', () => renderList(input.value));
    input.addEventListener('blur', () => setTimeout(closeList, 150));

    input.addEventListener('keydown', e => {
        const items = box.querySelectorAll('.autocomplete-item');
        if (!items.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIdx = (activeIdx + 1) % items.length;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIdx = (activeIdx - 1 + items.length) % items.length;
        } else if (e.key === 'Escape') {
            closeList(); return;
        } else if (e.key === 'Enter' && activeIdx >= 0) {
            e.preventDefault();
            items[activeIdx].dispatchEvent(new MouseEvent('mousedown'));
            return;
        } else { return; }
        items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
        if (activeIdx >= 0) input.value = items[activeIdx].textContent;
    });

    document.addEventListener('click', e => {
        if (!input.parentNode.contains(e.target)) closeList();
    });
})();

function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>');
}

function searchPlaces() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    document.querySelectorAll('.container[id]').forEach(section => {
        const items = section.querySelectorAll('.places li, .lodging li');
        if (!items.length) return;
        let anyVisible = false;
        items.forEach(li => {
            const h3 = li.querySelector('h3');
            const desc = li.querySelector('p');
            const rawName = h3?._originalText ?? h3?.textContent ?? '';
            const rawDesc = desc?._originalText ?? desc?.textContent ?? '';
            if (h3 && !h3._originalText) h3._originalText = h3.textContent;
            if (desc && !desc._originalText) desc._originalText = desc.textContent;
            const searchTarget = (rawName + ' ' + rawDesc).toLowerCase();
            const visible = !query || searchTarget.includes(query);
            li.style.display = visible ? '' : 'none';
            if (h3) h3.innerHTML = visible && query ? highlight(rawName, query) : rawName;
            if (desc) desc.innerHTML = visible && query ? highlight(rawDesc, query) : rawDesc;
            if (visible) anyVisible = true;
        });
        let noResult = section.querySelector('.no-result');
        if (!anyVisible) {
            if (!noResult) {
                noResult = document.createElement('p');
                noResult.className = 'no-result';
                noResult.style.cssText = 'text-align:center; color:#999; padding:20px 0; font-size:1em;';
                noResult.textContent = '검색 결과가 없습니다.';
                section.appendChild(noResult);
            }
            noResult.style.display = 'block';
        } else if (noResult) {
            noResult.style.display = 'none';
        }
    });
}

// 이벤트 리스너 등록
document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', e => toggleFav(e, btn.dataset.name));
});

document.querySelectorAll('.places li[data-href], .lodging li[data-href]').forEach(li => {
    li.addEventListener('click', () => { window.location.href = li.dataset.href; });
    li.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = li.dataset.href;
        }
    });
});

document.querySelector('.fav-count')?.addEventListener('click', openFavModal);
document.querySelector('.modal-close')?.addEventListener('click', closeFavModal);
document.getElementById('fav-modal')?.addEventListener('click', closeFavModalOutside);

document.querySelectorAll('.hero-tag').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.href) {
            window.location.href = btn.dataset.href;
            return;
        }
        const input = document.getElementById('search-input');
        if (input) { input.value = btn.dataset.query; searchPlaces(); }
        document.getElementById('places')?.scrollIntoView({ behavior: 'smooth' });
    });
});

document.getElementById('search-input')?.addEventListener('input', () => {
    searchPlaces();
    const clearBtn = document.getElementById('search-clear-btn');
    if (clearBtn) clearBtn.style.display = document.getElementById('search-input').value ? 'block' : 'none';
});
document.getElementById('search-btn')?.addEventListener('click', searchPlaces);
document.getElementById('search-clear-btn')?.addEventListener('click', () => {
    const input = document.getElementById('search-input');
    input.value = '';
    input.focus();
    document.getElementById('search-clear-btn').style.display = 'none';
    searchPlaces();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('fav-modal').classList.contains('open')) {
        closeFavModal();
    }
});

// 최근 본 여행지 렌더링
function renderRecentlyViewed() {
    let recent;
    try { recent = JSON.parse(localStorage.getItem('recently_viewed') || '[]'); } catch { recent = []; }
    const section = document.getElementById('recently-viewed-section');
    const list = document.getElementById('recently-viewed-list');
    if (!section || !list || recent.length === 0) return;

    list.innerHTML = '';
    recent.forEach(item => {
        const li = document.createElement('li');
        li.tabIndex = 0;
        li.addEventListener('click', () => { window.location.href = item.href; });
        li.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = item.href; }
        });

        const wrap = document.createElement('div');
        wrap.className = 'card-img-wrap';

        const img = document.createElement('img');
        img.src = item.img;
        img.alt = item.name;
        img.loading = 'lazy';
        img.onerror = () => { img.src = './icon/incheon.png'; img.style.opacity = '0.3'; };

        const overlay = document.createElement('div');
        overlay.className = 'card-overlay';
        overlay.innerHTML = `<span>${item.name} 보기 →</span>`;

        wrap.appendChild(img);
        wrap.appendChild(overlay);

        const info = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = item.name;
        info.appendChild(h3);

        li.appendChild(wrap);
        li.appendChild(info);
        list.appendChild(li);
    });

    section.style.display = 'block';
}

document.getElementById('clear-recent-btn')?.addEventListener('click', () => {
    localStorage.removeItem('recently_viewed');
    const section = document.getElementById('recently-viewed-section');
    if (section) section.style.display = 'none';
});

// 초기화
updateBadge();
updateButtons();
renderRecentlyViewed();

// bfcache 대응: 뒤로가기로 복원된 경우 재렌더링
window.addEventListener('pageshow', e => {
    if (e.persisted) renderRecentlyViewed();
});
