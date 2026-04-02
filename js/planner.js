const STORAGE_KEY = 'travel_schedules';

function getSchedules() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveSchedules(schedules) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

document.getElementById('schedule-form').addEventListener('submit', e => {
  e.preventDefault();

  const schedule = {
    id: Date.now(),
    date: document.getElementById('s-date').value,
    time: document.getElementById('s-time').value,
    place: document.getElementById('s-place').value.trim(),
    memo: document.getElementById('s-memo').value.trim()
  };

  const schedules = getSchedules();
  schedules.push(schedule);
  schedules.sort((a, b) => {
    const da = a.date + (a.time || '00:00');
    const db = b.date + (b.time || '00:00');
    return da.localeCompare(db);
  });
  saveSchedules(schedules);

  renderList();
  e.target.reset();
});

function renderList() {
  const schedules = getSchedules();
  const list = document.getElementById('schedule-list');
  const emptyMsg = document.getElementById('empty-msg');
  const countEl = document.getElementById('schedule-count');

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
    li.className = 'schedule-card reveal';
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

    li.appendChild(dateBlock);
    li.appendChild(divider);
    li.appendChild(info);

    list.appendChild(li);
  });
}

renderList();
