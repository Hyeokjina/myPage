const form      = document.getElementById('contact-form');
const nameEl    = document.getElementById('name');
const emailEl   = document.getElementById('email');
const messageEl = document.getElementById('message');
const counter   = document.getElementById('char-counter');
const submitBtn = document.getElementById('submit-btn');
const successEl = document.getElementById('success-msg');

const MAX_CHARS = 500;

// 글자수 카운터
messageEl.addEventListener('input', () => {
    const len = messageEl.value.length;
    counter.textContent = `${len} / ${MAX_CHARS}`;
    counter.classList.toggle('over', len > MAX_CHARS);
    if (len > 0) validate(messageEl);
});

// 실시간 유효성 검사 (포커스 벗어날 때)
nameEl.addEventListener('blur',    () => validate(nameEl));
emailEl.addEventListener('blur',   () => validate(emailEl));
messageEl.addEventListener('blur', () => validate(messageEl));

// 입력 시작하면 에러 해제
nameEl.addEventListener('input',    () => clearError(nameEl));
emailEl.addEventListener('input',   () => clearError(emailEl));

function validate(el) {
    const val = el.value.trim();
    if (el === nameEl) {
        if (!val) return showError(el, '이름을 입력해 주세요.');
        if (val.length < 2) return showError(el, '이름은 2자 이상 입력해 주세요.');
    }
    if (el === emailEl) {
        if (!val) return showError(el, '이메일을 입력해 주세요.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return showError(el, '올바른 이메일 형식이 아닙니다.');
    }
    if (el === messageEl) {
        if (!val) return showError(el, '문의 내용을 입력해 주세요.');
        if (val.length < 10) return showError(el, '최소 10자 이상 입력해 주세요.');
        if (val.length > MAX_CHARS) return showError(el, `${MAX_CHARS}자 이내로 입력해 주세요.`);
    }
    markValid(el);
    return true;
}

function showError(el, msg) {
    el.classList.add('is-invalid');
    el.classList.remove('is-valid');
    document.getElementById(el.id + '-error').textContent = msg;
    return false;
}

function markValid(el) {
    el.classList.remove('is-invalid');
    el.classList.add('is-valid');
    document.getElementById(el.id + '-error').textContent = '';
}

function clearError(el) {
    if (!el.value.trim()) {
        el.classList.remove('is-invalid', 'is-valid');
        document.getElementById(el.id + '-error').textContent = '';
    }
}

// 제출
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const validName    = validate(nameEl);
    const validEmail   = validate(emailEl);
    const validMessage = validate(messageEl);
    if (!validName || !validEmail || !validMessage) return;

    // 로딩 상태
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // mailto 전송 시뮬레이션 (실제 전송은 서버 없이 불가)
    setTimeout(() => {
        const name     = nameEl.value.trim();
        const email    = emailEl.value.trim();
        const category = document.getElementById('category').value;
        const message  = messageEl.value.trim();

        const subject = encodeURIComponent(`[문의${category ? ' - ' + category : ''}] ${name}`);
        const body    = encodeURIComponent(`이름: ${name}\n이메일: ${email}${category ? '\n문의 유형: ' + category : ''}\n\n${message}`);
        window.location.href = `mailto:example@email.com?subject=${subject}&body=${body}`;

        form.reset();
        counter.textContent = `0 / ${MAX_CHARS}`;
        [nameEl, emailEl, messageEl].forEach(el => el.classList.remove('is-valid', 'is-invalid'));

        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');

        successEl.classList.add('show');
        setTimeout(() => successEl.classList.remove('show'), 5000);
    }, 800);
});
