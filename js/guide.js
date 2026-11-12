// 사이드 목차 스크롤 스파이는 common.js의 공통 함수를 그대로 사용
initScrollSpy();

// 여행 예산 계산기 — 총 예산을 입력하면 항목별(숙박/식비/교통/기타) 예상 금액을 실시간 계산
// 비율(data-budget-min/max)은 HTML에 한 번만 적어두고 여기서 읽어서 쓴다 (숫자 중복 방지)
(function initBudgetCalculator() {
    const input = document.getElementById('budget-total');
    const resetBtn = document.getElementById('budget-reset-btn');
    if (!input) return;

    const items = document.querySelectorAll('#guide-budget .course-item[data-budget-min]');

    // 비중 막대는 입력값과 무관하게 "보통 이 정도 비중" 참고용이라 페이지 로드 시 한 번만 채워둠
    items.forEach(item => {
        const min = Number(item.dataset.budgetMin);
        const max = Number(item.dataset.budgetMax);
        const fill = item.querySelector('.budget-bar-fill');
        if (fill) fill.style.width = `${(min + max) / 2}%`;
    });

    function formatWon(n) {
        return Math.round(n).toLocaleString('ko-KR') + '원';
    }

    function update() {
        const total = Number(input.value);
        const amountEls = document.querySelectorAll('.budget-amount');
        resetBtn.style.display = input.value ? 'block' : 'none';

        if (!input.value || !Number.isFinite(total) || total <= 0) {
            amountEls.forEach(el => { el.textContent = ''; });
            return;
        }

        items.forEach(item => {
            const min = Number(item.dataset.budgetMin);
            const max = Number(item.dataset.budgetMax);
            const amountEl = item.querySelector('.budget-amount');
            if (!amountEl) return;
            amountEl.textContent = `약 ${formatWon(total * min / 100)} ~ ${formatWon(total * max / 100)}`;
        });
    }

    input.addEventListener('input', update);
    resetBtn?.addEventListener('click', () => {
        input.value = '';
        update();
        input.focus();
    });
})();
