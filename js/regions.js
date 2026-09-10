initFilterGroup('#regions-filter', '.rfilter-btn', ds => {
    const theme = ds.theme;
    document.querySelectorAll('.rcard').forEach(card => {
        const themes = card.dataset.theme || '';
        card.classList.toggle('hidden', theme !== '전체' && !themes.includes(theme));
    });
});
