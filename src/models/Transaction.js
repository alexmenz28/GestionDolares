/**
 * Modelo para transacciones de compra/venta de dólares
 */
export class Transaction {
    constructor(data) {
        this.id = data.id || null;
        this.date = data.date; // ISO string
        this.amountUSD = parseFloat(data.amountUSD);
        this.rateBOB = parseFloat(data.rateBOB);
        this.location = data.location || 'efectivo';
        this.commission = parseFloat(data.commission || 0);
        this.notes = data.notes || '';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    /**
     * Calcula el total en BOB de esta transacción
     * @returns {number}
     */
    getTotalBOB() {
        return (this.amountUSD * this.rateBOB) + this.commission;
    }

    /**
     * Calcula el costo promedio por dólar
     * @returns {number}
     */
    getAverageCostPerUSD() {
        return this.getTotalBOB() / this.amountUSD;
    }

    /**
     * Calcula el valor actual de esta transacción
     * @param {number} currentRate - Tasa actual BOB/USD
     * @returns {number}
     */
    getCurrentValue(currentRate) {
        return this.amountUSD * currentRate;
    }

    /**
     * Calcula ganancia/pérdida
     * @param {number} currentRate - Tasa actual BOB/USD
     * @returns {number}
     */
    getProfitLoss(currentRate) {
        const currentValue = this.getCurrentValue(currentRate);
        const totalInvested = this.getTotalBOB();
        return currentValue - totalInvested;
    }

    /**
     * Calcula ROI (Return on Investment)
     * @param {number} currentRate - Tasa actual BOB/USD
     * @returns {number}
     */
    getROI(currentRate) {
        const profitLoss = this.getProfitLoss(currentRate);
        const totalInvested = this.getTotalBOB();
        if (totalInvested === 0) return 0;
        return (profitLoss / totalInvested) * 100;
    }

    /**
     * Formatea la fecha para mostrar
     * @returns {string}
     */
    formatDate() {
        const date = new Date(this.date);
        return date.toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Obtiene un objeto plano para guardar
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            date: this.date,
            amountUSD: this.amountUSD,
            rateBOB: this.rateBOB,
            location: this.location,
            commission: this.commission,
            notes: this.notes,
            createdAt: this.createdAt
        };
    }

    /**
     * Crea una instancia desde JSON
     * @param {Object} data
     * @returns {Transaction}
     */
    static fromJSON(data) {
        return new Transaction(data);
    }
}

