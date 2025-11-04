/**
 * Servicio para manejar el tema (modo oscuro/claro)
 */
export class ThemeService {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.applyTheme(this.currentTheme);
    }

    /**
     * Obtiene el tema del sistema
     * @returns {string}
     */
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Obtiene el tema guardado en localStorage
     * @returns {string|null}
     */
    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    /**
     * Guarda el tema en localStorage
     * @param {string} theme
     */
    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    /**
     * Aplica el tema al documento
     * @param {string} theme
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
    }

    /**
     * Alterna entre modo oscuro y claro
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        return newTheme;
    }

    /**
     * Obtiene el tema actual
     * @returns {string}
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Inicializa el listener para cambios del sistema
     */
    initSystemThemeListener() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Solo actualizar si no hay tema guardado manualmente
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

