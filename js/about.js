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
    }
};

function openDetail(key) {
    const d = details[key];
    document.getElementById('detail-img').src = d.img;
    document.getElementById('detail-img').alt = d.title;
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
