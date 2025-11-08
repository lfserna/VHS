// script.js - edición rápida de enlaces y funcionalidades pequeñas

// Datos de ejemplo que puedes modificar
const profile = {
  name: 'VHS',
  bio: 'Canal de streaming de Bolivia',
  avatar: 'https://via.placeholder.com/120',
  links: [
    { title: 'Twitter', url: 'https://twitter.com/' },
    { title: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { title: 'GitHub', url: 'https://github.com/' },
    { title: 'Correo', url: 'mailto:tu@correo.com' }
  ]
};

// Renderiza el perfil y los enlaces
function render() {
  document.getElementById('displayName').textContent = profile.name;
  document.getElementById('bio').textContent = profile.bio;
  document.getElementById('avatar').src = profile.avatar;

  const linksEl = document.getElementById('links');
  linksEl.innerHTML = '';
  profile.links.forEach(l => {
    const a = document.createElement('a');
    a.className = 'link-item';
    a.href = l.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = l.title;
    linksEl.appendChild(a);
  });
}

// Helper para obtener elementos de forma segura
const $ = id => document.getElementById(id);

// Copiar URL actual (útil si subes la página a Netlify / GitHub Pages / Vercel)
const copyBtnEl = $('copyBtn');
if (copyBtnEl) {
  copyBtnEl.addEventListener('click', async () => {
    try {
      const url = location.href;
      await navigator.clipboard.writeText(url);
      const original = copyBtnEl.textContent;
      copyBtnEl.textContent = 'Copiado ✓';
      setTimeout(() => copyBtnEl.textContent = original, 1500);
    } catch (e) {
      alert('No se pudo copiar automáticamente. Copia la URL desde la barra del navegador.');
    }
  });
}

// Toggle tema
const themeBtn = $('themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeBtn.textContent = document.body.classList.contains('dark') ? 'Modo claro' : 'Modo oscuro';
  });
}

// Inicializa: por defecto NO sobrescribimos el HTML que pongas en index.html.
// Si quieres que el script reemplace el contenido con los datos de `profile`,
// añade el atributo `data-managed="true"` en el <body> de `index.html`:
//   <body data-managed="true">
const JS_MANAGED = document.body && document.body.dataset && document.body.dataset.managed === 'true';

if (JS_MANAGED) {
  render();
} else {
  console.log('script.js: modo no gestionado por JS — el script no sobrescribirá el contenido de index.html. Para permitir que el script reemplace el contenido, añade data-managed="true" al <body>.');
}
