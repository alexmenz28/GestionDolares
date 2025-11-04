import { DashboardController } from './controllers/DashboardController.js';
import { TransactionController } from './controllers/TransactionController.js';
import { ThemeService } from './services/ThemeService.js';

/**
 * Aplicación principal - Orquesta todos los controladores
 */
class App {
    constructor() {
        this.dashboardController = null;
        this.transactionController = null;
        this.currentView = 'dashboard';
        this.themeService = new ThemeService();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        try {
            // Mostrar loading
            this.showLoading();

            // Inicializar controladores
            this.dashboardController = new DashboardController();
            this.transactionController = new TransactionController();

            await Promise.all([
                this.dashboardController.init(),
                this.transactionController.init()
            ]);

            // Sincronizar tasa actual entre controladores
            const currentRate = this.dashboardController.getCurrentRate();
            if (currentRate) {
                this.transactionController.setCurrentRate(currentRate.rate);
                window.dispatchEvent(new CustomEvent('rate-updated', {
                    detail: { rate: currentRate }
                }));
            }
            
            // Escuchar actualizaciones de tasa del dashboard
            window.addEventListener('rate-refreshed', (e) => {
                const rate = e.detail.rate;
                this.transactionController.setCurrentRate(rate.rate);
            });

            // Configurar navegación entre vistas
            this.setupNavigation();

            // Configurar tema
            this.setupTheme();

            // Escuchar actualizaciones del portafolio
            window.addEventListener('portfolio-updated', async () => {
                await this.dashboardController.updatePortfolio();
                const currentRate = this.dashboardController.getCurrentRate();
                if (currentRate) {
                    this.transactionController.setCurrentRate(currentRate.rate);
                }
            });

            // Escuchar actualizaciones de tasa
            window.addEventListener('rate-updated', (e) => {
                this.transactionController.setCurrentRate(e.detail.rate.rate);
            });

        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Error al inicializar la aplicación. Por favor recarga la página.');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Configura la navegación entre vistas
     */
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const views = document.querySelectorAll('.view');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const viewName = button.dataset.view;

                // Actualizar botones activos
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Mostrar/ocultar vistas
                views.forEach(view => view.classList.remove('active'));
                const targetView = document.getElementById(`${viewName}-view`);
                if (targetView) {
                    targetView.classList.add('active');
                }

                this.currentView = viewName;
            });
        });
    }

    /**
     * Configura el sistema de temas
     */
    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.themeService.toggleTheme();
            });
        }

        // Inicializar listener para cambios del sistema
        this.themeService.initSystemThemeListener();
    }

    /**
     * Muestra el overlay de carga
     */
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    /**
     * Oculta el overlay de carga
     */
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init().catch(error => {
        console.error('Fatal error:', error);
    });
});

