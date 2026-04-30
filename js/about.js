const details = {
    town: {
        title: '차이나타운',
        img: './images/town.png',
        desc: '인천 차이나타운은 1883년 인천항 개항 이후 형성된 한국 유일의 차이나타운입니다. 화려한 패루(중국식 문)와 붉은 건물들이 이국적인 분위기를 자아내며, 짜장면 발상지로도 유명합니다.',
        info: ['📍 위치: 인천 중구 차이나타운로', '🕐 운영: 연중무휴', '🍜 추천: 짜장면, 공갈빵, 월병']
    },
    songdo: {
        title: '송도 센트럴파크',
        img: './images/songdo.png',
        desc: '송도 센트럴파크는 인천 송도국제도시 한복판에 위치한 대형 수변공원입니다. 해수를 이용한 수로에서 카약과 보트를 즐길 수 있으며, 야경이 특히 아름다워 데이트 명소로 인기입니다.',
        info: ['📍 위치: 인천 연수구 센트럴로 160', '🕐 운영: 연중무휴 24시간', '🚤 추천: 카약, 자전거, 야경 산책']
    },
    wolmido: {
        title: '월미도',
        img: './images/wolmido.png',
        desc: '월미도는 인천항 앞바다에 위치한 섬으로, 놀이공원과 문화의 거리, 선착장이 어우러진 복합 관광지입니다. 인천상륙작전의 역사적 현장이기도 하며, 바다를 배경으로 다양한 즐길 거리가 가득합니다.',
        info: ['📍 위치: 인천 중구 월미로 303', '🕐 운영: 10:00 ~ 22:00', '🎡 추천: 디스코팡팡, 씨사이드 산책로, 횟집']
    },
    ganghwa: {
        title: '강화도',
        img: '',
        desc: '강화도는 인천 서쪽에 위치한 섬으로, 고인돌 유네스코 세계문화유산·고려 대몽항쟁·병인양요 등 유서 깊은 역사를 품고 있습니다. 전등사·마니산 참성단 등 문화재와 함께 넓은 갯벌, 아름다운 낙조로도 유명한 사계절 여행지입니다.',
        info: ['📍 위치: 인천 강화군 (강화대교 이용)', '🏛️ 추천: 고인돌 공원, 전등사, 마니산', '🌅 베스트: 동막해변 낙조, 갯벌 체험', '🚌 교통: 인천 강화 버스터미널 이용']
    },
    gaehang: {
        title: '개항장 문화지구',
        img: '',
        desc: '1883년 개항 당시의 근대 건축물이 고스란히 남아있는 인천 중구 일대입니다. 일본 제1은행 지점(현 인천개항박물관), 일본 제18은행 지점, 중국 영사관 등 각국의 건물이 한 거리에 공존하는 세계적으로도 드문 근대 역사 거리입니다.',
        info: ['📍 위치: 인천 중구 신포동·중구청 일대', '🕐 운영: 연중무휴 (박물관 09:00~18:00)', '🏛️ 추천: 인천개항박물관, 근대건축전시관', '🚇 교통: 수인분당선 신포역 5번 출구']
    },
    eulwang: {
        title: '을왕리 해수욕장',
        img: '',
        desc: '영종도 서쪽에 위치한 서해안 대표 해변으로, 완만한 수심과 고운 모래사장이 특징입니다. 황금빛 낙조가 특히 아름다워 일몰 명소로 유명하며, 해변 주변 조개구이 식당들이 즐비해 미식 여행지로도 인기가 높습니다.',
        info: ['📍 위치: 인천 중구 을왕동 (영종도)', '🏖️ 운영: 상시 개방, 해수욕 7~8월', '🌅 추천: 낙조 감상, 조개구이', '🚌 교통: 인천공항에서 버스 20분']
    }
};

function openDetail(key) {
    const d = details[key];
    const imgEl = document.getElementById('detail-img');
    if (d.img) {
        imgEl.src = d.img;
        imgEl.alt = d.title;
        imgEl.style.display = '';
    } else {
        imgEl.style.display = 'none';
    }
    document.getElementById('detail-title').textContent = d.title;
    document.getElementById('detail-desc').textContent = d.desc;
    const infoEl = document.getElementById('detail-info');
    infoEl.textContent = '';
    d.info.forEach(i => {
        const span = document.createElement('span');
        span.textContent = i;
        infoEl.appendChild(span);
    });
    const overlay = document.getElementById('detail-overlay');
    overlay.classList.add('open');
    trapFocus(overlay);
}

function closeDetail() {
    const overlay = document.getElementById('detail-overlay');
    overlay.classList.remove('open');
    releaseFocus(overlay);
}

function closeDetailOutside(e) {
    if (e.target === document.getElementById('detail-overlay')) closeDetail();
}

document.querySelectorAll('[data-detail]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        openDetail(link.dataset.detail);
    });
});
document.getElementById('detail-overlay')?.addEventListener('click', closeDetailOutside);
document.querySelector('.detail-close')?.addEventListener('click', closeDetail);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDetail();
});

// 스크롤 스파이
(function () {
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
})();
