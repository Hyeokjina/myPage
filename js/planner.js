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

// 플랜 삭제
function deletePlan(id) {
  if (!confirm('플랜을 삭제하면 해당 일정도 모두 삭제됩니다. 계속할까요?')) return;

  const plans = getPlans().filter(p => String(p.id) !== String(id));
  savePlans(plans);

  // 해당 플랜 일정 삭제
  const all = JSON.parse(localStorage.getItem(SCHEDULES_KEY) || '{}');
  delete all[id];
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(all));

  // 활성 플랜이 삭제된 경우 초기화
  if (String(getActivePlanId()) === String(id)) {
    localStorage.removeItem('active_plan_id');
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('list-section').style.display = 'none';
  }

  renderPlanList();
}

// 플랜 수정 모달
function openRenameModal(plan) {
  document.getElementById('r-id').value = plan.id;
  document.getElementById('r-name').value = plan.name;
  document.getElementById('r-start').value = plan.start;
  document.getElementById('r-end').value = plan.end;
  document.getElementById('rename-modal').classList.add('open');
}

function closeRenameModal() {
  document.getElementById('rename-modal').classList.remove('open');
  document.getElementById('rename-form').reset();
}

function closeRenameModalOutside(e) {
  if (e.target === document.getElementById('rename-modal')) closeRenameModal();
}

document.getElementById('rename-form').addEventListener('submit', e => {
  e.preventDefault();

  const id = Number(document.getElementById('r-id').value);
  const name = document.getElementById('r-name').value.trim();
  const start = document.getElementById('r-start').value;
  const end = document.getElementById('r-end').value;

  if (start > end) {
    alert('종료일은 시작일 이후여야 합니다.');
    return;
  }

  const plans = getPlans().map(p =>
    p.id === id ? { ...p, name, start, end } : p
  );
  savePlans(plans);
  closeRenameModal();
  renderPlanList();

  if (String(getActivePlanId()) === String(id)) renderScheduleList();
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

    // 진행률 계산
    const allSchedules = JSON.parse(localStorage.getItem(SCHEDULES_KEY) || '{}');
    const planSchedules = allSchedules[plan.id] || [];
    const total = planSchedules.length;
    const done = planSchedules.filter(s => s.done).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    const progressWrap = document.createElement('div');
    progressWrap.className = 'plan-progress-wrap';

    const bar = document.createElement('div');
    bar.className = 'plan-progress-bar';

    const fill = document.createElement('div');
    fill.className = 'plan-progress-fill';
    fill.style.width = pct + '%';

    const label = document.createElement('span');
    label.className = 'plan-progress-label' + (total > 0 && done === total ? ' done-all' : '');
    label.textContent = total === 0 ? '일정 없음' : (done === total ? '완료!' : `${done}/${total}`);

    bar.appendChild(fill);
    progressWrap.appendChild(bar);
    progressWrap.appendChild(label);

    info.appendChild(nameEl);
    info.appendChild(periodEl);
    info.appendChild(progressWrap);

    const planActions = document.createElement('div');
    planActions.className = 'plan-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'plan-edit-btn';
    editBtn.textContent = '✏️';
    editBtn.setAttribute('aria-label', '플랜 수정');
    editBtn.addEventListener('click', ev => {
      ev.stopPropagation();
      openRenameModal(plan);
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'plan-del-btn';
    delBtn.textContent = '🗑️';
    delBtn.setAttribute('aria-label', '플랜 삭제');
    delBtn.addEventListener('click', ev => {
      ev.stopPropagation();
      deletePlan(plan.id);
    });

    planActions.appendChild(editBtn);
    planActions.appendChild(delBtn);

    li.appendChild(icon);
    li.appendChild(info);
    li.appendChild(planActions);
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
  renderPlanList();
  e.target.reset();
});

// 일정 수정 모달 열기/닫기
function openEditModal(schedule) {
  document.getElementById('e-id').value = schedule.id;
  document.getElementById('e-date').value = schedule.date;
  document.getElementById('e-time').value = schedule.time || '';
  document.getElementById('e-place').value = schedule.place;
  document.getElementById('e-memo').value = schedule.memo || '';
  document.getElementById('e-warn').style.display = 'none';
  document.getElementById('edit-modal').classList.add('open');
  document.getElementById('e-place').focus();
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('open');
  document.getElementById('edit-form').reset();
}

function closeEditModalOutside(e) {
  if (e.target === document.getElementById('edit-modal')) closeEditModal();
}

// 일정 수정 저장
document.getElementById('edit-form').addEventListener('submit', e => {
  e.preventDefault();

  const id = Number(document.getElementById('e-id').value);
  const date = document.getElementById('e-date').value;
  const time = document.getElementById('e-time').value;
  const place = document.getElementById('e-place').value.trim();
  const memo = document.getElementById('e-memo').value.trim();

  const schedules = getSchedules().map(s =>
    s.id === id ? { ...s, date, time, place, memo } : s
  );
  schedules.sort((a, b) => {
    const da = a.date + (a.time || '00:00');
    const db = b.date + (b.time || '00:00');
    return da.localeCompare(db);
  });
  saveSchedules(schedules);

  closeEditModal();
  renderScheduleList();
  renderPlanList();
});

function toggleDone(id) {
  const schedules = getSchedules().map(s =>
    s.id === id ? { ...s, done: !s.done } : s
  );
  saveSchedules(schedules);
  renderScheduleList();
  renderPlanList();
}

function deleteSchedule(id) {
  saveSchedules(getSchedules().filter(s => s.id !== id));
  renderScheduleList();
  renderPlanList();
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

    // 카드 클릭 → 수정 모달 (버튼 클릭은 제외)
    li.addEventListener('click', ev => {
      if (ev.target.closest('.s-actions')) return;
      openEditModal(s);
    });

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
