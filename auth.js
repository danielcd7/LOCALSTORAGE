const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const regUser = document.getElementById('regUser');
const regEmail = document.getElementById('regEmail');
const regPass = document.getElementById('regPass');
const regPassConfirm = document.getElementById('regPassConfirm');
const btnRegister = document.getElementById('btnRegister');

const userError = document.getElementById('userError');
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passError');
const passConfirmError = document.getElementById('passConfirmError');

showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

const validateRegister = () => {
    let isValid = true;

    if (regUser.value.length < 3) {
        userError.textContent = "Mínimo 3 caracteres";
        regUser.classList.add('invalid');
        isValid = false;
    } else {
        userError.textContent = "";
        regUser.classList.remove('invalid');
        regUser.classList.add('valid');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.value)) {
        emailError.textContent = "Correo inválido";
        regEmail.classList.add('invalid');
        isValid = false;
    } else {
        emailError.textContent = "";
        regEmail.classList.remove('invalid');
        regEmail.classList.add('valid');
    }

    if (regPass.value.length < 6) {
        passError.textContent = "Mínimo 6 caracteres";
        regPass.classList.add('invalid');
        isValid = false;
    } else {
        passError.textContent = "";
        regPass.classList.remove('invalid');
        regPass.classList.add('valid');
    }

    if (regPass.value !== regPassConfirm.value || regPassConfirm.value === '') {
        passConfirmError.textContent = "Las contraseñas no coinciden";
        regPassConfirm.classList.add('invalid');
        isValid = false;
    } else {
        passConfirmError.textContent = "";
        regPassConfirm.classList.remove('invalid');
        regPassConfirm.classList.add('valid');
    }

    btnRegister.disabled = !isValid;
};

[regUser, regEmail, regPass, regPassConfirm].forEach(input => {
    input.addEventListener('input', validateRegister);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find(u => u.username === regUser.value);

    if (userExists) {
        alert('El usuario ya existe');
        return;
    }

    const newUser = {
        username: regUser.value,
        email: regEmail.value,
        password: regPass.value
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registro exitoso. Ahora inicia sesión.');
    registerForm.reset();
    showLoginBtn.click();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(u => u.username === user && u.password === pass);

    if (validUser) {
        localStorage.setItem('currentUser', JSON.stringify(validUser));
        window.location.href = 'home.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

if (localStorage.getItem('currentUser')) {
    window.location.href = 'home.html';
}