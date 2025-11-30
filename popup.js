// Wait for the HTML to be fully loaded before running logic
document.addEventListener('DOMContentLoaded', function() {
  
  // --- DOM ELEMENTS REFERENCE ---
  const btnGenerate = document.getElementById('btnGenerate');
  const btnCopy = document.getElementById('btnCopy');
  const seedInput = document.getElementById('seedInput');
  const serviceInput = document.getElementById('serviceInput'); 
  const lengthInput = document.getElementById('lengthInput');
  const passwordOutput = document.getElementById('passwordOutput');
  const status = document.getElementById('status');
  
  // Language Flags
  const langEs = document.getElementById('langEs');
  const langEn = document.getElementById('langEn');
  
  // Eye Toggle & Timer variable
  const toggleSeed = document.getElementById('toggleSeed');
  let hideTimeout; // Stores the timer ID to auto-hide password

  // --- SVG CONSTANTS ---
  // We store the raw SVG code here to inject it dynamically
  const svgEyeOpen = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  const svgEyeClosed = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

  // --- LANGUAGE DICTIONARY ---
  // Stores all text strings for English (en) and Spanish (es)
  const translations = {
    en: {
      seedLabel: "Master Seed (Your Secret):",
      seedPlaceholder: "Enter your passphrase...",
      serviceLabel: "Service Name (Domain):",
      servicePlaceholder: "e.g. gmail.com",
      lengthLabel: "Length:",
      // Note: Tooltip supports HTML tags
      tooltipHtml: "Standard length (16 chars) works for most sites. Change only if required. <br><strong>Important:</strong> You must remember the specific length to regenerate the password.",
      btnGenerate: "Generate Password",
      btnCopy: "Copy",
      donateText: "Donate via PayPal",
      statusReq: "Master Seed and Service Name are required.",
      statusGen: "Generated for",
      statusCopied: "Password Copied!"
    },
    es: {
      seedLabel: "Semilla Maestra (Tu Secreto):",
      seedPlaceholder: "Tu frase contraseña...",
      serviceLabel: "Nombre del Servicio (Dominio):",
      servicePlaceholder: "ej: gmail.com",
      lengthLabel: "Longitud:",
      tooltipHtml: "La longitud estándar (16) funciona casi siempre. Cámbialo solo si es necesario. <br><strong>Importante:</strong> Debes recordar la longitud elegida para regenerar el password.",
      btnGenerate: "Generar Password",
      btnCopy: "Copiar",
      donateText: "Donar con PayPal",
      statusReq: "Falta la Semilla Maestra o el Servicio.",
      statusGen: "Generado para",
      statusCopied: "¡Copiado al portapapeles!"
    }
  };

  // Default language
  let currentLang = 'en';

  // --- FUNCTION: CHANGE LANGUAGE ---
  function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // 1. Update text content (Labels, buttons, spans)
    document.querySelectorAll('[data-lang-key]').forEach(elem => {
      const key = elem.getAttribute('data-lang-key');
      if(t[key]) elem.innerHTML = t[key];
    });

    // 2. Update placeholders (Inputs)
    document.querySelectorAll('[data-lang-placeholder]').forEach(elem => {
      const key = elem.getAttribute('data-lang-placeholder');
      if(t[key]) elem.placeholder = t[key];
    });

    // 3. Visual update for Flag Buttons (Active/Inactive)
    if (lang === 'es') {
      langEs.classList.add('active');
      langEn.classList.remove('active');
    } else {
      langEn.classList.add('active');
      langEs.classList.remove('active');
    }
    
    // 4. Clear status message to avoid mixed language
    status.textContent = "";
  }

  // Event Listeners for Flags
  langEs.addEventListener('click', () => setLanguage('es'));
  langEn.addEventListener('click', () => setLanguage('en'));

  // --- LOGIC: SHOW/HIDE PASSWORD WITH TIMER ---
  toggleSeed.addEventListener('click', () => {
    const isPassword = seedInput.type === 'password';

    if (isPassword) {
      // Action: SHOW PASSWORD
      seedInput.type = 'text';
      toggleSeed.innerHTML = svgEyeClosed; // Switch SVG to "Crossed Eye"
      toggleSeed.style.opacity = "1"; // Highlight icon
      
      // Clear previous timer if the user clicks quickly
      clearTimeout(hideTimeout);
      
      // Security Feature: Auto-hide after 5 seconds
      hideTimeout = setTimeout(() => {
        seedInput.type = 'password';
        toggleSeed.innerHTML = svgEyeOpen; // Switch SVG back to "Open Eye"
        toggleSeed.style.opacity = "0.6";
      }, 5000); 

    } else {
      // Action: HIDE PASSWORD (Manual click)
      seedInput.type = 'password';
      toggleSeed.innerHTML = svgEyeOpen;
      toggleSeed.style.opacity = "0.6";
      clearTimeout(hideTimeout); // Cancel auto-hide timer
    }
  });

  // --- CORE LOGIC: MAP HASH TO SAFE CHARACTERS ---
  function generatePasswordFromBuffer(buffer, length) {
    // Defined "Safe Set" of characters (Max compatibility, no ambiguous chars like quotes)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*-_+=";
    
    let password = '';
    const bytes = new Uint8Array(buffer); // Convert hash to bytes
    
    for (let i = 0; i < length; i++) {
      // Use modulo math to map byte to character set
      const byte = bytes[i % bytes.length]; 
      const charIndex = byte % chars.length;
      password += chars[charIndex];
    }
    
    return password;
  }

  // --- EVENT: GENERATE PASSWORD ---
  btnGenerate.addEventListener('click', async () => {
    const seed = seedInput.value.trim();
    const service = serviceInput.value.trim().toLowerCase(); // Normalize service to lowercase
    
    // Validate length
    let desiredLength = parseInt(lengthInput.value);
    if (!desiredLength || desiredLength < 4) desiredLength = 16;
    if (desiredLength > 64) desiredLength = 64; 

    // Validate inputs
    if (!seed || !service) {
      status.textContent = translations[currentLang].statusReq;
      status.style.color = "#e74c3c"; // Red error color
      return;
    }

    // 1. Create Composite Seed (Salting)
    const compositeSeed = seed + "||" + service;
    
    // 2. Cryptography: Generate SHA-256 Hash
    const msgBuffer = new TextEncoder().encode(compositeSeed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
    // 3. Convert Hash to Human Readable Password
    const password = generatePasswordFromBuffer(hashBuffer, desiredLength);

    // 4. Output result
    passwordOutput.value = password;
    status.textContent = `${translations[currentLang].statusGen} ${service} (${desiredLength})`;
    status.style.color = "#27ae60"; // Green success color
  });

  // --- EVENT: COPY TO CLIPBOARD ---
  btnCopy.addEventListener('click', () => {
    const password = passwordOutput.value;
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        status.textContent = translations[currentLang].statusCopied;
        status.style.color = "#27ae60";
        // Clear message after 3 seconds
        setTimeout(() => status.textContent = "", 3000);
      });
    }
  });

  // --- EVENT: ALLOW 'ENTER' KEY TO TRIGGER GENERATE ---
  [seedInput, serviceInput, lengthInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btnGenerate.click();
    });
  });
});