const ageInput = document.getElementById('age-input');
const ageDisplay = document.getElementById('age-display');
const tasteInput = document.getElementById('taste-input');

const paramFont = document.getElementById('param-font');
const paramRadius = document.getElementById('param-radius');
const paramContrast = document.getElementById('param-contrast');

const root = document.documentElement;

// Event Listeners
ageInput.addEventListener('input', updateSystem);
tasteInput.addEventListener('change', updateSystem);

// Initial call
updateSystem();

function updateSystem() {
    const age = parseInt(ageInput.value);
    const taste = tasteInput.value;

    ageDisplay.innerText = age;

    // --- 1. Age Logic (Accessibility & Ergonomics) ---
    let baseSize = 16;
    let spacing = 1;
    let contrastMode = 'normal';

    if (age < 25) {
        // Young: Can handle smaller text, tighter interfaces
        baseSize = 14;
        spacing = 0.875;
    } else if (age > 50) {
        // Older: Needs larger text, more spacing, higher contrast
        baseSize = 18 + ((age - 50) / 10); // Grows with age
        spacing = 1.25;
        contrastMode = 'high';
    } else {
        // Middle
        baseSize = 16;
        spacing = 1;
    }

    // Cap max size
    if (baseSize > 24) baseSize = 24;

    // Apply Age Variables
    root.style.setProperty('--font-size-base', `${baseSize}px`);
    root.style.setProperty('--spacing-unit', `${spacing}rem`);

    paramFont.innerText = `${Math.round(baseSize)}px`;

    // --- 2. Taste Logic (Aesthetics) ---
    const theme = getTheme(taste);

    // Apply Theme Variables
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--bg-color', theme.bg);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--border-color', theme.border);
    root.style.setProperty('--font-family', theme.font);
    root.style.setProperty('--border-radius', theme.radius);
    root.style.setProperty('--border-width', theme.borderWidth);
    root.style.setProperty('--shadow', theme.shadow);

    paramRadius.innerText = theme.radius;

    // Contrast Adjustments for Age
    if (contrastMode === 'high') {
        paramContrast.innerText = "High (Age Adapted)";
        // Force higher contrast borders and text if age is high
        root.style.setProperty('--text-color', '#000000');
        root.style.setProperty('--border-color', '#000000');
        if (taste === 'minimal') {
            root.style.setProperty('--border-width', '2px');
        }
    } else {
        paramContrast.innerText = "Normal";
    }
}

function getTheme(taste) {
    switch (taste) {
        case 'minimal':
            return {
                primary: '#171717', // Black
                secondary: '#737373',
                bg: '#ffffff',
                surface: '#fafafa',
                text: '#171717',
                border: '#e5e5e5',
                font: "'Inter', sans-serif",
                radius: '4px',
                borderWidth: '1px',
                shadow: 'none' // Flat
            };

        case 'bold': // Brutalist
            return {
                primary: '#ff4d00', // Vibrant Orange
                secondary: '#000000',
                bg: '#f3f4f6',
                surface: '#ffffff',
                text: '#000000',
                border: '#000000',
                font: "'Space Grotesk', sans-serif",
                radius: '0px',
                borderWidth: '3px',
                shadow: '6px 6px 0px #000000' // Hard shadow
            };

        case 'playful':
            return {
                primary: '#ec4899', // Pink
                secondary: '#8b5cf6', // Purple
                bg: '#fff1f2',
                surface: '#ffffff',
                text: '#4c0519',
                border: '#fbcfe8',
                font: "'Nunito', sans-serif",
                radius: '24px', // Very round
                borderWidth: '2px',
                shadow: '0 10px 25px -5px rgba(236, 72, 153, 0.3)'
            };

        case 'corporate':
        default:
            return {
                primary: '#0f766e', // Teal/Blue
                secondary: '#64748b',
                bg: '#f8fafc',
                surface: '#ffffff',
                text: '#0f172a',
                border: '#cbd5e1',
                font: "'Merriweather', serif", // Serif for trust
                radius: '6px',
                borderWidth: '1px',
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            };
    }
}
