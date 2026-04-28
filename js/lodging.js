const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.lodging-card');
const emptyMsg = document.getElementById('lodging-empty');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let visible = 0;

        cards.forEach(card => {
            const match = filter === '전체' || card.dataset.region === filter;
            card.classList.toggle('hidden', !match);
            if (match) visible++;
        });

        emptyMsg.style.display = visible === 0 ? 'block' : 'none';
    });
});
