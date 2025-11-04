/**
 * Vista del Dashboard
 */
export class DashboardView {
    constructor() {
        this.elements = {
            // Official rate
            officialRate: document.getElementById('official-rate'),
            officialRateSource: document.getElementById('official-rate-source'),
            officialRateLastUpdate: document.getElementById('official-rate-last-update'),
            officialBuy: document.getElementById('official-buy'),
            officialSell: document.getElementById('official-sell'),
            // Black market rate
            blackmarketRate: document.getElementById('blackmarket-rate'),
            blackmarketRateSource: document.getElementById('blackmarket-rate-source'),
            blackmarketRateLastUpdate: document.getElementById('blackmarket-rate-last-update'),
            blackmarketBuy: document.getElementById('blackmarket-buy'),
            blackmarketSell: document.getElementById('blackmarket-sell'),
            // Portfolio
            totalInvested: document.getElementById('total-invested'),
            currentValue: document.getElementById('current-value'),
            profitLoss: document.getElementById('profit-loss'),
            roi: document.getElementById('roi'),
            // Actions
            refreshRatesBtn: document.getElementById('refresh-rates-btn'),
            addTransactionBtn: document.getElementById('add-transaction-btn'),
            // Filters
            filterLocation: document.getElementById('filter-location'),
            filterRate: document.getElementById('filter-rate'),
            clearFiltersBtn: document.getElementById('clear-filters-btn'),
            filterCount: document.getElementById('filter-count')
        };
    }

    /**
     * Actualiza todas las tasas mostradas
     * @param {Object} ratesData - Objeto con official, blackMarket y average
     */
    updateAllRates(ratesData) {
        const formatRate = (rate) => {
            if (!rate) return '--';
            return typeof rate === 'number' ? rate.toFixed(2) : rate;
        };

        const getTimeAgo = (timestamp) => {
            if (!timestamp) return '';
            const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
            const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
            if (seconds < 60) return 'hace unos segundos';
            if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
            if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
            return `hace ${Math.floor(seconds / 86400)}d`;
        };

        // Tasa oficial
        if (ratesData.official) {
            if (this.elements.officialRate) {
                this.elements.officialRate.textContent = formatRate(ratesData.official.rate);
            }
            if (this.elements.officialRateSource) {
                this.elements.officialRateSource.textContent = ratesData.official.source || 'ExchangeRate-API';
            }
            if (this.elements.officialRateLastUpdate) {
                this.elements.officialRateLastUpdate.textContent = getTimeAgo(ratesData.official.timestamp);
            }
            // Compra/Venta oficial
            if (this.elements.officialBuy && ratesData.official.buyPrice) {
                this.elements.officialBuy.textContent = formatRate(ratesData.official.buyPrice) + ' BOB';
            }
            if (this.elements.officialSell && ratesData.official.sellPrice) {
                this.elements.officialSell.textContent = formatRate(ratesData.official.sellPrice) + ' BOB';
            }
        }

        // Tasa mercado negro
        if (ratesData.blackMarket) {
            if (this.elements.blackmarketRate) {
                this.elements.blackmarketRate.textContent = formatRate(ratesData.blackMarket.rate);
            }
            if (this.elements.blackmarketRateSource) {
                this.elements.blackmarketRateSource.textContent = ratesData.blackMarket.source || 'Binance';
            }
            if (this.elements.blackmarketRateLastUpdate) {
                this.elements.blackmarketRateLastUpdate.textContent = getTimeAgo(ratesData.blackMarket.timestamp);
            }
            // COMPRA: precio al comprar dólares (más alto - lo que pagas)
            if (this.elements.blackmarketBuy && ratesData.blackMarket.buyPrice) {
                this.elements.blackmarketBuy.textContent = formatRate(ratesData.blackMarket.buyPrice) + ' BOB';
            }
            // VENTA: precio al vender dólares (más bajo - lo que recibes)
            if (this.elements.blackmarketSell && ratesData.blackMarket.sellPrice) {
                this.elements.blackmarketSell.textContent = formatRate(ratesData.blackMarket.sellPrice) + ' BOB';
            }
        }

    }

    /**
     * Actualiza el resumen del portafolio
     * @param {Object} statistics - Estadísticas del portafolio
     */
    updatePortfolioSummary(statistics) {
        const formatCurrency = (value) => {
            return new Intl.NumberFormat('es-BO', {
                style: 'currency',
                currency: 'BOB',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        };

        const formatPercent = (value) => {
            return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
        };

        if (this.elements.totalInvested) {
            this.elements.totalInvested.textContent = formatCurrency(statistics.totalInvestedBOB);
        }
        if (this.elements.currentValue) {
            this.elements.currentValue.textContent = formatCurrency(statistics.currentValueBOB);
        }
        if (this.elements.profitLoss) {
            const profitLoss = statistics.profitLoss;
            this.elements.profitLoss.textContent = formatCurrency(profitLoss);
            this.elements.profitLoss.className = 'summary-value ' + (profitLoss >= 0 ? 'positive' : 'negative');
        }
        if (this.elements.roi) {
            const roi = statistics.roi;
            this.elements.roi.textContent = formatPercent(roi);
            this.elements.roi.className = 'summary-value ' + (roi >= 0 ? 'positive' : 'negative');
        }
    }

    /**
     * Muestra estado de carga
     */
    showLoading() {
        if (this.elements.refreshRatesBtn) {
            this.elements.refreshRatesBtn.disabled = true;
            const svg = this.elements.refreshRatesBtn.querySelector('svg');
            if (svg) {
                svg.style.animation = 'spin 1s linear infinite';
            }
        }
    }

    /**
     * Oculta estado de carga
     */
    hideLoading() {
        if (this.elements.refreshRatesBtn) {
            this.elements.refreshRatesBtn.disabled = false;
            const svg = this.elements.refreshRatesBtn.querySelector('svg');
            if (svg) {
                svg.style.animation = '';
            }
        }
    }

    /**
     * Muestra un error
     * @param {string} message
     */
    showError(message) {
        // Por ahora, console.error. Podríamos agregar un toast/alert después
        console.error(message);
        alert(message);
    }

    /**
     * Obtiene los valores actuales de los filtros
     * @returns {Object}
     */
    getFilters() {
        const location = this.elements.filterLocation?.value || 'all';
        const rate = this.elements.filterRate?.value 
            ? parseFloat(this.elements.filterRate.value) 
            : null;

        return {
            location: location === 'all' ? null : location,
            rate: rate !== null && !isNaN(rate) ? rate : null
        };
    }

    /**
     * Actualiza las opciones del selector de tasa según la ubicación seleccionada
     * @param {number[]} rates - Array de tasas únicas
     */
    updateRateOptions(rates) {
        const select = this.elements.filterRate;
        if (!select) return;

        // Limpiar opciones existentes (excepto la primera)
        select.innerHTML = '<option value="">Todas las tasas</option>';

        if (rates && rates.length > 0) {
            // Habilitar el selector
            select.disabled = false;
            rates.forEach(rate => {
                const option = document.createElement('option');
                option.value = rate;
                option.textContent = `${rate.toFixed(2)} BOB/USD`;
                select.appendChild(option);
            });
        } else {
            // Si no hay tasas, deshabilitar el selector y mostrar mensaje
            select.disabled = true;
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay transacciones con este tipo';
            select.appendChild(option);
        }
    }

    /**
     * Limpia todos los filtros
     */
    clearFilters() {
        if (this.elements.filterLocation) {
            this.elements.filterLocation.value = 'all';
        }
        if (this.elements.filterRate) {
            this.elements.filterRate.value = '';
            this.elements.filterRate.disabled = false;
        }
        // Actualizar opciones de tasa cuando se limpia
        if (this.onLocationChange) {
            this.onLocationChange();
        }
    }

    /**
     * Actualiza el contador de transacciones filtradas
     * @param {number} count
     */
    updateFilterCount(count) {
        if (this.elements.filterCount) {
            this.elements.filterCount.textContent = count;
        }
    }

    /**
     * Bind de eventos
     * @param {Function} onRefreshRates
     * @param {Function} onAddTransaction
     * @param {Function} onFiltersChange
     * @param {Function} onClearFilters
     */
    bindEvents(onRefreshRates, onAddTransaction, onFiltersChange, onClearFilters) {
        if (this.elements.refreshRatesBtn) {
            this.elements.refreshRatesBtn.addEventListener('click', onRefreshRates);
        }
        if (this.elements.addTransactionBtn) {
            this.elements.addTransactionBtn.addEventListener('click', onAddTransaction);
        }
        
        // Eventos de filtros
        if (this.elements.filterLocation) {
            this.elements.filterLocation.addEventListener('change', () => {
                // Cuando cambia la ubicación, actualizar las tasas disponibles
                if (onFiltersChange) {
                    // Primero actualizar las opciones de tasa, luego aplicar filtros
                    if (this.onLocationChange) {
                        this.onLocationChange();
                    }
                    onFiltersChange();
                }
            });
        }
        if (this.elements.filterRate) {
            this.elements.filterRate.addEventListener('change', onFiltersChange);
        }
        if (this.elements.clearFiltersBtn) {
            this.elements.clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
                if (onClearFilters) {
                    onClearFilters();
                }
            });
        }
    }
}

