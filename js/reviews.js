const STORAGE_KEY = 'travel_reviews';
const PAGE_SIZE = 5;
let currentPage = 1;

function getReviews() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    showToast('저장 공간이 부족합니다. 일부 데이터를 삭제해주세요.');
  }
}

// 별점 UI
const starSpans = document.querySelectorAll('#star-input span');
const ratingInput = document.getElementById('rating');

starSpans.forEach(span => {
  span.addEventListener('mouseover', () => highlightStars(+span.dataset.val));
  span.addEventListener('mouseout', () => highlightStars(+ratingInput.value));
  span.addEventListener('click', () => {
    ratingInput.value = span.dataset.val;
    highlightStars(+span.dataset.val);
  });
});

function highlightStars(val) {
  starSpans.forEach(s => {
    s.classList.toggle('on', +s.dataset.val <= val);
  });
}

// 폼 제출
document.getElementById('review-form').addEventListener('submit', e => {
  e.preventDefault();

  const rating = +ratingInput.value;
  const starWarn = document.getElementById('star-warn');
  if (rating === 0) {
    starWarn.style.display = 'block';
    return;
  }
  starWarn.style.display = 'none';

  const review = {
    id: Date.now(),
    nickname: document.getElementById('nickname').value.trim() || '익명',
    region: document.getElementById('region').value,
    rating,
    title: document.getElementById('title').value.trim(),
    content: document.getElementById('content').value.trim(),
    date: new Date().toLocaleDateString('ko-KR')
  };

  const reviews = getReviews();
  reviews.unshift(review);
  saveReviews(reviews);

  currentPage = 1;
  renderList();
  e.target.reset();
  ratingInput.value = 0;
  highlightStars(0);
  document.getElementById('star-warn').style.display = 'none';
});

// 삭제
function deleteReview(id) {
  const reviews = getReviews().filter(r => r.id !== id);
  saveReviews(reviews);
  renderList();
}

// 수정 모달 별점 UI
const editStarSpans = document.querySelectorAll('#edit-star-input span');
const editRatingInput = document.getElementById('edit-rating');

editStarSpans.forEach(span => {
  span.addEventListener('mouseover', () => highlightEditStars(+span.dataset.val));
  span.addEventListener('mouseout', () => highlightEditStars(+editRatingInput.value));
  span.addEventListener('click', () => {
    editRatingInput.value = span.dataset.val;
    highlightEditStars(+span.dataset.val);
  });
});

function highlightEditStars(val) {
  editStarSpans.forEach(s => s.classList.toggle('on', +s.dataset.val <= val));
}

// 수정 모달 열기/닫기
function openEditReviewModal(review) {
  document.getElementById('edit-review-id').value = review.id;
  document.getElementById('edit-nickname').value = review.nickname || '';
  document.getElementById('edit-region').value = review.region;
  editRatingInput.value = review.rating;
  highlightEditStars(review.rating);
  document.getElementById('edit-title').value = review.title;
  document.getElementById('edit-content').value = review.content;
  document.getElementById('edit-star-warn').style.display = 'none';
  const modal = document.getElementById('edit-review-modal');
  modal.classList.add('open');
  trapFocus(modal);
}

function closeEditReviewModal() {
  const modal = document.getElementById('edit-review-modal');
  modal.classList.remove('open');
  releaseFocus(modal);
}

// 수정 저장
document.getElementById('edit-review-form').addEventListener('submit', e => {
  e.preventDefault();
  const rating = +editRatingInput.value;
  if (rating === 0) {
    document.getElementById('edit-star-warn').style.display = 'block';
    return;
  }
  document.getElementById('edit-star-warn').style.display = 'none';

  const id = Number(document.getElementById('edit-review-id').value);
  const reviews = getReviews().map(r =>
    r.id === id ? {
      ...r,
      nickname: document.getElementById('edit-nickname').value.trim() || '익명',
      region:   document.getElementById('edit-region').value,
      rating,
      title:    document.getElementById('edit-title').value.trim(),
      content:  document.getElementById('edit-content').value.trim(),
    } : r
  );
  saveReviews(reviews);
  closeEditReviewModal();
  renderList();
});

// 별점 분포 요약
function renderRatingSummary() {
  const all = getReviews();
  const el = {
    avg: document.getElementById('rating-avg-num'),
    stars: document.getElementById('rating-avg-stars'),
    label: document.getElementById('rating-avg-label'),
  };
  if (!el.avg) return;

  if (all.length === 0) {
    el.avg.textContent = '-';
    el.stars.textContent = '☆☆☆☆☆';
    el.label.textContent = '아직 후기가 없습니다';
    [1,2,3,4,5].forEach(n => {
      document.getElementById(`bar-${n}`).style.width = '0%';
      document.getElementById(`cnt-${n}`).textContent = '0';
    });
    return;
  }

  const total = all.length;
  const avg = all.reduce((s, r) => s + r.rating, 0) / total;
  el.avg.textContent = avg.toFixed(1);
  el.label.textContent = `총 ${total}개 후기`;

  const filled = Math.round(avg);
  el.stars.textContent = '★'.repeat(filled) + '☆'.repeat(5 - filled);

  const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
  all.forEach(r => counts[r.rating]++);
  const max = Math.max(...Object.values(counts), 1);
  [1,2,3,4,5].forEach(n => {
    document.getElementById(`bar-${n}`).style.width = `${(counts[n] / max) * 100}%`;
    document.getElementById(`cnt-${n}`).textContent = counts[n];
  });
}

// 렌더링
function renderList() {
  const filterVal = document.getElementById('filter-region').value;
  const sortVal = document.getElementById('sort-order').value;
  const query = document.getElementById('review-search').value.trim().toLowerCase();
  const all = getReviews();

  let filtered = filterVal === '전체' ? all : all.filter(r => r.region === filterVal);

  if (query) {
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.content.toLowerCase().includes(query) ||
      (r.nickname || '').toLowerCase().includes(query)
    );
  }

  if (sortVal === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  document.getElementById('review-search-clear').style.display = query ? 'block' : 'none';

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  const list = document.getElementById('review-list');
  const emptyMsg = document.getElementById('empty-msg');
  const countEl = document.getElementById('review-count');

  list.innerHTML = '';
  countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    emptyMsg.style.display = 'block';
    renderPagination(0);
    return;
  }
  emptyMsg.style.display = 'none';

  paginated.forEach(review => {
    const li = document.createElement('li');
    li.className = 'review-card reveal';

    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    const top = document.createElement('div');
    top.className = 'card-top';

    const badge = document.createElement('span');
    badge.className = 'region-badge';
    badge.textContent = review.region;

    const starEl = document.createElement('span');
    starEl.className = 'card-stars';
    starEl.textContent = stars;

    const nicknameEl = document.createElement('span');
    nicknameEl.className = 'card-nickname';
    nicknameEl.textContent = review.nickname || '익명';

    const dateEl = document.createElement('span');
    dateEl.className = 'card-date';
    dateEl.textContent = review.date;

    top.appendChild(badge);
    top.appendChild(starEl);
    top.appendChild(nicknameEl);
    top.appendChild(dateEl);

    const titleEl = document.createElement('p');
    titleEl.className = 'card-title';
    titleEl.textContent = review.title;

    const contentEl = document.createElement('p');
    contentEl.className = 'card-content';
    contentEl.textContent = review.content;

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '✏️';
    editBtn.setAttribute('aria-label', '후기 수정');
    editBtn.addEventListener('click', () => openEditReviewModal(review));

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', '후기 삭제');
    delBtn.addEventListener('click', () => deleteReview(review.id));

    li.appendChild(top);
    li.appendChild(titleEl);
    li.appendChild(contentEl);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    list.appendChild(li);
  });

  renderPagination(totalPages);
  renderRatingSummary();
}

function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.textContent = '‹';
  prev.disabled = currentPage === 1;
  prev.addEventListener('click', () => { currentPage--; renderList(); });
  container.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    btn.addEventListener('click', () => { currentPage = i; renderList(); });
    container.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'page-btn';
  next.textContent = '›';
  next.disabled = currentPage === totalPages;
  next.addEventListener('click', () => { currentPage++; renderList(); });
  container.appendChild(next);
}

// 데이터 내보내기 / 가져오기
function exportReviewsData() {
  const data = getReviews();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reviews-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('export-reviews-btn')?.addEventListener('click', exportReviewsData);

document.getElementById('import-reviews-input')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) {
        showToast('올바른 후기 백업 파일이 아닙니다.');
        return;
      }
      if (!confirm(`후기 ${data.length}건을 가져옵니다. 기존 데이터가 덮어씌워집니다. 계속할까요?`)) return;
      saveReviews(data);
      currentPage = 1;
      renderList();
      showToast('데이터를 성공적으로 가져왔습니다.');
    } catch {
      showToast('파일을 읽는 중 오류가 발생했습니다.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

document.getElementById('filter-region').addEventListener('change', () => { currentPage = 1; renderList(); });
document.getElementById('sort-order').addEventListener('change', () => { currentPage = 1; renderList(); });
document.getElementById('review-search').addEventListener('input', () => { currentPage = 1; renderList(); });
document.getElementById('review-search-clear').addEventListener('click', () => {
  document.getElementById('review-search').value = '';
  currentPage = 1;
  renderList();
  document.getElementById('review-search').focus();
});

document.getElementById('edit-review-cancel').addEventListener('click', closeEditReviewModal);
document.getElementById('edit-review-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('edit-review-modal')) closeEditReviewModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('edit-review-modal').classList.contains('open')) {
    closeEditReviewModal();
  }
});

renderList();
