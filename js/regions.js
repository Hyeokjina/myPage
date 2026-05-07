document.getElementById('regions-filter').addEventListener('click', e => {
    const btn = e.target.closest('.rfilter-btn');
    if (!btn) return;

    document.querySelectorAll('.rfilter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const theme = btn.dataset.theme;
    document.querySelectorAll('.rcard').forEach(card => {
        const themes = card.dataset.theme || '';
        card.classList.toggle('hidden', theme !== '전체' && !themes.includes(theme));
    });
});
