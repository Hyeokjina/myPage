document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    this.style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
});
