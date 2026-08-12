/* =====================================================================
   LA PARADA — script.js
   Módulos:
     1. Menú móvil (abrir/cerrar + cerrar al elegir opción)
     2. Resaltado del enlace activo en el nav al hacer scroll
     3. Animación de entrada de secciones (IntersectionObserver)
     4. Estado "abierto ahora / cerrado" según el horario
     5. Enlaces de pedido por WhatsApp (hero, tickets y footer)
     6. Validación y envío del formulario de contacto vía WhatsApp
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* -------- Configuración del negocio --------
     Cambia estos valores por los datos reales del negocio. */
  const CONFIG = {
    telefonoWhatsapp: "51987654321", // formato: código de país + número, sin "+"
    horaApertura: 18, // 6:00 p.m. (formato 24h)
    horaCierre: 24,   // 12:00 a.m.
  };

  /* ==================== 1. MENÚ MÓVIL ==================== */
  const navToggle = document.getElementById("nav-toggle");
  const navList = document.getElementById("nav-list").closest(".main-nav");

  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ==================== 2. ENLACE ACTIVO EN EL NAV ==================== */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const highlightNav = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  };
  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();

  /* ==================== 3. ANIMACIÓN DE ENTRADA (scroll reveal) ==================== */
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((item) => observer.observe(item));

  /* ==================== 4. ESTADO ABIERTO / CERRADO ==================== */
  const statusBadge = document.getElementById("status-badge");
  const statusText = document.getElementById("status-text");

  const actualizarEstado = () => {
    const horaActual = new Date().getHours();
    const abierto = horaActual >= CONFIG.horaApertura && horaActual < CONFIG.horaCierre;

    statusBadge.classList.toggle("is-open", abierto);
    statusBadge.classList.toggle("is-closed", !abierto);
    statusText.textContent = abierto
      ? "Abierto ahora — puedes pedir"
      : `Cerrado — abrimos a las ${CONFIG.horaApertura}:00`;
  };
  actualizarEstado();

  /* ==================== 5. ENLACES DE WHATSAPP ==================== */
  const construirEnlaceWhatsapp = (mensaje) =>
    `https://wa.me/${CONFIG.telefonoWhatsapp}?text=${encodeURIComponent(mensaje)}`;

  // Botón principal del hero
  const heroWhatsapp = document.getElementById("hero-whatsapp");
  heroWhatsapp.href = construirEnlaceWhatsapp("¡Hola! Quisiera hacer un pedido en La Parada 🔥");

  // WhatsApp del footer
  const footerWhatsapp = document.getElementById("footer-whatsapp");
  footerWhatsapp.href = construirEnlaceWhatsapp("¡Hola! Quisiera más información sobre La Parada.");

  // Botones "Pedir" de cada ticket de producto
  document.querySelectorAll(".ticket-order").forEach((boton) => {
    const producto = boton.dataset.producto;
    const precio = boton.dataset.precio;
    boton.href = construirEnlaceWhatsapp(
      `¡Hola! Quiero pedir: ${producto} (${precio}).`
    );
    boton.target = "_blank";
    boton.rel = "noopener";
  });

  /* ==================== 6. FORMULARIO DE CONTACTO ==================== */
  const form = document.getElementById("contact-form");
  const successMsg = document.getElementById("form-success");

  const campos = {
    nombre: { el: document.getElementById("nombre"), error: document.getElementById("error-nombre") },
    telefono: { el: document.getElementById("telefono"), error: document.getElementById("error-telefono") },
    producto: { el: document.getElementById("producto"), error: document.getElementById("error-producto") },
  };

  const validarCampo = (clave) => {
    const { el, error } = campos[clave];
    let mensaje = "";

    if (clave === "nombre" && el.value.trim().length < 2) {
      mensaje = "Ingresa tu nombre completo.";
    }
    if (clave === "telefono") {
      const soloDigitos = el.value.replace(/\D/g, "");
      if (soloDigitos.length < 9) mensaje = "Ingresa un teléfono válido (9 dígitos).";
    }
    if (clave === "producto" && el.value === "") {
      mensaje = "Selecciona una opción del menú.";
    }

    error.textContent = mensaje;
    el.closest(".field").classList.toggle("has-error", Boolean(mensaje));
    el.setAttribute("aria-invalid", Boolean(mensaje));
    return mensaje === "";
  };

  Object.keys(campos).forEach((clave) => {
    campos[clave].el.addEventListener("blur", () => validarCampo(clave));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMsg.textContent = "";

    const valido = Object.keys(campos)
      .map((clave) => validarCampo(clave))
      .every(Boolean);

    if (!valido) return;

    const nombre = campos.nombre.el.value.trim();
    const telefono = campos.telefono.el.value.trim();
    const producto = campos.producto.el.value;
    const mensajeExtra = document.getElementById("mensaje").value.trim();

    const mensajeWhatsapp =
      `¡Hola! Soy ${nombre} (${telefono}).\n` +
      `Quisiera pedir: ${producto}.` +
      (mensajeExtra ? `\nNota: ${mensajeExtra}` : "");

    window.open(construirEnlaceWhatsapp(mensajeWhatsapp), "_blank", "noopener");

    successMsg.textContent = "¡Listo! Te llevamos a WhatsApp para confirmar tu pedido.";
    form.reset();
  });

  /* ==================== AÑO ACTUAL EN EL FOOTER ==================== */
  document.getElementById("year").textContent = new Date().getFullYear();
});
