const FESTIVALS = [
    // 봄
    {
        name: '인천 자유공원 벚꽃 축제', region: '인천', season: '봄', period: '4월 초~중순',
        category: '자연', emoji: '🌸',
        desc: '자유공원 일대에 만개하는 벚꽃을 즐길 수 있는 봄 축제입니다. 인천항과 항구 전경을 배경으로 펼쳐지는 벚꽃 풍경이 특히 아름다우며, 다양한 공연과 먹거리 행사도 함께 열립니다.',
        loc: '인천 중구 자유공원 일대',
        bannerColor: 'linear-gradient(135deg,#f9a8d4,#ec4899)',
    },
    {
        name: '서울 여의도 벚꽃 축제', region: '서울', season: '봄', period: '4월 초~중순',
        category: '자연', emoji: '🌸',
        desc: '한강 여의도 윤중로에 피어나는 벚꽃 터널이 장관을 이루는 서울 대표 봄 축제입니다. 매년 수십만 명이 방문하며, 한강 유람선 벚꽃 투어도 함께 즐길 수 있습니다.',
        loc: '서울 영등포구 여의도동 윤중로',
        bannerColor: 'linear-gradient(135deg,#fda4af,#f43f5e)',
    },
    {
        name: '경주 보문호 벚꽃 축제', region: '경주', season: '봄', period: '4월 초~중순',
        category: '자연', emoji: '🌸',
        desc: '신라 천년 고도 경주의 보문호수를 둘러싼 벚꽃 산책로가 볼만한 봄 축제입니다. 역사 유적지와 어우러진 벚꽃 풍경이 특별하며, 야간 조명과 함께 즐기는 야경도 아름답습니다.',
        loc: '경북 경주시 보문동 보문호수 일대',
        bannerColor: 'linear-gradient(135deg,#f9a8d4,#a855f7)',
    },
    {
        name: '제주 유채꽃 축제', region: '제주', season: '봄', period: '3월 중순~4월',
        category: '자연', emoji: '🌼',
        desc: '제주 산방산과 성읍민속마을 일대에 펼쳐지는 노란 유채꽃 물결이 장관입니다. 유채꽃밭을 배경으로 사진 찍는 것이 필수 코스이며, 제주 봄 여행의 하이라이트입니다.',
        loc: '제주 서귀포시 안덕면 산방산 일대',
        bannerColor: 'linear-gradient(135deg,#fde68a,#f59e0b)',
    },
    {
        name: '부산 낙동강 유채꽃 축제', region: '부산', season: '봄', period: '4월',
        category: '자연', emoji: '🌻',
        desc: '낙동강 삼각주 일대에 광활하게 펼쳐지는 유채꽃밭이 장관을 이루는 축제입니다. 자전거 대여와 사진 촬영 포인트가 잘 마련되어 있어 가족 나들이로도 제격입니다.',
        loc: '부산 강서구 낙동강 하구 일대',
        bannerColor: 'linear-gradient(135deg,#fef08a,#eab308)',
    },

    // 여름
    {
        name: '인천 펜타포트 락 페스티벌', region: '인천', season: '여름', period: '8월',
        category: '음악', emoji: '🎸',
        desc: '국내 최대 규모의 락 음악 페스티벌로 인천 송도에서 매년 열립니다. 국내외 유명 아티스트들이 참여하며 3일간 다양한 장르의 라이브 공연이 펼쳐집니다.',
        loc: '인천 연수구 송도달빛축제공원',
        bannerColor: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    },
    {
        name: '부산 해운대 모래 축제', region: '부산', season: '여름', period: '5월~6월',
        category: '문화', emoji: '🏖️',
        desc: '해운대 해수욕장에서 열리는 대규모 모래 조각 전시와 해양 문화 축제입니다. 세계 각국 작가들의 대형 모래 조각 작품을 감상하며 해운대 여름 시즌의 시작을 알리는 축제입니다.',
        loc: '부산 해운대구 해운대해변로',
        bannerColor: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
    },
    {
        name: '강원 화천 쪽배 축제', region: '강원', season: '여름', period: '7월~8월',
        category: '자연', emoji: '🛶',
        desc: '화천 토고미 마을에서 열리는 전통 쪽배 타기 체험 축제입니다. 맑고 시원한 강물에서 직접 쪽배를 저어가는 특별한 경험과 함께 다양한 물놀이 프로그램이 마련됩니다.',
        loc: '강원 화천군 화천읍 토고미마을',
        bannerColor: 'linear-gradient(135deg,#34d399,#059669)',
    },
    {
        name: '제주 들불 축제', region: '제주', season: '여름', period: '3월 (초봄·여름 전환)',
        category: '문화', emoji: '🔥',
        desc: '제주 새별오름에서 열리는 전통 목축문화 축제로, 오름에 불을 놓아 해충을 제거하는 전통 행사입니다. 화려한 불꽃의 장관이 연출되며 제주 고유의 문화를 체험할 수 있습니다.',
        loc: '제주 제주시 애월읍 새별오름',
        bannerColor: 'linear-gradient(135deg,#fb923c,#dc2626)',
    },

    // 가을
    {
        name: '부산 국제영화제 BIFF', region: '부산', season: '가을', period: '10월',
        category: '문화', emoji: '🎬',
        desc: '아시아 최대 규모의 국제영화제로 매년 10월 부산에서 열립니다. 전 세계 수백 편의 영화가 상영되며 유명 감독과 배우들이 참여합니다. BIFF 광장의 핸드프린팅도 볼거리입니다.',
        loc: '부산 해운대구 센텀시티 영화의전당',
        bannerColor: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)',
    },
    {
        name: '부산 광안리 불꽃 축제', region: '부산', season: '가을', period: '10월',
        category: '야경', emoji: '🎆',
        desc: '광안대교를 배경으로 펼쳐지는 대한민국 최대 규모의 불꽃 축제입니다. 100만 명 이상이 관람하는 장관으로, 바다 위에서 터지는 화려한 불꽃과 광안대교 야경의 조화가 압도적입니다.',
        loc: '부산 수영구 광안해변로',
        bannerColor: 'linear-gradient(135deg,#f97316,#dc2626)',
    },
    {
        name: '설악산 단풍 축제', region: '강원', season: '가을', period: '10월 초~중순',
        category: '자연', emoji: '🍁',
        desc: '강원도 설악산 국립공원의 단풍은 전국에서 가장 아름다운 단풍 명소 중 하나입니다. 울산바위, 공룡능선, 비선대 등 트레킹 코스마다 붉게 물든 단풍이 절경을 이룹니다.',
        loc: '강원 속초시·인제군 설악산국립공원',
        bannerColor: 'linear-gradient(135deg,#f97316,#b45309)',
    },
    {
        name: '경주 신라문화제', region: '경주', season: '가을', period: '10월',
        category: '문화', emoji: '🏛️',
        desc: '신라 천년의 역사와 문화를 재현하는 경주의 대표 전통 축제입니다. 신라 왕의 행차 재현, 전통 공연, 한복 체험 등 다양한 프로그램과 함께 경주 전역이 축제 분위기에 휩싸입니다.',
        loc: '경북 경주시 보문관광단지 일대',
        bannerColor: 'linear-gradient(135deg,#92400e,#d97706)',
    },
    {
        name: '서울 청계천 빛 축제', region: '서울', season: '가을', period: '11월~1월',
        category: '야경', emoji: '✨',
        desc: '청계천을 따라 펼쳐지는 화려한 빛의 축제입니다. 형형색색의 조명과 미디어 아트가 어우러지며, 연말 분위기를 물씬 풍기는 서울의 대표 겨울 야경 명소로 자리 잡았습니다.',
        loc: '서울 종로구 청계천로 일대',
        bannerColor: 'linear-gradient(135deg,#6366f1,#0ea5e9)',
    },
    {
        name: '인천 소래포구 어시장 축제', region: '인천', season: '가을', period: '10월',
        category: '음식', emoji: '🦐',
        desc: '인천 소래포구의 전통 어시장에서 열리는 가을 축제입니다. 싱싱한 꽃게와 새우, 수산물을 저렴하게 구매하고 다양한 해산물 음식을 맛볼 수 있습니다.',
        loc: '인천 남동구 소래포구 어시장',
        bannerColor: 'linear-gradient(135deg,#0ea5e9,#0f766e)',
    },

    // 겨울
    {
        name: '화천 산천어 축제', region: '강원', season: '겨울', period: '1월',
        category: '자연', emoji: '🐟',
        desc: '강원 화천에서 열리는 세계 4대 겨울 축제 중 하나입니다. 꽁꽁 언 화천천에서 직접 얼음낚시로 산천어를 잡고 맨손 잡기 체험도 할 수 있습니다. 매년 100만 명 이상이 방문합니다.',
        loc: '강원 화천군 화천읍 산천어축제장',
        bannerColor: 'linear-gradient(135deg,#6366f1,#0ea5e9)',
    },
    {
        name: '평창 눈꽃 축제', region: '강원', season: '겨울', period: '1월~2월',
        category: '자연', emoji: '⛷️',
        desc: '2018 평창 동계올림픽 개최지 평창에서 열리는 겨울 스포츠·문화 축제입니다. 스키·스노보드·눈썰매 등 각종 겨울 스포츠와 눈 조각 전시, 전통 썰매 체험을 즐길 수 있습니다.',
        loc: '강원 평창군 대관령면 일대',
        bannerColor: 'linear-gradient(135deg,#818cf8,#38bdf8)',
    },
    {
        name: '서울 크리스마스 마켓', region: '서울', season: '겨울', period: '12월',
        category: '문화', emoji: '🎄',
        desc: '광화문광장과 명동 일대에서 열리는 유럽풍 크리스마스 마켓입니다. 다양한 수공예품과 먹거리 부스가 들어서며 화려한 트리 점등식과 캐럴 공연으로 연말 분위기를 즐길 수 있습니다.',
        loc: '서울 종로구 광화문광장 일대',
        bannerColor: 'linear-gradient(135deg,#dc2626,#16a34a)',
    },
    {
        name: '제주 감귤 축제', region: '제주', season: '겨울', period: '11월~12월',
        category: '음식', emoji: '🍊',
        desc: '제주 특산물인 감귤의 수확을 기념하는 축제입니다. 귤밭에서 직접 귤을 따는 체험과 함께 감귤로 만든 다양한 음식과 음료를 맛볼 수 있습니다. 제주 서귀포 일대 귤밭이 황금빛으로 물드는 시기입니다.',
        loc: '제주 서귀포시 일대',
        bannerColor: 'linear-gradient(135deg,#f97316,#fbbf24)',
    },
    {
        name: '부산 해맞이 축제', region: '부산', season: '겨울', period: '1월 1일',
        category: '자연', emoji: '🌅',
        desc: '새해 첫날 해운대와 광안리 해변에서 열리는 일출 맞이 행사입니다. 동해바다에서 솟아오르는 새해 첫 태양을 바라보며 소망을 빌고, 새해 공연과 불꽃 행사도 함께 진행됩니다.',
        loc: '부산 해운대구 해운대해변로',
        bannerColor: 'linear-gradient(135deg,#7c3aed,#f97316)',
    },
];

let activeSeason = '전체';
let activeRegion = '전체';
let searchQuery = '';

function renderCards() {
    const grid = document.getElementById('fest-grid');
    const empty = document.getElementById('fest-empty');
    const countEl = document.getElementById('fest-count');

    const filtered = FESTIVALS.filter(f => {
        const seasonMatch = activeSeason === '전체' || f.season === activeSeason;
        const regionMatch = activeRegion === '전체' || f.region === activeRegion;
        const q = searchQuery.toLowerCase();
        const searchMatch = !q ||
            f.name.toLowerCase().includes(q) ||
            f.desc.toLowerCase().includes(q) ||
            f.region.toLowerCase().includes(q);
        return seasonMatch && regionMatch && searchMatch;
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
        card.className = 'fest-card reveal';
        card.style.transitionDelay = `${(i % 4) * 0.07}s`;

        card.innerHTML = `
            <div class="fest-card-banner" style="background:${f.bannerColor};">
                <span class="fest-card-emoji">${f.emoji}</span>
                <span class="fest-card-period">${f.period}</span>
            </div>
            <div class="fest-card-body">
                <div class="fest-card-top">
                    <span class="season-badge season-${f.season}">${f.season}</span>
                    <span class="region-badge">${f.region}</span>
                    <span class="cat-badge">${f.category}</span>
                </div>
                <div class="fest-card-name">${f.name}</div>
                <p class="fest-card-desc">${f.desc}</p>
                <div class="fest-card-footer">
                    <span class="fest-card-loc">📍 ${f.loc}</span>
                    <a class="fest-map-btn"
                       href="https://map.kakao.com/?q=${encodeURIComponent(f.name)}"
                       target="_blank" rel="noopener noreferrer">🗺️ 지도</a>
                </div>
            </div>`;

        grid.appendChild(card);
    });

    grid.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

// 계절 탭
document.getElementById('season-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.stab');
    if (!tab) return;
    document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeSeason = tab.dataset.season;
    renderCards();
});

// 지역 필터
document.getElementById('region-filter').addEventListener('click', e => {
    const pill = e.target.closest('.fpill');
    if (!pill) return;
    document.querySelectorAll('#region-filter .fpill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeRegion = pill.dataset.region;
    renderCards();
});

// 검색
const searchInput = document.getElementById('fest-search');
const clearBtn = document.getElementById('fest-search-clear');

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
