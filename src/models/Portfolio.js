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
     * Obtiene estadísticas del portafolio
     * @param {number} currentRate - Tasa actual BOB/USD
     * @returns {Object}
     */
    getStatistics(currentRate) {
        return {
            totalUSD: this.getTotalUSD(),
            totalInvestedBOB: this.getTotalInvestedBOB(),
            currentValueBOB: this.getCurrentValue(currentRate),
            profitLoss: this.getTotalProfitLoss(currentRate),
            roi: this.getTotalROI(currentRate),
            averageCostPerUSD: this.getAverageCostPerUSD(),
            transactionCount: this.transactions.length
        };
    }
}

