/**
 * Vista de Transacciones
 */
export class TransactionView {
    constructor() {
        this.elements = {
            transactionsList: document.getElementById('transactions-list'),
            emptyState: document.getElementById('empty-state'),
            addTransactionBtn: document.getElementById('add-transaction-btn-2'),
            addFirstTransaction: document.getElementById('add-first-transaction'),
            modal: document.getElementById('transaction-modal'),
            modalClose: document.getElementById('close-modal'),
            transactionForm: document.getElementById('transaction-form'),
            cancelBtn: document.getElementById('cancel-transaction')
        };

        // Establecer fecha por defecto en el formulario
        const dateInput = document.getElementById('transaction-date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }
    }

    /**
     * Renderiza la lista de transacciones
     * @param {Array<Transaction>} transactions
     * @param {number} currentRate - Tasa actual para cálculos
     */
    renderTransactions(transactions, currentRate) {
        if (!this.elements.transactionsList) return;

        if (transactions.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('es-BO', {
                style: 'currency',
                currency: 'BOB',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-BO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        const getLocationIcon = (location) => {
            const icons = {
                'efectivo': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>`,
                'binance': `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                </svg>`,
                'banco': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>`,
                'casa-cambio': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>`,
                'otro': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>`
            };
            return icons[location] || icons['otro'];
        };

        this.elements.transactionsList.innerHTML = transactions.map(transaction => {
            const rate = currentRate || 0;
            const currentValue = transaction.getCurrentValue(rate);
            const profitLoss = transaction.getProfitLoss(rate);
            const roi = transaction.getROI(rate);
            const icon = getLocationIcon(transaction.location);

            return `
                <div class="transaction-card" data-id="${transaction.id}">
                    <div class="transaction-header">
                        <div class="transaction-date-location">
                            <div class="transaction-icon">${icon}</div>
                            <div>
                                <div class="transaction-date">${formatDate(transaction.date)}</div>
                                <div class="transaction-location">${this.getLocationLabel(transaction.location)}</div>
                            </div>
                        </div>
                        <button class="btn-delete" data-id="${transaction.id}" title="Eliminar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                    <div class="transaction-body">
                        <div class="transaction-row">
                            <span class="label">Cantidad:</span>
                            <span class="value">${transaction.amountUSD.toFixed(2)} USD</span>
                        </div>
                        <div class="transaction-row">
                            <span class="label">Tasa de compra:</span>
                            <span class="value">${transaction.rateBOB.toFixed(2)} BOB/USD</span>
                        </div>
                        <div class="transaction-row">
                            <span class="label">Total invertido:</span>
                            <span class="value">${formatCurrency(transaction.getTotalBOB())}</span>
                        </div>
                        ${transaction.commission > 0 ? `
                        <div class="transaction-row">
                            <span class="label">Comisión:</span>
                            <span class="value">${formatCurrency(transaction.commission)}</span>
                        </div>
                        ` : ''}
                        <div class="transaction-row">
                            <span class="label">Valor actual:</span>
                            <span class="value">${formatCurrency(currentValue)}</span>
                        </div>
                        <div class="transaction-row">
                            <span class="label">Ganancia/Pérdida:</span>
                            <span class="value ${profitLoss >= 0 ? 'positive' : 'negative'}">
                                ${formatCurrency(profitLoss)} (${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%)
                            </span>
                        </div>
                        ${transaction.notes ? `
                        <div class="transaction-notes">
                            <span class="label">Notas:</span>
                            <span class="value">${transaction.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Obtiene el label de la ubicación
     * @param {string} location
     * @returns {string}
     */
    getLocationLabel(location) {
        const labels = {
            'efectivo': 'Efectivo',
            'binance': 'Binance',
            'banco': 'Banco',
            'casa-cambio': 'Casa de Cambio',
            'otro': 'Otro'
        };
        return labels[location] || location;
    }

    /**
     * Muestra el estado vacío
     */
    showEmptyState() {
        if (this.elements.emptyState) {
            this.elements.emptyState.classList.remove('hidden');
        }
        if (this.elements.transactionsList) {
            this.elements.transactionsList.innerHTML = '';
        }
    }

    /**
     * Oculta el estado vacío
     */
    hideEmptyState() {
        if (this.elements.emptyState) {
            this.elements.emptyState.classList.add('hidden');
        }
    }

    /**
     * Muestra el modal de transacción
     */
    showModal() {
        if (this.elements.modal) {
            this.elements.modal.classList.add('active');
            // Resetear formulario
            if (this.elements.transactionForm) {
                this.elements.transactionForm.reset();
                const dateInput = document.getElementById('transaction-date');
                if (dateInput) {
                    dateInput.valueAsDate = new Date();
                }
            }
        }
    }

    /**
     * Oculta el modal de transacción
     */
    hideModal() {
        if (this.elements.modal) {
            this.elements.modal.classList.remove('active');
        }
    }

    /**
     * Obtiene los datos del formulario
     * @returns {Object|null}
     */
    getFormData() {
        if (!this.elements.transactionForm) return null;

        const formData = new FormData(this.elements.transactionForm);
        const data = {
            date: document.getElementById('transaction-date').value,
            amountUSD: parseFloat(document.getElementById('transaction-amount').value),
            rateBOB: parseFloat(document.getElementById('transaction-rate').value),
            location: document.getElementById('transaction-location').value,
            commission: parseFloat(document.getElementById('transaction-commission').value) || 0,
            notes: document.getElementById('transaction-notes').value.trim()
        };

        // Validación básica
        if (!data.date || isNaN(data.amountUSD) || isNaN(data.rateBOB) || !data.location) {
            return null;
        }

        return data;
    }

    /**
     * Bind de eventos
     * @param {Function} onAddTransaction
     * @param {Function} onDeleteTransaction
     * @param {Function} onSubmitForm
     */
    bindEvents(onAddTransaction, onDeleteTransaction, onSubmitForm) {
        // Botones para abrir modal
        if (this.elements.addTransactionBtn) {
            this.elements.addTransactionBtn.addEventListener('click', () => {
                this.showModal();
                onAddTransaction();
            });
        }
        if (this.elements.addFirstTransaction) {
            this.elements.addFirstTransaction.addEventListener('click', () => {
                this.showModal();
                onAddTransaction();
            });
        }

        // Cerrar modal
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', () => this.hideModal());
        }
        if (this.elements.cancelBtn) {
            this.elements.cancelBtn.addEventListener('click', () => this.hideModal());
        }

        // Cerrar modal al hacer click fuera
        if (this.elements.modal) {
            this.elements.modal.addEventListener('click', (e) => {
                if (e.target === this.elements.modal) {
                    this.hideModal();
                }
            });
        }

        // Submit del formulario
        if (this.elements.transactionForm) {
            this.elements.transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = this.getFormData();
                if (data) {
                    onSubmitForm(data);
                    this.hideModal();
                } else {
                    alert('Por favor completa todos los campos requeridos');
                }
            });
        }

        // Delegación de eventos para botones de eliminar
        if (this.elements.transactionsList) {
            this.elements.transactionsList.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete') || e.target.closest('.btn-delete')) {
                    const btn = e.target.closest('.btn-delete');
                    const id = btn.dataset.id;
                    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
                        onDeleteTransaction(id);
                    }
                }
            });
        }
    }
}

