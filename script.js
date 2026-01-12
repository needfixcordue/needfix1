// 1. Base de datos simulada de expertos
const expertos = [
    { nombre: "Juan Pérez", oficio: "plomero", rating: 4.9, trabajos: 28, desc: "Especialista en fugas y tuberías.", tel: "1234567890" },
    { nombre: "Marta Gómez", oficio: "electricista", rating: 4.8, trabajos: 15, desc: "Instalaciones eléctricas residenciales.", tel: "0987654321" },
    { nombre: "Carlos Ruiz", oficio: "carpintero", rating: 4.7, trabajos: 42, desc: "Muebles a medida y reparación de puertas.", tel: "1122334455" },
    { nombre: "Luis Flores", oficio: "herrero", rating: 4.9, trabajos: 10, desc: "Portones, protecciones y soldadura en general.", tel: "5566778899" },
    { nombre: "Ana Martínez", oficio: "plomero", rating: 4.6, trabajos: 20, desc: "Instalación de sanitarios y drenajes.", tel: "6677889900" }
];

// 2. Lógica principal de búsqueda
function enviar() {
    const oficioSeleccionado = document.getElementById('service-type').value;
    const modalidad = document.getElementById('service-mode').value;
    const cp = document.getElementById('zip-code').value;

    if(!cp) {
        alert("Por favor ingresa tu código postal");
        return;
    }

    // Ocultar el Hero (Buscador)
    document.querySelector('.hero').style.display = 'none';

    if (modalidad === 'proyecto') {
        document.getElementById('project-details-section').style.display = 'block';
    } else {
        mostrarExpertos(oficioSeleccionado);
    }
}

// 3. Generación dinámica de tarjetas con Favoritos
function mostrarExpertos(oficio) {
    const container = document.getElementById('expert-list');
    const section = document.getElementById('results-section');
    container.innerHTML = ""; 
    section.style.display = 'block';

    const filtrados = expertos.filter(e => e.oficio === oficio);

    if(filtrados.length === 0) {
        container.innerHTML = "<p>No se encontraron expertos en esta categoría por ahora.</p>";
        return;
    }

    filtrados.forEach(exp => {
        // Verificar si este experto ya está en favoritos
        const esFavorito = checkFavorito(exp.nombre);

        const card = `
            <div class="expert-card">
                <button class="fav-btn ${esFavorito ? 'active' : ''}" onclick="toggleFavorito(this, '${exp.nombre}')">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="expert-badge">Express</div>
                <div class="expert-info">
                    <i class="fas fa-user-circle expert-avatar"></i>
                    <h3>${exp.nombre}</h3>
                    <p class="expert-trade">${exp.oficio.toUpperCase()} Certificado</p>
                    <div class="expert-rating">
                        <i class="fas fa-star"></i> ${exp.rating} <span>(${exp.trabajos} trabajos)</span>
                    </div>
                    <p class="expert-desc">${exp.desc}</p>
                    <div class="button-bg">
                        <button class="btn-inner nav-padding" onclick="abrirModal('${exp.nombre}', '${exp.tel}')">
                            Contactar
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// 4. Gestión de Favoritos (LocalStorage)
function checkFavorito(nombre) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    return favoritos.includes(nombre);
}

function toggleFavorito(btn, nombre) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (favoritos.includes(nombre)) {
        favoritos = favoritos.filter(fav => fav !== nombre);
        btn.classList.remove('active');
    } else {
        favoritos.push(nombre);
        btn.classList.add('active');
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// 5. Modal de Contacto
function abrirModal(nombre, telefono) {
    document.getElementById('expert-name-modal').innerText = nombre;
    document.querySelector('.whatsapp').href = `https://wa.me/${telefono}`;
    document.querySelector('.phone').href = `tel:${telefono}`;
    document.getElementById('contact-modal').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('contact-modal').style.display = 'none';
}

// 6. Funciones auxiliares
function finalizarProyecto() {
    const desc = document.getElementById('project-desc').value;
    if(desc.length < 10) {
        alert("Por favor describe un poco más tu proyecto.");
        return;
    }
    alert("¡Proyecto publicado! Los expertos te contactarán pronto.");
    location.reload();
}

window.onclick = function(event) {
    const modal = document.getElementById('contact-modal');
    if (event.target == modal) cerrarModal();
}
function abrirSoporte() {
    document.getElementById('soporte-modal').style.display = 'flex';
}

function cerrarSoporte() {
    document.getElementById('soporte-modal').style.display = 'none';
}

// Cerrar el modal si el usuario hace clic fuera de la caja de cristal
window.addEventListener('click', function(event) {
    const modal = document.getElementById('soporte-modal');
    if (event.target == modal) {
        cerrarSoporte();
    }
});

