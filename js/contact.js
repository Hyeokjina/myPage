document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`[문의] ${name}`);
    const body    = encodeURIComponent(`이름: ${name}\n이메일: ${email}\n\n${message}`);

    window.location.href = `mailto:example@email.com?subject=${subject}&body=${body}`;

    this.reset();
    document.getElementById('success-msg').style.display = 'block';
});
