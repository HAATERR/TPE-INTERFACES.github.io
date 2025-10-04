const form = document.querySelector('form');
const inputs = document.querySelectorAll('.formularios input');
const captchaCheckbox = document.getElementById('captcha-check'); // ⬅️ ojo, en tu HTML es "captcha-check"

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para crear y mostrar tooltip
function mostrarTooltip(input, mensaje) {
    ocultarTooltip(input);

    if (!input.parentElement.classList.contains('input-con-tooltip')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-con-tooltip';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-error mostrar';
    tooltip.innerHTML = `<span class="icono-alerta">!</span> <span class="mensaje-error">${mensaje}</span>`;
    input.parentElement.appendChild(tooltip);
    input.classList.add('input-error');
}

// Función para ocultar tooltip
function ocultarTooltip(input) {
    const wrapper = input.parentElement;
    const tooltip = wrapper.querySelector('.tooltip-error');
    if (tooltip) tooltip.remove();
    input.classList.remove('input-error');
}

// Obtener mensaje según el placeholder
function obtenerMensaje(input, vacio = true) {
    const placeholder = (input.placeholder || "").toLowerCase();
    const valor = input.value.trim();

    if (vacio) {
        if (placeholder.includes('nombre') && !placeholder.includes('nickname')) {
            return 'Escribe tu nombre.';
        } else if (placeholder.includes('apellido')) {
            return 'Escribe tu apellido.';
        } else if (placeholder.includes('edad')) {
            return 'Escribe tu edad.';
        } else if (placeholder.includes('correo')) {
            return 'Escribe tu correo electrónico.';
        } else if (placeholder.includes('contraseña') && !placeholder.includes('repetir')) {
            return 'La contraseña debe tener al menos 6 caracteres.';
        } else if (placeholder.includes('repetir')) {
            return 'Escribe tu contraseña nuevamente.';
        }
    } else {
        if (input.type === 'email') {
            return 'Email inválido. Verifica el formato.';
        } else if (input.type === 'number') {
            return 'Edad inválida. La edad mínima permitida es 18 años.';
        } else if (placeholder.includes('contraseña') && !placeholder.includes('repetir')) {
            return 'La contraseña debe tener al menos 6 caracteres.';
        } else if (placeholder.includes('repetir')) {
            return 'Las contraseñas no coinciden.';
        }
    }
    return 'Este campo es obligatorio.';
}

// Validación en blur
inputs.forEach(input => {
    input.addEventListener('blur', function () {
        const valor = this.value.trim();

        // Evitar validación si es nickname vacío
        if (this.name === 'nickname' && valor === '') {
            ocultarTooltip(this);
            return;
        }

        if (valor === '') {
            mostrarTooltip(this, obtenerMensaje(this, true));
        } else {
            if (this.type === 'email' && !validarEmail(valor)) {
                mostrarTooltip(this, obtenerMensaje(this, false));
            } else if (this.type === 'number' && (valor < 18 || valor > 120)) {
                mostrarTooltip(this, obtenerMensaje(this, false));
            } else if (this.name === 'password' && valor.length < 6) {
                mostrarTooltip(this, obtenerMensaje(this, false));
            } else if (this.name === 'password2') {
                const password = form.querySelector('input[name="password"]').value;
                if (valor !== password) {
                    mostrarTooltip(this, obtenerMensaje(this, false));
                } else {
                    ocultarTooltip(this);
                }
            } else {
                ocultarTooltip(this);
            }
        }
    });
});

// Validar formulario al enviar
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let formularioValido = true;
    let primerError = null;

    inputs.forEach(input => {
        const valor = input.value.trim();
        let tieneError = false;

        if (input.name === 'nickname' && valor === '') {
            ocultarTooltip(input);
            return;
        }

        if (valor === '') {
            mostrarTooltip(input, obtenerMensaje(input, true));
            tieneError = true;
        } else if (input.type === 'email' && !validarEmail(valor)) {
            mostrarTooltip(input, obtenerMensaje(input, false));
            tieneError = true;
        } else if (input.type === 'number' && (valor < 18 || valor > 120)) {
            mostrarTooltip(input, obtenerMensaje(input, false));
            tieneError = true;
        } else if (input.name === 'password' && valor.length < 6) {
            mostrarTooltip(input, obtenerMensaje(input, false));
            tieneError = true;
        } else if (input.name === 'password2') {
            const password = form.querySelector('input[name="password"]').value;
            if (valor !== password) {
                mostrarTooltip(input, obtenerMensaje(input, false));
                tieneError = true;
            }
        }

        if (tieneError) {
            formularioValido = false;
            if (!primerError) primerError = input;
        }
    });

    // Validar captcha
    const captchaContainer = document.querySelector('.captcha-wrapper'); // FIX
    let tooltipCaptcha = captchaContainer.querySelector('.tooltip-error');

    if (!captchaCheckbox.checked) {
        if (!tooltipCaptcha) {
            tooltipCaptcha = document.createElement('div');
            tooltipCaptcha.className = 'tooltip-error mostrar';
            tooltipCaptcha.innerHTML = `<span class="icono-alerta">!</span> <span class="mensaje-error">Verifica que no sos un robot.</span>`;
            captchaContainer.appendChild(tooltipCaptcha);
        }
        formularioValido = false;
        if (!primerError) primerError = captchaCheckbox;
    }

    if (formularioValido) {
        alert('¡Registro exitoso!');
        form.reset();
    } else if (primerError) {
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Quitar tooltip del captcha al marcarlo
captchaCheckbox.addEventListener('change', function () {
    if (this.checked) {
        const tooltipCaptcha = document.querySelector('.captcha-wrapper .tooltip-error');
        if (tooltipCaptcha) tooltipCaptcha.remove();
    }
});
