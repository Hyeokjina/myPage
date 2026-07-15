const FOODS = [
    // 인천
    { name: '공화춘', region: '인천', category: '중식', menu: '짜장면, 짬뽕', desc: '1905년 개업한 국내 최초의 중화요리 전문점으로, 짜장면 발상지로 알려진 역사적인 식당입니다. 차이나타운 한복판에 위치하며 현재는 짜장면 박물관으로 운영됩니다.', loc: '인천 중구 차이나타운로 56-14', emoji: '🥢' },
    { name: '신포닭강정', region: '인천', category: '분식', menu: '닭강정, 순대', desc: '인천 신포시장의 명물 닭강정입니다. 달콤하고 매콤한 양념이 바삭한 튀김닭에 코팅된 독특한 맛으로 전국적으로 유명해졌습니다.', loc: '인천 중구 신포로 27번길', emoji: '🍗' },
    { name: '연안부두 회센터', region: '인천', category: '해산물', menu: '광어회, 조개구이, 꽃게탕', desc: '인천 연안부두에서 갓 잡아 올린 싱싱한 해산물을 즐길 수 있는 곳입니다. 조개구이와 꽃게탕이 특히 인기 있으며 항구의 분위기도 매력적입니다.', loc: '인천 중구 연안부두로 일대', emoji: '🦀' },
    { name: '월미도 조개구이', region: '인천', category: '해산물', menu: '바지락구이, 가리비, 키조개', desc: '월미도 해안가에 늘어선 조개구이 식당들로, 신선한 조개를 숯불에 구워 먹는 맛이 일품입니다. 바다 전망과 함께 즐기는 해산물이 특별합니다.', loc: '인천 중구 월미로 일대', emoji: '🐚' },
    { name: '차이나타운 공갈빵', region: '인천', category: '디저트', menu: '공갈빵, 월병', desc: '차이나타운을 걷다 보면 꼭 만나게 되는 명물 공갈빵입니다. 속이 텅 빈 바삭한 빵으로 겉은 바삭하고 달콤합니다. 월병도 함께 구매하는 필수 코스입니다.', loc: '인천 중구 차이나타운로 일대', emoji: '🥮' },

    // 서울
    { name: '광장시장 마약김밥', region: '서울', category: '분식', menu: '마약김밥, 빈대떡, 육회', desc: '서울 광장시장의 대표 먹거리로, 깨소금과 간장에 찍어 먹는 작은 김밥이 중독적인 맛을 냅니다. 빈대떡과 육회도 광장시장의 명물입니다.', loc: '서울 종로구 창경궁로 88', emoji: '🍱' },
    { name: '명동교자', region: '서울', category: '한식', menu: '칼국수, 교자만두', desc: '1960년대부터 이어온 명동의 전통 칼국수 전문점입니다. 구수하고 진한 국물의 칼국수와 바삭한 군만두로 유명하며 항상 긴 줄이 늘어서 있습니다.', loc: '서울 중구 명동10길 29', emoji: '🍜' },
    { name: '인사동 쌈지길 전통과자', region: '서울', category: '디저트', menu: '한과, 약과, 전통차', desc: '인사동 쌈지길 안에 자리한 전통 한과와 약과 가게입니다. 조청을 입힌 약과와 각종 한과를 선물용으로도 구매할 수 있습니다.', loc: '서울 종로구 인사동길 44', emoji: '🍡' },
    { name: '홍대 연남동 쌀국수', region: '서울', category: '한식', menu: '쌀국수, 분짜', desc: '연남동 골목에 자리한 베트남 쌀국수 맛집입니다. 깊고 진한 육수와 신선한 숙주, 허브가 어우러진 정통 쌀국수를 합리적인 가격에 즐길 수 있습니다.', loc: '서울 마포구 연남동 일대', emoji: '🍲' },

    // 부산
    { name: '해운대 암소갈비집', region: '부산', category: '한식', menu: '소갈비, 갈비탕', desc: '해운대에서 오랜 역사를 자랑하는 갈비 전문점입니다. 두툼하게 자른 소갈비를 숯불에 구워 먹는 맛이 일품이며, 진한 갈비탕도 인기 메뉴입니다.', loc: '부산 해운대구 중동 일대', emoji: '🥩' },
    { name: '자갈치시장 활어회', region: '부산', category: '해산물', menu: '광어, 우럭, 멍게, 해삼', desc: '부산 자갈치시장에서 갓 잡은 활어를 저렴하게 즐길 수 있습니다. 시장 2층 식당가에서 직접 고른 생선을 즉석에서 회로 맛보는 특별한 경험입니다.', loc: '부산 중구 자갈치해안로 52', emoji: '🐟' },
    { name: 'BIFF광장 씨앗호떡', region: '부산', category: '분식', menu: '씨앗호떡', desc: 'BIFF 광장 일대에서 판매하는 부산의 대표 길거리 음식입니다. 해바라기씨, 땅콩 등 견과류를 꿀과 함께 넣어 달콤하고 고소한 맛이 납니다.', loc: '부산 중구 BIFF광장로 일대', emoji: '🥞' },
    { name: '감천문화마을 카페', region: '부산', category: '디저트', menu: '인절미 라떼, 전통 음료', desc: '감천문화마을 골목골목에 자리한 아기자기한 카페들입니다. 마을 구경 후 파스텔 색 건물을 배경으로 전통 음료와 디저트를 즐기는 것이 필수 코스입니다.', loc: '부산 사하구 감내2로 일대', emoji: '☕' },

    // 제주
    { name: '흑돼지 전문점', region: '제주', category: '한식', menu: '흑돼지 삼겹살, 오겹살', desc: '제주 특산물인 흑돼지는 일반 돼지보다 육질이 쫄깃하고 풍미가 깊습니다. 숯불에 구워 먹는 흑돼지는 제주 여행의 절대 필수 식사입니다.', loc: '제주시 연동, 노형동 일대', emoji: '🐷' },
    { name: '우도 땅콩 아이스크림', region: '제주', category: '디저트', menu: '땅콩 아이스크림, 땅콩 라떼', desc: '우도의 특산물인 땅콩으로 만든 아이스크림입니다. 고소하고 진한 땅콩향이 특징이며 우도를 방문한다면 반드시 먹어봐야 할 명물입니다.', loc: '제주 제주시 우도면 일대', emoji: '🍦' },
    { name: '성산 해녀의집', region: '제주', category: '해산물', menu: '전복죽, 해산물 물회, 성게국', desc: '성산일출봉 인근에서 해녀가 직접 잡아 올린 신선한 해산물을 맛볼 수 있습니다. 성게알이 듬뿍 들어간 성게국과 전복죽이 대표 메뉴입니다.', loc: '제주 서귀포시 성산읍 일대', emoji: '🐙' },
    { name: '협재 수제버거', region: '제주', category: '한식', menu: '흑돼지 버거, 제주 새우버거', desc: '협재해수욕장 인근에 자리한 수제버거 카페입니다. 제주산 흑돼지 패티와 싱싱한 새우를 사용한 버거로 해변 뷰와 함께 즐길 수 있습니다.', loc: '제주 제주시 한림읍 협재리', emoji: '🍔' },

    // 강원
    { name: '춘천 닭갈비골목', region: '강원', category: '한식', menu: '닭갈비, 막국수', desc: '춘천을 대표하는 음식인 닭갈비를 즐길 수 있는 골목입니다. 철판에 닭고기와 채소, 떡, 고추장 양념을 함께 볶아 먹는 맛이 일품이며, 식사 후 막국수로 마무리합니다.', loc: '강원 춘천시 낙원동 닭갈비골목', emoji: '🍳' },
    { name: '강릉 순두부마을', region: '강원', category: '한식', menu: '초당 순두부, 두부구이', desc: '강릉 초당동은 바닷물로 만드는 독특한 순두부로 유명합니다. 부드럽고 고소한 초당 순두부는 강릉 여행에서 빠질 수 없는 식사입니다.', loc: '강원 강릉시 초당동 순두부마을', emoji: '🍚' },
    { name: '정동진 대게집', region: '강원', category: '해산물', menu: '대게, 킹크랩', desc: '동해안의 신선한 대게를 정동진에서 즐길 수 있습니다. 일출 명소로 유명한 정동진에서 바다를 바라보며 먹는 대게는 특별한 추억을 선사합니다.', loc: '강원 강릉시 강동면 정동진리', emoji: '🦀' },

    // 경주
    { name: '황남빵 본점', region: '경주', category: '디저트', menu: '황남빵, 경주빵', desc: '1939년부터 이어온 경주의 대표 명과입니다. 팥소가 가득 들어간 부드러운 빵으로, 경주 여행 기념품으로도 인기가 높습니다.', loc: '경북 경주시 태종로 783', emoji: '🍞' },
    { name: '교동 쌈밥집', region: '경주', category: '한식', menu: '쌈밥, 된장찌개, 비빔밥', desc: '경주 교동 한옥마을 인근의 전통 쌈밥 식당입니다. 갓 지은 쌀밥과 신선한 제철 채소 쌈이 푸짐하게 나오며, 된장찌개와 함께 즐기는 정갈한 한 끼입니다.', loc: '경북 경주시 교동 일대', emoji: '🥗' },
    { name: '동궁원 한정식', region: '경주', category: '한식', menu: '경주 한정식, 연잎밥', desc: '동궁과 월지 인근에 자리한 전통 한정식 식당입니다. 경주의 역사적 분위기와 어울리는 정갈한 한정식과 연잎밥으로 제대로 된 경주의 맛을 경험할 수 있습니다.', loc: '경북 경주시 원화로 일대', emoji: '🍱' },
];

const BANNER_COLORS = {
    '중식': 'linear-gradient(135deg,#dc2626,#b91c1c)',
    '한식': 'linear-gradient(135deg,#16a34a,#15803d)',
    '해산물': 'linear-gradient(135deg,#0ea5e9,#0284c7)',
    '분식': 'linear-gradient(135deg,#f59e0b,#d97706)',
    '디저트': 'linear-gradient(135deg,#ec4899,#db2777)',
};

let activeRegion = '전체';
let activeCategory = '전체';
let searchQuery = '';

function renderCards() {
    const grid = document.getElementById('food-grid');
    const empty = document.getElementById('food-empty');
    const countEl = document.getElementById('food-count');

    const filtered = FOODS.filter(f => {
        const regionMatch = activeRegion === '전체' || f.region === activeRegion;
        const catMatch = activeCategory === '전체' || f.category === activeCategory;
        const q = searchQuery.toLowerCase();
        const searchMatch = !q ||
            f.name.toLowerCase().includes(q) ||
            f.menu.toLowerCase().includes(q) ||
            f.desc.toLowerCase().includes(q) ||
            f.region.toLowerCase().includes(q) ||
            f.category.toLowerCase().includes(q);
        return regionMatch && catMatch && searchMatch;
    });

    countEl.textContent = filtered.length;
    grid.innerHTML = '';

    if (filtered.length === 0) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    filtered.forEach((f, i) => {
        const card = document.createElement('div');
        card.className = 'food-card reveal';
        card.style.transitionDelay = `${(i % 4) * 0.07}s`;

        const bannerBg = BANNER_COLORS[f.category] || 'linear-gradient(135deg,#6b7280,#4b5563)';

        card.innerHTML = `
            <div class="food-card-banner" style="background:${bannerBg};">
                ${f.emoji}
            </div>
            <div class="food-card-body">
                <div class="food-card-top">
                    <span class="food-region-badge">${f.region}</span>
                    <span class="food-cat-badge">${f.category}</span>
                </div>
                <div class="food-card-name">${f.name}</div>
                <div class="food-card-menu">대표 메뉴: ${f.menu}</div>
                <p class="food-card-desc">${f.desc}</p>
                <div class="food-card-footer">
                    <span class="food-card-loc">📍 ${f.loc}</span>
                    <a class="food-map-btn"
                       href="https://map.kakao.com/?q=${encodeURIComponent(f.name + ' ' + f.region)}"
                       target="_blank" rel="noopener noreferrer">🗺️ 지도</a>
                </div>
            </div>`;

        grid.appendChild(card);
    });

    // 스크롤 애니메이션 재적용
    grid.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

// 필터 이벤트
document.getElementById('region-filter').addEventListener('click', e => {
    const pill = e.target.closest('.fpill');
    if (!pill) return;
    document.querySelectorAll('#region-filter .fpill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeRegion = pill.dataset.region;
    renderCards();
});

document.getElementById('category-filter').addEventListener('click', e => {
    const pill = e.target.closest('.fpill');
    if (!pill) return;
    document.querySelectorAll('#category-filter .fpill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.category;
    renderCards();
});

// 검색 이벤트
const searchInput = document.getElementById('food-search');
const clearBtn = document.getElementById('food-search-clear');

searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    clearBtn.style.display = searchQuery ? 'block' : 'none';
    renderCards();
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
    renderCards();
});

renderCards();
