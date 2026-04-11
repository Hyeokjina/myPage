const FAV_KEY = 'incheon_favorites';

function getFavs() {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
}

function saveFavs(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
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
}

function removeFav(name) {
    saveFavs(getFavs().filter(f => f !== name));
    updateBadge();
    updateButtons();
    openFavModal();
}

function closeFavModal() {
    document.getElementById('fav-modal').classList.remove('open');
}

function closeFavModalOutside(event) {
    if (event.target === document.getElementById('fav-modal')) closeFavModal();
}

function searchPlaces() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    document.querySelectorAll('.container[id]').forEach(section => {
        const items = section.querySelectorAll('.places li, .lodging li');
        if (!items.length) return;
        let anyVisible = false;
        items.forEach(li => {
            const name = li.querySelector('h3')?.textContent?.toLowerCase()
                || li.querySelector('img')?.alt?.toLowerCase() || '';
            const visible = !query || name.includes(query);
            li.style.display = visible ? '' : 'none';
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
});

document.querySelector('.fav-count')?.addEventListener('click', openFavModal);
document.querySelector('.modal-close')?.addEventListener('click', closeFavModal);
document.getElementById('fav-modal')?.addEventListener('click', closeFavModalOutside);

document.querySelector('.hero-btn')?.addEventListener('click', () => { window.location.href = '#places'; });

document.getElementById('search-input')?.addEventListener('input', searchPlaces);
document.getElementById('search-btn')?.addEventListener('click', searchPlaces);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('fav-modal').classList.contains('open')) {
        closeFavModal();
    }
});

// 초기화
updateBadge();
updateButtons();
