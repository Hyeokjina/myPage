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
        const name = btn.getAttribute('onclick').match(/'([^']+)'\)/)[1];
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
            li.innerHTML = `<span>♥ ${name}</span><button onclick="removeFav('${name}')" title="삭제">✕</button>`;
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
        const items = section.querySelectorAll('.places li, .loding li');
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

// 초기화
updateBadge();
updateButtons();
