import { openDB } from 'idb';

/**
 * Servicio para manejar almacenamiento con IndexedDB
 */
export class StorageService {
    constructor() {
        this.dbName = 'DolaresApp';
        this.dbVersion = 1;
        this.db = null;
    }

    /**
     * Inicializa la base de datos
     */
    async init() {
        if (this.db) return this.db;

        this.db = await openDB(this.dbName, this.dbVersion, {
            upgrade(db) {
                // Store para transacciones
                if (!db.objectStoreNames.contains('transactions')) {
                    const transactionStore = db.createObjectStore('transactions', {
                        keyPath: 'id',
                        autoIncrement: false
                    });
                    transactionStore.createIndex('date', 'date');
                    transactionStore.createIndex('location', 'location');
                }

                // Store para configuración
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', {
                        keyPath: 'key'
                    });
                }

                // Store para tasas de cambio cacheadas
                if (!db.objectStoreNames.contains('rates')) {
                    db.createObjectStore('rates', {
                        keyPath: 'id'
                    });
                }
            }
        });

        return this.db;
    }

    /**
     * Guarda una transacción
     * @param {Object} transaction - Datos de la transacción
     * @returns {Promise<string>} ID de la transacción
     */
    async saveTransaction(transaction) {
        const db = await this.init();
        const tx = db.transaction('transactions', 'readwrite');
        
        // Generar ID único
        const id = transaction.id || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const transactionData = {
            ...transaction,
            id,
            createdAt: transaction.createdAt || new Date().toISOString()
        };

        await tx.store.put(transactionData);
        await tx.done;
        
        return id;
    }

    /**
     * Obtiene todas las transacciones
     * @returns {Promise<Array>}
     */
    async getAllTransactions() {
        const db = await this.init();
        const tx = db.transaction('transactions', 'readonly');
        const transactions = await tx.store.getAll();
        await tx.done;
        
        // Ordenar por fecha descendente
        return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    /**
     * Obtiene una transacción por ID
     * @param {string} id
     * @returns {Promise<Object|null>}
     */
    async getTransaction(id) {
        const db = await this.init();
        const tx = db.transaction('transactions', 'readonly');
        const transaction = await tx.store.get(id);
        await tx.done;
        return transaction;
    }

    /**
     * Elimina una transacción
     * @param {string} id
     */
    async deleteTransaction(id) {
        const db = await this.init();
        const tx = db.transaction('transactions', 'readwrite');
        await tx.store.delete(id);
        await tx.done;
    }

    /**
     * Guarda configuración
     * @param {string} key
     * @param {*} value
     */
    async saveSetting(key, value) {
        const db = await this.init();
        const tx = db.transaction('settings', 'readwrite');
        await tx.store.put({ key, value });
        await tx.done;
    }

    /**
     * Obtiene configuración
     * @param {string} key
     * @param {*} defaultValue
     * @returns {Promise<*>}
     */
    async getSetting(key, defaultValue = null) {
        const db = await this.init();
        const tx = db.transaction('settings', 'readonly');
        const setting = await tx.store.get(key);
        await tx.done;
        return setting?.value ?? defaultValue;
    }

    /**
     * Guarda tasa de cambio cacheada
     * @param {Object} rateData
     */
    async saveRate(rateData) {
        const db = await this.init();
        const tx = db.transaction('rates', 'readwrite');
        await tx.store.put({
            id: 'current',
            ...rateData,
            timestamp: new Date().toISOString()
        });
        await tx.done;
    }

    /**
     * Obtiene tasa de cambio cacheada
     * @returns {Promise<Object|null>}
     */
    async getCachedRate() {
        const db = await this.init();
        const tx = db.transaction('rates', 'readonly');
        const rate = await tx.store.get('current');
        await tx.done;
        return rate;
    }
}

