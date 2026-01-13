// ==========================================
// 1. BASE DE DATOS Y CONFIGURACIÓN
// ==========================================
const expertos = [
    { nombre: "Juan Pérez", oficio: "plomero", rating: 4.9, trabajos: 28, desc: "Especialista en fugas y tuberías.", tel: "1234567890" },
    { nombre: "Marta Gómez", oficio: "electricista", rating: 4.8, trabajos: 15, desc: "Instalaciones eléctricas residenciales.", tel: "0987654321" },
    { nombre: "Carlos Ruiz", oficio: "carpintero", rating: 4.7, trabajos: 42, desc: "Muebles a medida y reparación de puertas.", tel: "1122334455" },
    { nombre: "Luis Flores", oficio: "herrero", rating: 4.9, trabajos: 10, desc: "Portones, protecciones y soldadura en general.", tel: "5566778899" }
];

// ==========================================
// 2. INICIALIZADOR GLOBAL (DOMContentLoaded)
// ==========================================
// ==========================================
// 2. INICIALIZADOR GLOBAL (DOMContentLoaded)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarFooter();

    // --- LÓGICA DEL MENÚ MÓVIL CORREGIDA ---
    const menuToggle = document.getElementById('menuToggle') || document.querySelector('.mobile-toggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Alternamos la visibilidad
            mobileMenu.classList.toggle('flex');
            
            // Cambiar icono del botón
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('flex')) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    }

    // Cerrar el menú al hacer clic afuera
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mobileMenu.classList.remove('flex');
            const icon = menuToggle?.querySelector('i');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // --- RESTO DE TUS MÓDULOS (Registro/Login) ---
    const roleSelect = document.getElementById('user-role');
    const checkTerminos = document.getElementById('acepto-terminos');
    const formRegistro = document.getElementById('form-registro');

    if (roleSelect) {
        roleSelect.addEventListener('change', toggleCampos);
        const params = new URLSearchParams(window.location.search);
        if (params.get('role') === 'tecnico') {
            roleSelect.value = 'tecnico';
            toggleCampos();
        }
    }

    if (checkTerminos) checkTerminos.addEventListener('change', validarCheck);
    if (formRegistro) formRegistro.addEventListener('submit', registrar);

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', procesarLogin);
    }
});

// Mantén tus funciones de toggleCampos, validarCheck, registrar, etc., igual que las tenías.

// ==========================================
// 3. FUNCIONES DE USUARIO (Registro/Login)
// ==========================================
function toggleCampos() {
    const role = document.getElementById('user-role').value;
    const camposExtra = document.getElementById('campos-tecnico');
    if (camposExtra) {
        camposExtra.style.display = (role === 'tecnico') ? 'flex' : 'none';
    }
}

function validarCheck() {
    const check = document.getElementById('acepto-terminos');
    const wrapper = document.getElementById('wrapper-btn');
    const btn = document.getElementById('btn-registro');

    if (check && wrapper && btn) {
        if (check.checked) {
            wrapper.classList.remove('btn-disabled');
            btn.disabled = false;
        } else {
            wrapper.classList.add('btn-disabled');
            btn.disabled = true;
        }
    }
}

function registrar(e) {
    e.preventDefault();
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    
    if (btnText) btnText.innerText = "CREANDO CUENTA...";
    if (btnSpinner) btnSpinner.style.display = "inline-block";

    setTimeout(() => {
        alert("¡Registro exitoso! Bienvenido a NeedFix.");
        window.location.href = 'login.html';
    }, 2000);
}

function procesarLogin(e) {
    e.preventDefault();
    const btnText = document.getElementById('btn-text') || document.getElementById('login-text');
    const btnSpinner = document.getElementById('btn-spinner') || document.getElementById('login-spinner');
    
    // Intentamos obtener el rol si existe el select, si no, asumimos cliente
    const roleSelect = document.getElementById('user-role');
    const role = roleSelect ? roleSelect.value : 'cliente';

    if (btnText) btnText.innerText = "VERIFICANDO...";
    if (btnSpinner) btnSpinner.style.display = "inline-block";

    setTimeout(() => {
        window.location.href = (role === 'tecnico') ? 'panel-tecnico.html' : 'panel-cliente.html';
    }, 1500);
}

// ==========================================
// 4. BÚSQUEDA Y MODALES
// ==========================================
function enviar() {
    const cp = document.getElementById('zip-code')?.value;
    const oficio = document.getElementById('service-type')?.value;

    if (!cp) {
        alert("Por favor ingresa tu código postal");
        return;
    }

    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';

    mostrarExpertos(oficio);
}

function mostrarExpertos(oficio) {
    const container = document.getElementById('expert-list');
    const section = document.getElementById('results-section');
    if (!container || !section) return;

    container.innerHTML = ""; 
    section.style.display = 'block';

    const filtrados = expertos.filter(e => e.oficio === oficio);

    if (filtrados.length === 0) {
        container.innerHTML = `<div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <p>Lo sentimos, no hay expertos disponibles en esta zona para ${oficio}.</p>
        </div>`;
        return;
    }

    filtrados.forEach(exp => {
        const esFavorito = (JSON.parse(localStorage.getItem('favoritos')) || []).includes(exp.nombre);
        container.innerHTML += `
            <div class="expert-card glass-card">
                <button class="fav-btn ${esFavorito ? 'active' : ''}" onclick="toggleFavorito(this, '${exp.nombre}')">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="expert-info">
                    <i class="fas fa-user-circle expert-avatar"></i>
                    <h3>${exp.nombre}</h3>
                    <p class="expert-trade">${exp.oficio.toUpperCase()}</p>
                    <div class="expert-rating"><i class="fas fa-star"></i> ${exp.rating}</div>
                    <p class="expert-desc">${exp.desc}</p>
                    <div class="button-bg"><button class="btn-inner" onclick="abrirModal('${exp.nombre}', '${exp.tel}')">Contactar</button></div>
                </div>
            </div>`;
    });
}

function abrirModal(nombre, tel) {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    document.getElementById('expert-name-modal').innerText = nombre;
    const wsBtn = modal.querySelector('.whatsapp');
    const phBtn = modal.querySelector('.phone');
    if (wsBtn) wsBtn.href = `https://wa.me/${tel}`;
    if (phBtn) phBtn.href = `tel:${tel}`;
    modal.style.display = 'flex';
}

function cerrarModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.style.display = 'none';
}

// ==========================================
// 5. COMPONENTES DINÁMICOS (Footer)
// ==========================================
function cargarFooter() {
    const paginaActual = window.location.pathname;
    const paginasSinFooter = ['panel-cliente.html', 'panel-tecnico.html', 'dashboard.html'];
    const ocultar = paginasSinFooter.some(p => paginaActual.includes(p));

    if (!ocultar && !document.querySelector('.main-footer')) {
        const footerHTML = `
        <footer class="main-footer">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="logo">
                        <img src="img/logo.png" alt="NeedFix Logo" class="nav-logo-img">
                    </div>
                    <p style="margin-top: 15px; color: #999; font-size: 0.9rem;">
                        Conectando expertos con soluciones reales. La red técnica más confiable.
                    </p>
                </div>
                <div class="footer-section">
                    <h4>Navegación</h4>
                    <ul style="list-style:none; padding:0;">
                        <li><a href="index.html">Inicio</a></li>
                        <li><a href="nosotros.html">Nosotros</a></li>
                        <li><a href="faq.html">Ayuda</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Legal</h4>
                    <ul style="list-style:none; padding:0;">
                        <li><a href="privacidad.html">Privacidad</a></li>
                        <li><a href="terminos.html">Términos</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Síguenos</h4>
                    <div class="social-links" style="display:flex; gap:15px; font-size:1.5rem;">
                        <a href="#" style="color:white;"><i class="fab fa-facebook"></i></a>
                        <a href="#" style="color:white;"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom" style="text-align:center; margin-top:40px; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; color:#666; font-size:0.8rem;">
                <p>&copy; 2026 NeedFix - Todos los derechos reservados.</p>
            </div>
        </footer>`;
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}
// Cerrar modales al clic fuera
window.onclick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
};
// AGREGAR AL FINAL DE TU SCRIPT.JS EXISTENTE
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            
            // Cambiar icono al abrir/cerrar
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
});

// Cerrar menú móvil al hacer clic en un link
document.querySelectorAll('.mobile-menu-dropdown a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.add('hidden');
    });
});
// FUNCIÓN DE EMERGENCIA PARA EL MENÚ
function toggleMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    
    // Alternar clase para abrir/cerrar
    menu.classList.toggle('mobile-menu-open');
    
    // Cambiar icono de barras a X
    if (menu.classList.contains('mobile-menu-open')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
}

// Cerrar el menú al tocar cualquier otra parte de la pantalla
document.addEventListener('click', function() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    if(menu) menu.classList.remove('mobile-menu-open');
    if(icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
});
function enviar() {
    const cp = document.getElementById('zip-code')?.value;
    const oficio = document.getElementById('service-type')?.value;

    if (!cp) {
        alert("Por favor ingresa tu código postal");
        return;
    }

    // Cambiamos esto para que no de error si no existe .hero
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    
    // Ocultar la barra de búsqueda inicial para dar protagonismo a los resultados
    const searchBar = document.querySelector('.search-bar');
    // if (searchBar) searchBar.style.display = 'none'; // Opcional

    mostrarExpertos(oficio);
}