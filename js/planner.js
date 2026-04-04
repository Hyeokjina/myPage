const PLANS_KEY = 'travel_plans';
const SCHEDULES_KEY = 'travel_schedules';

// ── 플랜 관리 ──────────────────────────────────────

function getPlans() {
  return JSON.parse(localStorage.getItem(PLANS_KEY) || '[]');
}

function savePlans(plans) {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

function getActivePlanId() {
  return localStorage.getItem('active_plan_id') || null;
}

function setActivePlanId(id) {
  localStorage.setItem('active_plan_id', id);
}

// 모달 열기/닫기
function openPlanModal() {
  document.getElementById('plan-modal').classList.add('open');
  document.getElementById('p-name').focus();
}

function closePlanModal() {
  document.getElementById('plan-modal').classList.remove('open');
  document.getElementById('plan-form').reset();
}

function closePlanModalOutside(e) {
  if (e.target === document.getElementById('plan-modal')) closePlanModal();
}

// 플랜 생성
document.getElementById('plan-form').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('p-name').value.trim();
  const start = document.getElementById('p-start').value;
  const end = document.getElementById('p-end').value;

  if (start > end) {
    alert('종료일은 시작일 이후여야 합니다.');
    return;
  }

  const plan = { id: Date.now(), name, start, end };
  const plans = getPlans();
  plans.push(plan);
  savePlans(plans);

  closePlanModal();
  renderPlanList();
  selectPlan(plan.id);
});

// 플랜 선택
function selectPlan(id) {
  setActivePlanId(id);
  renderPlanList();
  renderScheduleList();

  document.getElementById('schedule-section').style.display = 'block';
  document.getElementById('list-section').style.display = 'block';
}

// 플랜 목록 렌더링
function renderPlanList() {
  const plans = getPlans();
  const list = document.getElementById('plan-list');
  const emptyMsg = document.getElementById('plan-empty-msg');
  const activePlanId = getActivePlanId();

  list.innerHTML = '';

  if (plans.length === 0) {
    emptyMsg.style.display = 'block';
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('list-section').style.display = 'none';
    return;
  }
  emptyMsg.style.display = 'none';

  plans.forEach(plan => {
    const li = document.createElement('li');
    li.className = 'plan-card' + (String(plan.id) === String(activePlanId) ? ' active' : '');
    li.addEventListener('click', () => selectPlan(plan.id));

    const icon = document.createElement('div');
    icon.className = 'plan-icon';
    icon.textContent = '✈️';

    const info = document.createElement('div');
    info.className = 'plan-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'plan-name';
    nameEl.textContent = plan.name;

    const periodEl = document.createElement('div');
    periodEl.className = 'plan-period';
    periodEl.textContent = `${plan.start} ~ ${plan.end}`;

    info.appendChild(nameEl);
    info.appendChild(periodEl);
    li.appendChild(icon);
    li.appendChild(info);
    list.appendChild(li);
  });
}

// ── 일정 관리 ──────────────────────────────────────

function getSchedules() {
  const all = JSON.parse(localStorage.getItem(SCHEDULES_KEY) || '{}');
  const id = getActivePlanId();
  return id ? (all[id] || []) : [];
}

function saveSchedules(schedules) {
  const all = JSON.parse(localStorage.getItem(SCHEDULES_KEY) || '{}');
  const id = getActivePlanId();
  if (!id) return;
  all[id] = schedules;
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(all));
}

document.getElementById('schedule-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!getActivePlanId()) return;

  const schedule = {
    id: Date.now(),
    date: document.getElementById('s-date').value,
    time: document.getElementById('s-time').value,
    place: document.getElementById('s-place').value.trim(),
    memo: document.getElementById('s-memo').value.trim(),
    done: false
  };

  const schedules = getSchedules();
  schedules.push(schedule);
  schedules.sort((a, b) => {
    const da = a.date + (a.time || '00:00');
    const db = b.date + (b.time || '00:00');
    return da.localeCompare(db);
  });
  saveSchedules(schedules);

  renderScheduleList();
  e.target.reset();
});

function toggleDone(id) {
  const schedules = getSchedules().map(s =>
    s.id === id ? { ...s, done: !s.done } : s
  );
  saveSchedules(schedules);
  renderScheduleList();
}

function deleteSchedule(id) {
  saveSchedules(getSchedules().filter(s => s.id !== id));
  renderScheduleList();
}

function renderScheduleList() {
  const schedules = getSchedules();
  const list = document.getElementById('schedule-list');
  const emptyMsg = document.getElementById('empty-msg');
  const countEl = document.getElementById('schedule-count');

  // 현재 플랜명을 섹션 제목에 반영
  const activePlanId = getActivePlanId();
  const plan = getPlans().find(p => String(p.id) === String(activePlanId));
  if (plan) {
    document.querySelector('#schedule-section h2').textContent = `${plan.name} — 일정 추가`;
    countEl.closest('h2').firstChild.textContent = `${plan.name} 일정 `;
  }

  list.innerHTML = '';
  countEl.textContent = schedules.length;

  if (schedules.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  schedules.forEach(s => {
    const dateObj = new Date(s.date + 'T00:00:00');
    const month = dateObj.toLocaleString('ko-KR', { month: 'short' });
    const day = dateObj.getDate();

    const li = document.createElement('li');
    li.className = 'schedule-card reveal' + (s.done ? ' done' : '');
    li.dataset.id = s.id;

    const dateBlock = document.createElement('div');
    dateBlock.className = 's-date-block';

    const monthEl = document.createElement('div');
    monthEl.className = 's-month';
    monthEl.textContent = month;

    const dayEl = document.createElement('div');
    dayEl.className = 's-day';
    dayEl.textContent = day;

    dateBlock.appendChild(monthEl);
    dateBlock.appendChild(dayEl);

    const divider = document.createElement('div');
    divider.className = 's-divider';

    const info = document.createElement('div');
    info.className = 's-info';

    const placeEl = document.createElement('div');
    placeEl.className = 's-place';
    placeEl.textContent = s.place;
    info.appendChild(placeEl);

    if (s.time) {
      const timeEl = document.createElement('div');
      timeEl.className = 's-time';
      timeEl.textContent = s.time;
      info.appendChild(timeEl);
    }

    if (s.memo) {
      const memoEl = document.createElement('div');
      memoEl.className = 's-memo';
      memoEl.textContent = s.memo;
      info.appendChild(memoEl);
    }

    const actions = document.createElement('div');
    actions.className = 's-actions';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'check-btn' + (s.done ? ' checked' : '');
    checkBtn.textContent = s.done ? '✓' : '○';
    checkBtn.setAttribute('aria-label', '완료 토글');
    checkBtn.addEventListener('click', () => toggleDone(s.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', '일정 삭제');
    delBtn.addEventListener('click', () => deleteSchedule(s.id));

    actions.appendChild(checkBtn);
    actions.appendChild(delBtn);

    li.appendChild(dateBlock);
    li.appendChild(divider);
    li.appendChild(info);
    li.appendChild(actions);

    list.appendChild(li);
  });
}

// ── 초기화 ─────────────────────────────────────────

renderPlanList();

// 마지막으로 선택했던 플랜 복원
const savedPlanId = getActivePlanId();
if (savedPlanId && getPlans().some(p => String(p.id) === String(savedPlanId))) {
  selectPlan(savedPlanId);
}
