import { Transaction } from './Transaction.js';

/**
 * Modelo para manejar el portafolio completo de inversiones
 */
export class Portfolio {
    constructor(transactions = []) {
        this.transactions = transactions.map(t => 
            t instanceof Transaction ? t : Transaction.fromJSON(t)
        );
    }

    /**
     * Agrega una transacción al portafolio
     * @param {Transaction} transaction
     */
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    /**
     * Elimina una transacción
     * @param {string} transactionId
     */
    removeTransaction(transactionId) {
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
    }

    /**
     * Obtiene el total de USD invertido
     * @returns {number}
     */
    getTotalUSD() {
        return this.transactions.reduce((sum, t) => sum + t.amountUSD, 0);
    }

    /**
     * Obtiene el total invertido en BOB (incluyendo comisiones)
     * @returns {number}
     */
    getTotalInvestedBOB() {
        return this.transactions.reduce((sum, t) => sum + t.getTotalBOB(), 0);
    }

    /**
     * Calcula el costo promedio por dólar
     * @returns {number}
     */
    getAverageCostPerUSD() {
        const totalUSD = this.getTotalUSD();
        if (totalUSD === 0) return 0;
        return this.getTotalInvestedBOB() / totalUSD;
    }

    /**
     * Calcula el valor actual del portafolio
     * @param {number} currentRate - Tasa actual BOB/USD
     * @returns {number}
     */
    getCurrentValue(currentRate) {
        return this.getTotalUSD() * currentRate;
    }

    /**
     * Calcula ganancia/pérdida total
     * @param {number} currentRate - Tasa actual BOB/USD
     * @returns {number}
     */
    getTotalProfitLoss(currentRate) {
        return this.getCurrentValue(currentRate) - this.getTotalInvestedBOB();
    }

    /**
     * Calcula ROI total
     * @param {number} currentRate - Tasa actual BOB/USD
     * @returns {number}
     */
    getTotalROI(currentRate) {
        const totalInvested = this.getTotalInvestedBOB();
        if (totalInvested === 0) return 0;
        return (this.getTotalProfitLoss(currentRate) / totalInvested) * 100;
    }

    /**
     * Agrupa transacciones por ubicación
     * @returns {Object}
     */
    groupByLocation() {
        const groups = {};
        this.transactions.forEach(t => {
            if (!groups[t.location]) {
                groups[t.location] = [];
            }
            groups[t.location].push(t);
        });
        return groups;
    }

    /**
     * Obtiene las tasas únicas de compra para una ubicación específica
     * @param {string} location - Ubicación a filtrar (null para todas)
     * @returns {number[]} Array de tasas únicas ordenadas
     */
    getUniqueRatesByLocation(location) {
        let transactions = this.transactions;
        
        if (location && location !== 'all') {
            transactions = this.filterByLocation(location);
        }
        
        const rates = new Set();
        transactions.forEach(t => {
            rates.add(t.rateBOB);
        });
        
        // Convertir a array y ordenar
        return Array.from(rates).sort((a, b) => a - b);
    }

    /**
     * Filtra transacciones por ubicación
     * @param {string} location - Ubicación a filtrar (null para todas)
     * @returns {Transaction[]}
     */
    filterByLocation(location) {
        if (!location || location === 'all') {
            return this.transactions;
        }
        return this.transactions.filter(t => t.location === location);
    }

    /**
     * Filtra transacciones por tasa específica
     * @param {number} rate - Tasa exacta a filtrar (null para todas)
     * @returns {Transaction[]}
     */
    filterByRate(rate) {
        if (rate === null || rate === undefined) {
            return this.transactions;
        }
        return this.transactions.filter(t => t.rateBOB === rate);
    }

    /**
     * Filtra transacciones por múltiples criterios
     * @param {Object} filters - Objeto con filtros: { location, rate }
     * @returns {Transaction[]}
     */
    filterTransactions(filters = {}) {
        let filtered = [...this.transactions];

        // Filtrar por ubicación
        if (filters.location && filters.location !== 'all') {
            filtered = filtered.filter(t => t.location === filters.location);
        }

        // Filtrar por tasa específica
        if (filters.rate !== null && filters.rate !== undefined) {
            filtered = filtered.filter(t => t.rateBOB === filters.rate);
        }

        return filtered;
    }

    /**
     * Obtiene estadísticas del portafolio con filtros opcionales
     * @param {number} currentRate - Tasa actual BOB/USD
     * @param {Object} filters - Filtros opcionales: { location, rate }
     * @returns {Object}
     */
    getStatistics(currentRate, filters = {}) {
        // Verificar si hay filtros activos (no null/undefined)
        const hasActiveFilters = filters && (
            (filters.location !== null && filters.location !== undefined) ||
            (filters.rate !== null && filters.rate !== undefined)
        );

        // Aplicar filtros si existen
        const filteredTransactions = hasActiveFilters
            ? this.filterTransactions(filters)
            : this.transactions;

        // Crear un portafolio temporal con transacciones filtradas
        const filteredPortfolio = new Portfolio(filteredTransactions);

        return {
            totalUSD: filteredPortfolio.getTotalUSD(),
            totalInvestedBOB: filteredPortfolio.getTotalInvestedBOB(),
            currentValueBOB: filteredPortfolio.getCurrentValue(currentRate),
            profitLoss: filteredPortfolio.getTotalProfitLoss(currentRate),
            roi: filteredPortfolio.getTotalROI(currentRate),
            averageCostPerUSD: filteredPortfolio.getAverageCostPerUSD(),
            transactionCount: filteredTransactions.length
        };
    }
}

