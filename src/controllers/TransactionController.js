import { Transaction } from '../models/Transaction.js';
import { TransactionView } from '../views/TransactionView.js';
import { StorageService } from '../services/StorageService.js';

/**
 * Controlador de Transacciones
 */
export class TransactionController {
    constructor() {
        this.view = new TransactionView();
        this.storageService = new StorageService();
        this.currentRate = null;
    }

    /**
     * Inicializa el controlador
     */
    async init() {
        await this.storageService.init();

        // Bind de eventos
        this.view.bindEvents(
            () => this.onAddTransaction(),
            (id) => this.onDeleteTransaction(id),
            (data) => this.onSubmitTransaction(data)
        );

        // Escuchar eventos globales
        window.addEventListener('show-transaction-modal', () => {
            this.view.showModal();
        });

        window.addEventListener('rate-updated', (e) => {
            this.currentRate = e.detail.rate;
            this.refreshTransactions();
        });

        window.addEventListener('portfolio-updated', () => {
            this.refreshTransactions();
        });

        // Cargar transacciones iniciales
        await this.refreshTransactions();
    }

    /**
     * Carga y muestra las transacciones
     */
    async refreshTransactions() {
        try {
            const transactionsData = await this.storageService.getAllTransactions();
            const transactions = transactionsData.map(t => Transaction.fromJSON(t));
            
            // Obtener tasa actual si está disponible (usar 0 como fallback)
            const rate = typeof this.currentRate === 'number' ? this.currentRate : (this.currentRate?.rate || 0);
            
            this.view.renderTransactions(transactions, rate);
        } catch (error) {
            console.error('Error refreshing transactions:', error);
        }
    }

    /**
     * Handler para agregar transacción
     */
    onAddTransaction() {
        this.view.showModal();
    }

    /**
     * Handler para eliminar transacción
     * @param {string} id
     */
    async onDeleteTransaction(id) {
        try {
            await this.storageService.deleteTransaction(id);
            
            // Notificar actualización
            window.dispatchEvent(new CustomEvent('portfolio-updated'));
            
            // Recargar vista
            await this.refreshTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Error al eliminar la transacción');
        }
    }

    /**
     * Handler para submit del formulario
     * @param {Object} data
     */
    async onSubmitTransaction(data) {
        try {
            const transaction = new Transaction(data);
            
            // Guardar en almacenamiento
            await this.storageService.saveTransaction(transaction.toJSON());
            
            // Notificar actualización
            window.dispatchEvent(new CustomEvent('portfolio-updated'));
            
            // Recargar vista
            await this.refreshTransactions();
            
            // Mostrar confirmación
            console.log('Transacción guardada exitosamente');
        } catch (error) {
            console.error('Error saving transaction:', error);
            alert('Error al guardar la transacción');
        }
    }

    /**
     * Establece la tasa actual para cálculos
     * @param {number} rate
     */
    setCurrentRate(rate) {
        this.currentRate = rate;
        this.refreshTransactions();
    }
}

