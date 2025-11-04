/**
 * Modelo para manejar tasas de cambio
 */
export class ExchangeRate {
    constructor(rate, source, timestamp = new Date()) {
        this.rate = rate;
        this.source = source;
        this.timestamp = timestamp instanceof Date ? timestamp : new Date(timestamp);
    }

    /**
     * Formatea la tasa para mostrar
     * @param {number} decimals - Número de decimales
     * @returns {string}
     */
    format(decimals = 2) {
        return this.rate.toFixed(decimals);
    }

    /**
     * Convierte USD a BOB
     * @param {number} usdAmount
     * @returns {number}
     */
    convertToBOB(usdAmount) {
        return usdAmount * this.rate;
    }

    /**
     * Convierte BOB a USD
     * @param {number} bobAmount
     * @returns {number}
     */
    convertToUSD(bobAmount) {
        return bobAmount / this.rate;
    }

    /**
     * Verifica si la tasa está actualizada (menos de X minutos)
     * @param {number} maxAgeMinutes
     * @returns {boolean}
     */
    isFresh(maxAgeMinutes = 60) {
        const age = Date.now() - this.timestamp.getTime();
        return age < maxAgeMinutes * 60 * 1000;
    }

    /**
     * Obtiene el tiempo transcurrido desde la última actualización
     * @returns {string}
     */
    getTimeAgo() {
        const seconds = Math.floor((Date.now() - this.timestamp.getTime()) / 1000);
        
        if (seconds < 60) return 'hace unos segundos';
        if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`;
        if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`;
        return `hace ${Math.floor(seconds / 86400)} días`;
    }
}

