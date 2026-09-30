/* =========================================
   CONFIGURACIÓN PRINCIPAL

   Cuando publiques la tarjeta,
   coloca la URL pública definitiva
   en urlTarjeta.

   Ejemplo:
   urlTarjeta:
   "https://misitio.com/juan-miguel/"
========================================= */

const CONFIG = {

  nombre:
    "Juan Miguel Estrada",

  puesto:
    "Gerente de Planta",

  empresa:
    "Grupo Alerta",

  telefono:
    "+526691200175",

  telefonoVisible:
    "+52 669 120 0175",

  email:
    "jestrada@alerta.com.mx",

  ubicacion:
    "Mazatlán, Sinaloa",

  ubicacionCompleta:
    "Mazatlán, Sinaloa, México",

  maps:
    "https://maps.app.goo.gl/fViTGbtd3jr9Zxyz5",

  web:
    "https://www.alerta.com.mx",

  webVisible:
    "www.alerta.com.mx",

  urlTarjeta:
    ""

};


/* =========================================
   ELEMENTOS
========================================= */

const elements = {

  nombre:
    document.getElementById("nombre"),

  puesto:
    document.getElementById("puesto"),

  empresa:
    document.getElementById("empresa"),

  email:
    document.getElementById("email"),

  ubicacion:
    document.getElementById("ubicacion"),

  web:
    document.getElementById("web"),

  telefono:
    document.getElementById("telefono"),

  btnCall:
    document.getElementById("btnCall"),

  btnWhatsapp:
    document.getElementById("btnWhatsapp"),

  btnEmail:
    document.getElementById("btnEmail"),

  btnWeb:
    document.getElementById("btnWeb"),

  emailRow:
    document.getElementById("emailRow"),

  locationRow:
    document.getElementById("locationRow"),

  webRow:
    document.getElementById("webRow"),

  phoneRow:
    document.getElementById("phoneRow"),

  saveContact:
    document.getElementById("saveContact"),

  shareContact:
    document.getElementById("shareContact"),

  shareFallback:
    document.getElementById("shareFallback"),

  shareUrlInput:
    document.getElementById("shareUrlInput"),

  copyUrlButton:
    document.getElementById("copyUrlButton"),

  closeModal:
    document.getElementById("closeModal"),

  toast:
    document.getElementById("toast")

};


/* =========================================
   CARGAR DATOS
========================================= */

function loadContactData() {

  elements.nombre.textContent =
    CONFIG.nombre;

  elements.puesto.textContent =
    CONFIG.puesto;

  elements.empresa.textContent =
    CONFIG.empresa;

  elements.email.textContent =
    CONFIG.email;

  elements.ubicacion.textContent =
    CONFIG.ubicacion;

  elements.web.textContent =
    CONFIG.webVisible;

  elements.telefono.textContent =
    CONFIG.telefonoVisible;


  document.title =
    `${CONFIG.nombre} | ${CONFIG.empresa}`;


  /* TELÉFONO */

  const phoneLink =
    `tel:${CONFIG.telefono}`;

  elements.btnCall.href =
    phoneLink;

  elements.phoneRow.href =
    phoneLink;


  /* WHATSAPP */

  const whatsappNumber =
    CONFIG.telefono.replace(/\D/g, "");

  elements.btnWhatsapp.href =
    `https://wa.me/${whatsappNumber}`;


  /* CORREO */

  const emailLink =
    `mailto:${CONFIG.email}`;

  elements.btnEmail.href =
    emailLink;

  elements.emailRow.href =
    emailLink;


  /* WEB */

  elements.btnWeb.href =
    CONFIG.web;

  elements.webRow.href =
    CONFIG.web;


  /* MAPS */

  elements.locationRow.href =
    CONFIG.maps;

}


/* =========================================
   URL PÚBLICA
========================================= */

function getCardUrl() {

  if (
    CONFIG.urlTarjeta &&
    CONFIG.urlTarjeta.trim() !== ""
  ) {

    return CONFIG.urlTarjeta.trim();

  }

  /*
    Mientras no exista URL pública,
    utilizamos la URL actual.

    Al publicar la tarjeta debes
    colocar la URL definitiva en CONFIG.
  */

  return window.location.href.split("#")[0];

}


/* =========================================
   VCARD
========================================= */

function escapeVCard(value) {

  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

}


function generateVCard() {

  const vCard = [

    "BEGIN:VCARD",

    "VERSION:3.0",

    `N:${escapeVCard("Estrada")};${escapeVCard("Juan Miguel")};;;`,

    `FN:${escapeVCard(CONFIG.nombre)}`,

    `ORG:${escapeVCard(CONFIG.empresa)}`,

    `TITLE:${escapeVCard(CONFIG.puesto)}`,

    `TEL;TYPE=CELL:${CONFIG.telefono}`,

    `EMAIL;TYPE=INTERNET,WORK:${CONFIG.email}`,

    `URL:${CONFIG.web}`,

    `ADR;TYPE=WORK:;;${escapeVCard("Mazatlán")};${escapeVCard("Sinaloa")};;${escapeVCard("México")}`,

    "END:VCARD"

  ].join("\r\n");


  return vCard;

}


/* =========================================
   DESCARGAR CONTACTO
========================================= */

function downloadContact() {

  const vCard =
    generateVCard();

  const blob =
    new Blob(
      [vCard],
      {
        type:
          "text/vcard;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href =
    url;

  link.download =
    "Juan-Miguel-Estrada.vcf";


  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);


  setTimeout(
    () => {

      URL.revokeObjectURL(url);

    },
    1500
  );

}


/* =========================================
   COMPARTIR
========================================= */

async function shareCard() {

  const url =
    getCardUrl();


  const shareData = {

    title:
      `${CONFIG.nombre} | ${CONFIG.empresa}`,

    text:
      `${CONFIG.nombre}\n${CONFIG.puesto} | ${CONFIG.empresa}`,

    url:
      url

  };


  /*
    Web Share API funciona principalmente
    en HTTPS y dispositivos compatibles.
  */

  if (navigator.share) {

    try {

      await navigator.share(
        shareData
      );

      return;

    }

    catch (error) {

      /*
        Si el usuario cancela,
        no mostrar error.
      */

      if (
        error &&
        error.name === "AbortError"
      ) {

        return;

      }

    }

  }


  /*
    Si Web Share no funciona,
    intentamos copiar.
  */

  await copyCardUrl(url);

}


/* =========================================
   COPIAR ENLACE
========================================= */

async function copyCardUrl(url) {

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    try {

      await navigator.clipboard.writeText(
        url
      );

      showToast(
        "Enlace copiado"
      );

      return;

    }

    catch (error) {

      /*
        Continuar al modo manual
      */

    }

  }


  openShareModal(url);

}


/* =========================================
   MODAL MANUAL
========================================= */

function openShareModal(url) {

  elements.shareUrlInput.value =
    url;

  elements.shareFallback.classList.add(
    "active"
  );

  elements.shareFallback.setAttribute(
    "aria-hidden",
    "false"
  );


  setTimeout(
    () => {

      elements.shareUrlInput.focus();

      elements.shareUrlInput.select();

    },
    100
  );

}


function closeShareModal() {

  elements.shareFallback.classList.remove(
    "active"
  );

  elements.shareFallback.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================================
   COPIAR DESDE MODAL
========================================= */

async function copyFromModal() {

  const url =
    elements.shareUrlInput.value;


  try {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(
        url
      );

      closeShareModal();

      showToast(
        "Enlace copiado"
      );

      return;

    }

  }

  catch (error) {

    /*
      Utilizar método alternativo.
    */

  }


  elements.shareUrlInput.focus();

  elements.shareUrlInput.select();


  try {

    const success =
      document.execCommand("copy");

    if (success) {

      closeShareModal();

      showToast(
        "Enlace copiado"
      );

    }

    else {

      showToast(
        "Selecciona y copia el enlace"
      );

    }

  }

  catch (error) {

    showToast(
      "Selecciona y copia el enlace"
    );

  }

}


/* =========================================
   NOTIFICACIONES
========================================= */

let toastTimer;


function showToast(message) {

  clearTimeout(
    toastTimer
  );


  elements.toast.textContent =
    message;


  elements.toast.classList.add(
    "show"
  );


  toastTimer =
    setTimeout(
      () => {

        elements.toast.classList.remove(
          "show"
        );

      },
      2500
    );

}


/* =========================================
   EVENTOS
========================================= */

elements.saveContact.addEventListener(
  "click",
  downloadContact
);


elements.shareContact.addEventListener(
  "click",
  shareCard
);


elements.closeModal.addEventListener(
  "click",
  closeShareModal
);


elements.copyUrlButton.addEventListener(
  "click",
  copyFromModal
);


elements.shareFallback.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      elements.shareFallback
    ) {

      closeShareModal();

    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      closeShareModal();

    }

  }
);


/* =========================================
   INICIAR
========================================= */

loadContactData();