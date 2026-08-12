// =========================================================
// FUEGO STREET FOOD — script.js
// 1) Login (usuario/contraseña de demo)
// 2) Menú móvil (hamburguesa)
// 3) Formulario de contacto (validación simple en el cliente)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initMobileNav();
  initContactForm();
});

/* ---------------------------------------------------------
   1) LOGIN
   Credenciales de demostración: admin / admin
   NOTA: esta validación ocurre en el navegador y es solo para
   fines de demo/portafolio. Para producción real se necesita
   autenticación en un servidor (no exponer credenciales en JS).
--------------------------------------------------------- */
function initLogin() {
  const loginScreen = document.getElementById("login-screen");
  const loginCard = document.querySelector(".login-card");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const mainSite = document.getElementById("main-site");

  const VALID_USER = "admin";
  const VALID_PASS = "admin";

  // Si ya inició sesión en esta pestaña, saltar el login
  if (sessionStorage.getItem("fuego_logged_in") === "true") {
    showSite();
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === VALID_USER && password === VALID_PASS) {
      sessionStorage.setItem("fuego_logged_in", "true");
      showSite();
    } else {
      loginError.textContent = "Usuario o contraseña incorrectos. Intenta de nuevo.";
      loginCard.classList.remove("shake");
      // Forzar reinicio de la animación
      void loginCard.offsetWidth;
      loginCard.classList.add("shake");
    }
  });

  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("fuego_logged_in");
    mainSite.hidden = true;
    loginScreen.hidden = false;
    loginForm.reset();
    loginError.textContent = "";
  });

  function showSite() {
    loginScreen.hidden = true;
    mainSite.hidden = false;
  }
}

/* ---------------------------------------------------------
   2) MENÚ MÓVIL
--------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav-menu");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Cerrar el menú al elegir una sección (en móvil)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   3) FORMULARIO DE CONTACTO
   Validación simple en el cliente. Para recibir los mensajes
   de verdad, conectar este formulario a un backend, a un
   servicio como Formspree, o a tu propia API.
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const successMsg = document.getElementById("contact-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      successMsg.style.color = "var(--neon-red-glow)";
      successMsg.textContent = "Completa todos los campos antes de enviar.";
      return;
    }

    // Aquí iría la llamada real a tu backend / servicio de correo:
    // fetch("/api/contacto", { method: "POST", body: JSON.stringify({ name, email, message }) })

    successMsg.style.color = "var(--lime)";
    successMsg.textContent = `¡Gracias, ${name}! Recibimos tu mensaje y te escribiremos pronto.`;
    form.reset();
  });
}
