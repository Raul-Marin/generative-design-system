const ageInput = document.getElementById('age-input');
const ageDisplay = document.getElementById('age-display');
const tasteInput = document.getElementById('taste-input');

// New Inputs
const dyslexiaToggle = document.getElementById('dyslexia-toggle');
const batteryInput = document.getElementById('battery-input');
const batteryDisplay = document.getElementById('battery-display');
const lightInput = document.getElementById('light-input');
const lightDisplay = document.getElementById('light-display');

const paramFont = document.getElementById('param-font');
const paramRadius = document.getElementById('param-radius');
const paramContrast = document.getElementById('param-contrast');

const root = document.documentElement;

// Event Listeners
ageInput.addEventListener('input', updateSystem);
tasteInput.addEventListener('change', updateSystem);
dyslexiaToggle.addEventListener('change', updateSystem);
batteryInput.addEventListener('input', updateSystem);
lightInput.addEventListener('input', updateSystem);

// Initial call
updateSystem();

function updateSystem() {
    const age = parseInt(ageInput.value);
    const taste = tasteInput.value;
    const isDyslexic = dyslexiaToggle.checked;
    const battery = parseInt(batteryInput.value);
    const lux = parseInt(lightInput.value);

    ageDisplay.innerText = age;
    batteryDisplay.innerText = battery;
    lightDisplay.innerText = lux;

    // --- 1. Age Logic (Accessibility & Ergonomics) ---
    let baseSize = 16;
    let spacing = 1;
    let contrastMode = 'normal';

    if (age < 25) {
        baseSize = 14;
        spacing = 0.875;
    } else if (age > 50) {
        baseSize = 18 + ((age - 50) / 10);
        spacing = 1.25;
        contrastMode = 'high';
    } else {
        baseSize = 16;
        spacing = 1;
    }

    if (baseSize > 24) baseSize = 24;

    // --- 2. Dyslexia Logic ---
    if (isDyslexic) {
        document.body.classList.add('dyslexic-mode');
        // Dyslexia often benefits from slightly larger text
        baseSize = Math.max(baseSize, 18);
    } else {
        document.body.classList.remove('dyslexic-mode');
    }

    // --- 3. Battery Logic (Power Saving) ---
    if (battery < 20) {
        document.body.classList.add('power-saving-mode');
    } else {
        document.body.classList.remove('power-saving-mode');
    }

    // --- 4. Ambient Light Logic (Dark/Light Mode) ---
    // Simple logic: < 300 lux = Dark Mode, > 300 lux = Light Mode
    // If battery is low, force Dark Mode to save energy (on OLEDs)
    let forceDark = (lux < 300) || (battery < 20);

    // Apply Age Variables
    root.style.setProperty('--font-size-base', `${baseSize}px`);
    root.style.setProperty('--spacing-unit', `${spacing}rem`);

    paramFont.innerText = `${Math.round(baseSize)}px`;

    // --- 5. Taste Logic (Aesthetics) ---
    const theme = getTheme(taste, forceDark);

    // Apply Theme Variables
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--bg-color', theme.bg);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--border-color', theme.border);

    // Only set font family if NOT dyslexic mode (handled by class)
    if (!isDyslexic) {
        root.style.setProperty('--font-family', theme.font);
    }

    root.style.setProperty('--border-radius', theme.radius);
    root.style.setProperty('--border-width', theme.borderWidth);
    root.style.setProperty('--shadow', theme.shadow);

    paramRadius.innerText = theme.radius;

    // Contrast Adjustments
    if (contrastMode === 'high' || lux > 800) { // High lux also triggers high contrast
        paramContrast.innerText = "High";
        root.style.setProperty('--text-color', forceDark ? '#ffffff' : '#000000');
        root.style.setProperty('--border-color', forceDark ? '#ffffff' : '#000000');
    } else {
        paramContrast.innerText = "Normal";
    }

    updateTokenViewer();
}

function updateTokenViewer() {
    const styles = getComputedStyle(root);

    document.getElementById('token-primary').innerText = styles.getPropertyValue('--primary-color').trim();
    document.getElementById('token-bg').innerText = styles.getPropertyValue('--bg-color').trim();

    // Font family cleanup for display
    let font = styles.getPropertyValue('--font-family').trim();
    font = font.split(',')[0].replace(/['"]/g, '');
    document.getElementById('token-font').innerText = font;

    document.getElementById('token-size').innerText = styles.getPropertyValue('--font-size-base').trim();
    document.getElementById('token-radius').innerText = styles.getPropertyValue('--border-radius').trim();
    document.getElementById('token-spacing').innerText = styles.getPropertyValue('--spacing-unit').trim();
}

function getTheme(taste, isDark) {
    const base = getBaseTheme(taste);

    if (isDark) {
        return {
            ...base,
            bg: '#0f172a',
            surface: '#1e293b',
            text: '#f8fafc',
            border: '#334155',
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
        };
    }

    return base;
}

function getBaseTheme(taste) {
    switch (taste) {
        case 'minimal':
            return {
                primary: '#171717',
                secondary: '#737373',
                bg: '#ffffff',
                surface: '#fafafa',
                text: '#171717',
                border: '#e5e5e5',
                font: "'Inter', sans-serif",
                radius: '4px',
                borderWidth: '1px',
                shadow: 'none'
            };

        case 'bold':
            return {
                primary: '#ff4d00',
                secondary: '#000000',
                bg: '#f3f4f6',
                surface: '#ffffff',
                text: '#000000',
                border: '#000000',
                font: "'Space Grotesk', sans-serif",
                radius: '0px',
                borderWidth: '3px',
                shadow: '6px 6px 0px #000000'
            };

        case 'playful':
            return {
                primary: '#ec4899',
                secondary: '#8b5cf6',
                bg: '#fff1f2',
                surface: '#ffffff',
                text: '#4c0519',
                border: '#fbcfe8',
                font: "'Nunito', sans-serif",
                radius: '24px',
                borderWidth: '2px',
                shadow: '0 10px 25px -5px rgba(236, 72, 153, 0.3)'
            };

        case 'corporate':
        default:
            return {
                primary: '#0f766e',
                secondary: '#64748b',
                bg: '#f8fafc',
                surface: '#ffffff',
                text: '#0f172a',
                border: '#cbd5e1',
                font: "'Merriweather', serif",
                radius: '6px',
                borderWidth: '1px',
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            };
    }
}
