const STORAGE_KEY = 'travel_reviews';
const PAGE_SIZE = 5;
let currentPage = 1;

function getReviews() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
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

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', '후기 삭제');
    delBtn.addEventListener('click', () => deleteReview(review.id));

    li.appendChild(top);
    li.appendChild(titleEl);
    li.appendChild(contentEl);
    li.appendChild(delBtn);

    list.appendChild(li);
  });

  renderPagination(totalPages);
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

document.getElementById('filter-region').addEventListener('change', () => { currentPage = 1; renderList(); });
document.getElementById('sort-order').addEventListener('change', () => { currentPage = 1; renderList(); });
document.getElementById('review-search').addEventListener('input', () => { currentPage = 1; renderList(); });

renderList();
