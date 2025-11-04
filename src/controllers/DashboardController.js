import { ExchangeRate } from '../models/ExchangeRate.js';
import { DashboardView } from '../views/DashboardView.js';
import { ApiService } from '../services/ApiService.js';
import { StorageService } from '../services/StorageService.js';
import { Portfolio } from '../models/Portfolio.js';

/**
 * Controlador del Dashboard
 */
export class DashboardController {
    constructor() {
        this.view = new DashboardView();
        this.apiService = new ApiService();
        this.storageService = new StorageService();
        this.currentRate = null;
        this.portfolio = new Portfolio();
        this.allRates = null;
        this.autoUpdateInterval = null;
    }

    /**
     * Inicializa el controlador
     */
    async init() {
        await this.storageService.init();
        
        // Cargar datos
        await this.loadTransactions();
        await this.loadExchangeRate();

        // Bind de eventos
        this.view.bindEvents(
            () => this.refreshRates(),
            () => this.onAddTransaction()
        );

        // Actualizar vista inicial
        this.updateView();

        // Iniciar actualización automática cada 30 segundos
        this.startAutoUpdate();
    }

    /**
     * Inicia la actualización automática de tasas
     */
    startAutoUpdate() {
        // Limpiar intervalo anterior si existe
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
        }

        // Actualizar cada 30 segundos
        this.autoUpdateInterval = setInterval(() => {
            this.refreshRates();
        }, 30000); // 30 segundos
    }

    /**
     * Detiene la actualización automática
     */
    stopAutoUpdate() {
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
            this.autoUpdateInterval = null;
        }
    }

    /**
     * Carga las transacciones desde el almacenamiento
     */
    async loadTransactions() {
        try {
            const transactionsData = await this.storageService.getAllTransactions();
            this.portfolio = new Portfolio(transactionsData);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    /**
     * Carga la tasa de cambio (desde cache o API)
     */
    async loadExchangeRate() {
        try {
            // Intentar cargar desde cache
            const cached = await this.storageService.getCachedRate();
            if (cached && new Date(cached.timestamp) > new Date(Date.now() - 5 * 60 * 1000)) {
                this.currentRate = new ExchangeRate(
                    cached.rate,
                    cached.source,
                    new Date(cached.timestamp)
                );
                return;
            }

            // Si no hay cache válido, obtener de API
            await this.refreshRates();
        } catch (error) {
            console.error('Error loading exchange rate:', error);
            this.view.showError('No se pudo cargar la tasa de cambio');
        }
    }

    /**
     * Actualiza las tasas de cambio desde la API
     */
    async refreshRates() {
        try {
            this.view.showLoading();

            // Obtener todas las tasas (oficial, mercado negro y promedio)
            const ratesData = await this.apiService.getAllRates();
            this.allRates = ratesData;

            // Usar la tasa del mercado negro como principal para cálculos (más realista)
            // Si no hay mercado negro, usar la oficial
            if (ratesData.blackMarket) {
                this.currentRate = new ExchangeRate(
                    ratesData.blackMarket.rate,
                    ratesData.blackMarket.source,
                    ratesData.blackMarket.timestamp
                );
            } else if (ratesData.official) {
                this.currentRate = new ExchangeRate(
                    ratesData.official.rate,
                    ratesData.official.source,
                    ratesData.official.timestamp
                );
            } else if (ratesData.blackMarket) {
                this.currentRate = new ExchangeRate(
                    ratesData.blackMarket.rate,
                    ratesData.blackMarket.source,
                    ratesData.blackMarket.timestamp
                );
            }

            // Guardar en cache
            if (this.currentRate) {
                await this.storageService.saveRate({
                    rate: this.currentRate.rate,
                    source: this.currentRate.source
                });
            }

            // Notificar actualización
            if (this.currentRate) {
                window.dispatchEvent(new CustomEvent('rate-refreshed', {
                    detail: { rate: this.currentRate }
                }));
            }

            this.updateView();
        } catch (error) {
            console.error('Error refreshing rates:', error);
            this.view.showError(error.message || 'No se pudo actualizar la tasa de cambio');
        } finally {
            this.view.hideLoading();
        }
    }

    /**
     * Actualiza la vista con los datos actuales
     */
    updateView() {
        if (!this.allRates) {
            return;
        }

        // Actualizar todas las tasas en la vista
        this.view.updateAllRates(this.allRates);

        // Usar tasa del mercado negro para cálculos del portafolio (más realista)
        // Si no hay mercado negro, usar la oficial
        const rateForCalculations = this.currentRate?.rate || 
                                   (this.allRates.blackMarket?.rate || this.allRates.official?.rate || 0);

        // Actualizar resumen del portafolio
        const statistics = this.portfolio.getStatistics(rateForCalculations);
        this.view.updatePortfolioSummary(statistics);
    }

    /**
     * Handler para agregar transacción (dispara evento global)
     */
    onAddTransaction() {
        // Disparar evento personalizado para que TransactionController lo maneje
        window.dispatchEvent(new CustomEvent('show-transaction-modal'));
    }

    /**
     * Actualiza el portafolio (se llama desde TransactionController)
     */
    async updatePortfolio() {
        await this.loadTransactions();
        this.updateView();
    }

    /**
     * Obtiene la tasa actual
     * @returns {ExchangeRate|null}
     */
    getCurrentRate() {
        return this.currentRate;
    }
}

