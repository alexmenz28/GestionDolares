# 💰 Dólares - Gestión de Inversiones

Aplicación web para gestionar tus dólares desde Bolivia. Controla tus inversiones, monitorea tasas de cambio y decide cuándo cambiar o vender tus dólares.

## 🎯 Características

- **Dashboard con Resumen**: Visualiza tu portafolio completo con ganancias/pérdidas en tiempo real
- **Tasa de Cambio Actualizada**: Obtiene la tasa BOB/USD desde ExchangeRate-API
- **Gestión de Transacciones**: Registra múltiples compras a diferentes tasas
- **Cálculo de Rentabilidad**: Calcula automáticamente ROI, ganancias y pérdidas
- **Tracking de Comisiones**: Registra comisiones pagadas al cambiar
- **Almacenamiento Local**: Todos tus datos se guardan localmente en tu navegador (IndexedDB)
- **Diseño Responsive**: Funciona perfectamente en móviles y escritorio

## 🚀 Instalación y Uso

### Requisitos

- Node.js 16+ (para desarrollo)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación se abrirá en http://localhost:3000
```

### Build para Producción

```bash
npm run build
```

Los archivos estarán en la carpeta `dist/` listos para desplegar.

## 📁 Estructura del Proyecto

```
dolares/
├── index.html              # HTML principal
├── src/
│   ├── app.js              # Entry point de la aplicación
│   ├── models/             # Modelos de datos
│   │   ├── ExchangeRate.js
│   │   ├── Transaction.js
│   │   └── Portfolio.js
│   ├── views/              # Vistas (UI)
│   │   ├── DashboardView.js
│   │   └── TransactionView.js
│   ├── controllers/        # Controladores (Lógica)
│   │   ├── DashboardController.js
│   │   └── TransactionController.js
│   ├── services/           # Servicios (APIs, Storage)
│   │   ├── ApiService.js
│   │   └── StorageService.js
│   └── utils/              # Utilidades
│       └── helpers.js
├── styles/
│   └── main.css            # Estilos principales
└── package.json
```

## 🏗️ Arquitectura MVC

La aplicación sigue el patrón **Modelo-Vista-Controlador**:

- **Modelos**: Representan los datos (ExchangeRate, Transaction, Portfolio)
- **Vistas**: Renderizan la UI y manejan la interacción del usuario
- **Controladores**: Orquestan la lógica entre modelos y vistas
- **Servicios**: Manejan APIs externas y almacenamiento

## 📊 APIs Utilizadas

- **ExchangeRate-API**: Para obtener tasas de cambio BOB/USD
  - Endpoint: `https://api.exchangerate-api.com/v4/latest/USD`
  - Gratis, sin autenticación
  - Actualización diaria

- **Binance API**: (Preparado para futuras funcionalidades)
  - Endpoint: `https://api.binance.com/api/v3/ticker/price`

## 💾 Almacenamiento

Todos los datos se guardan localmente en tu navegador usando **IndexedDB**:
- Transacciones de compra/venta
- Configuración de la aplicación
- Tasas de cambio cacheadas

**Nota**: Los datos son completamente privados y solo existen en tu navegador.

## 🎨 Tecnologías

- **Vanilla JavaScript** (ES6+)
- **Vite** (Build tool)
- **IndexedDB** (via idb library)
- **CSS3** (Variables, Grid, Flexbox)

## 📝 Uso

1. **Agregar una Compra**:
   - Haz clic en "Agregar Compra"
   - Completa el formulario con la fecha, cantidad en USD, tasa de cambio, ubicación y comisiones (si las hay)
   - Guarda la transacción

2. **Ver Dashboard**:
   - Visualiza el resumen de tu portafolio
   - Ve la tasa de cambio actual
   - Monitorea ganancias/pérdidas y ROI

3. **Ver Transacciones**:
   - Revisa todas tus compras registradas
   - Cada transacción muestra el valor actual y ganancia/pérdida

## 🚀 Despliegue

### Opciones Recomendadas:

1. **Vercel** (Recomendado)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Arrastra la carpeta `dist/` a Netlify Drop

3. **GitHub Pages**
   - Sube la carpeta `dist/` a un repositorio
   - Activa GitHub Pages

## 🔮 Próximas Funcionalidades (MVP+)

- [ ] Múltiples fuentes de datos de tasas (filtrables)
- [ ] Cálculo de promedio entre fuentes
- [ ] Integración con Binance USDT/USDC
- [ ] Sistema de alertas cuando la tasa alcance umbrales
- [ ] Historial de tasas de cambio
- [ ] Gráficos de evolución
- [ ] Exportar datos a CSV/JSON
- [ ] Modo PWA (instalable)

## 📄 Licencia

Este proyecto es de uso personal.

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias son bienvenidas.

---

**Desarrollado con ❤️ para gestionar dólares desde Bolivia**

