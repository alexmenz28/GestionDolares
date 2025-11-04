# Análisis Técnico - Aplicación de Gestión de Dólares

## 1. APIs para Consumir (Frontend Directo)

### 1.1 Tasas de Cambio BOB/USD

#### Opciones Disponibles:

**a) ExchangeRate-API** (https://www.exchangerate-api.com/)
- ✅ Gratis (plan free disponible)
- ✅ Sin autenticación para endpoints públicos
- ✅ CORS habilitado
- ✅ Actualización: Diaria
- ⚠️ Limitación: 1,500 requests/mes en plan free
- **Endpoint ejemplo**: `https://api.exchangerate-api.com/v4/latest/USD`

**b) Fixer.io** (https://fixer.io/)
- ✅ API REST
- ⚠️ Requiere API key (gratis: 100 requests/mes)
- ✅ CORS configurable
- ✅ Actualización: Diaria
- **Endpoint**: `http://data.fixer.io/api/latest?access_key=YOUR_KEY&base=USD&symbols=BOB`

**c) ExchangeMonitor API** (https://exchangemonitor.net/api)
- ✅ Gratis
- ✅ Actualización cada 10 minutos
- ✅ Incluye múltiples fuentes de Bolivia
- ✅ CORS habilitado
- **Endpoint**: `https://api.exchangemonitor.net/v1/currencies/USD/BOB`

**d) API del Banco Central de Bolivia (BCB)**
- ⚠️ No tiene API REST pública oficial
- ⚠️ Requeriría scraping (no recomendado)
- ✅ Fuente oficial y confiable

**e) Open Exchange Rates** (https://openexchangerates.org/)
- ✅ Plan free: 1,000 requests/mes
- ✅ CORS habilitado
- ✅ Actualización: Diaria
- **Endpoint**: `https://openexchangerates.org/api/latest.json?app_id=YOUR_APP_ID&base=USD&symbols=BOB`

#### Recomendación:
- **Usar múltiples fuentes**: ExchangeMonitor (para fuentes bolivianas), ExchangeRate-API (backup), y Fixer.io (si está disponible)
- **Calcular promedio** entre todas las fuentes seleccionadas por el usuario

### 1.2 Binance API (USDT/USDC)

**Binance Public API** (https://binance-docs.github.io/apidocs/spot/en/)
- ✅ Completamente gratis
- ✅ Sin autenticación para endpoints públicos
- ✅ CORS habilitado
- ✅ Actualización en tiempo real
- **Endpoints relevantes**:
  - Precio actual: `https://api.binance.com/api/v3/ticker/price?symbol=USDTUSDC`
  - Precio USDT en BOB (si existe par): `https://api.binance.com/api/v3/ticker/price?symbol=USDTBOB`
  - Precio USDC en BOB: `https://api.binance.com/api/v3/ticker/price?symbol=USDCBOB`
  - 24h ticker: `https://api.binance.com/api/v3/ticker/24hr?symbol=USDTUSDC`

### 1.3 Limitaciones Sin Backend

#### ⚠️ Problemas a Considerar:

1. **Exposición de API Keys**
   - Si usas Fixer.io u Open Exchange Rates, las keys estarán visibles en el código
   - **Solución temporal**: Usar solo APIs públicas sin autenticación
   - **Solución ideal**: Implementar un backend mínimo (proxy) para proteger keys

2. **CORS (Cross-Origin Resource Sharing)**
   - Algunas APIs pueden bloquear requests desde navegadores
   - **Solución**: Verificar que las APIs soporten CORS o usar un CORS proxy

3. **Límites de Rate Limiting**
   - Cada usuario consume las cuotas desde su navegador
   - Si muchos usuarios usan la app, pueden agotar límites

4. **Almacenamiento de Datos**
   - Sin backend, solo puedes usar:
     - **LocalStorage**: Persistencia local en el navegador
     - **IndexedDB**: Base de datos local (más robusta)
     - **Cookies**: Limitado (4KB)
   - **Limitación**: Datos solo en el dispositivo del usuario

5. **Alertas en Tiempo Real**
   - Sin backend, las alertas solo funcionan cuando el usuario tiene la app abierta
   - **Solución**: Service Workers + Notifications API (notificaciones del navegador)

## 2. Arquitectura MVC en Frontend

### 2.1 Opciones de Stack MVC

#### Opción A: Vanilla JavaScript + Arquitectura MVC Manual
**Ventajas:**
- ✅ Sin dependencias pesadas
- ✅ Control total sobre la arquitectura
- ✅ Bundle pequeño
- ✅ Aprendizaje profundo del patrón MVC

**Desventajas:**
- ⚠️ Más código boilerplate
- ⚠️ Manejo manual de routing (si se necesita)

**Estructura propuesta:**
```
src/
├── models/          # Lógica de datos y estado
│   ├── ExchangeRate.js
│   ├── Transaction.js
│   ├── Portfolio.js
│   └── Alert.js
├── views/           # Vistas/Templates
│   ├── DashboardView.js
│   ├── TransactionView.js
│   ├── SettingsView.js
│   └── components/  # Componentes reutilizables
├── controllers/     # Controladores (orquestan Model-View)
│   ├── DashboardController.js
│   ├── TransactionController.js
│   └── SettingsController.js
├── services/        # Servicios (APIs, utilidades)
│   ├── ApiService.js
│   ├── StorageService.js
│   └── NotificationService.js
└── app.js          # Entry point
```

#### Opción B: Framework Ligero (Backbone.js)
**Ventajas:**
- ✅ MVC nativo
- ✅ Estructura clara
- ✅ Ligero (~7KB gzipped)
- ✅ Maduro y estable

**Desventajas:**
- ⚠️ Menos popular hoy en día
- ⚠️ Menos comunidad activa

#### Opción C: Framework Moderno con Patrón MVC (Vue.js)
**Ventajas:**
- ✅ Popular y activo
- ✅ Fácil de aprender
- ✅ Buen rendimiento
- ✅ Puede seguir patrón MVC (aunque es más MVVM)

**Desventajas:**
- ⚠️ Más pesado que vanilla JS
- ⚠️ Requiere build process

### 2.2 Recomendación: Vanilla JavaScript + MVC Manual

**Razones:**
1. Control total sobre la arquitectura
2. Bundle mínimo (mejor rendimiento)
3. Sin dependencias externas
4. Aprendizaje valioso del patrón MVC
5. Fácil de mantener si es bien estructurado

## 3. Almacenamiento de Datos (Sin Backend)

### 3.1 IndexedDB (Recomendado)

**Ventajas:**
- ✅ Base de datos NoSQL completa
- ✅ Almacenamiento grande (hasta varios GB)
- ✅ Transacciones
- ✅ Índices para búsquedas rápidas
- ✅ Asíncrono (no bloquea UI)

**Uso para:**
- Transacciones (compras/ventas)
- Configuración de fuentes de datos
- Alertas configuradas
- Historial completo

**Librería recomendada**: `idb` (wrapper ligero de IndexedDB)

### 3.2 LocalStorage (Para Configuración Simple)

**Ventajas:**
- ✅ Sincrónico (fácil de usar)
- ✅ Simple API

**Limitaciones:**
- ⚠️ Solo 5-10MB
- ⚠️ Solo strings (necesita JSON.stringify/parse)
- ⚠️ Síncrono (puede bloquear UI)

**Uso para:**
- Preferencias del usuario
- Configuración de alertas simples

## 4. Funcionalidades Técnicas Detalladas

### 4.1 Sistema de Fuentes de Datos

**Implementación:**
```javascript
// Modelo de fuente de datos
{
  id: "exchange-rate-api",
  name: "Exchange Rate API",
  url: "https://api.exchangerate-api.com/v4/latest/USD",
  enabled: true,
  lastUpdate: "2024-01-15T10:30:00Z",
  rate: 6.92,
  parser: "function" // Función para parsear respuesta
}

// Detección automática de fuentes comunes:
// - Comparar URLs y nombres
// - Agrupar por tipo (oficial, exchange, etc.)
// - Sugerir al usuario cuáles son similares
```

### 4.2 Cálculo de Promedio

**Algoritmo:**
- Filtrar fuentes habilitadas por el usuario
- Obtener tasa de cada fuente
- Calcular promedio simple o ponderado
- Mostrar desviación estándar (opcional, para confiabilidad)

### 4.3 Tracking de Múltiples Compras

**Estructura de datos:**
```javascript
{
  id: "uuid",
  date: "2024-01-10",
  amountUSD: 1000,
  rateBOB: 17.00,
  totalBOB: 17000,
  location: "efectivo" | "binance" | "otro",
  commission: 50, // en BOB
  notes: "Compra inicial"
}
```

**Cálculo de ganancia/pérdida:**
- Precio promedio de compra (considerando todas las compras)
- Valor actual = cantidad_usd * tasa_actual
- Ganancia = valor_actual - (total_invertido + comisiones)
- ROI = (ganancia / total_invertido) * 100

### 4.4 Sistema de Alertas

**Implementación:**
- Service Worker para notificaciones en background
- Verificación periódica (cada X minutos cuando la app está abierta)
- Configuración por usuario:
  ```javascript
  {
    id: "alert-1",
    type: "above" | "below",
    threshold: 18.5, // en BOB
    enabled: true,
    notification: true // enviar notificación del navegador
  }
  ```

### 4.5 Historial de Transacciones

**Funcionalidades:**
- Registrar cada compra/venta
- Filtrar por fecha, tipo, ubicación
- Exportar a CSV/JSON
- Gráficos de evolución (usando Chart.js o similar)

## 5. Hosting Recomendado

### 5.1 Opciones Gratuitas (Solo Frontend)

#### **Vercel** ⭐ (Recomendado #1)
- ✅ Gratis
- ✅ Deploy automático desde Git
- ✅ CDN global
- ✅ HTTPS automático
- ✅ Dominio personalizado
- ✅ Perfecto para sitios estáticos
- **URL**: https://vercel.com

#### **Netlify** ⭐ (Recomendado #2)
- ✅ Gratis
- ✅ Deploy automático
- ✅ CDN
- ✅ HTTPS
- ✅ Formularios (si necesitas)
- ✅ Funciones serverless (si más adelante quieres backend)
- **URL**: https://netlify.com

#### **GitHub Pages**
- ✅ Gratis
- ✅ Integrado con GitHub
- ✅ HTTPS
- ⚠️ Solo sitios estáticos
- ⚠️ Menos flexible que Vercel/Netlify
- **URL**: https://pages.github.com

#### **Cloudflare Pages**
- ✅ Gratis
- ✅ CDN potente
- ✅ Deploy rápido
- ✅ Integración con Git
- **URL**: https://pages.cloudflare.com

### 5.2 Opciones de Pago (Si creces)

#### **Vercel Pro**
- $20/mes
- Más bandwidth, mejor rendimiento

#### **Netlify Pro**
- $19/mes
- Más features, mejor soporte

### 5.3 Recomendación Final

**Vercel** para comenzar:
1. Más fácil de usar
2. Mejor DX (Developer Experience)
3. Deploy en segundos
4. Gratis generoso
5. Puedes migrar fácilmente después

## 6. Stack Tecnológico Propuesto

### Frontend
- **HTML5** + **CSS3** (moderno, sin frameworks CSS inicialmente)
- **JavaScript ES6+** (Vanilla, sin frameworks)
- **Arquitectura MVC** manual
- **IndexedDB** (idb library) para almacenamiento
- **Service Workers** para notificaciones
- **Chart.js** para gráficos (opcional, ligero)

### Build Tools (Opcional pero recomendado)
- **Vite** o **Parcel** para bundling y desarrollo rápido
- **ESLint** para calidad de código

### APIs Externas
- ExchangeRate-API (gratis)
- ExchangeMonitor (gratis)
- Binance Public API (gratis)

### Hosting
- **Vercel** (gratis)

## 7. Estructura de Proyecto Propuesta

```
dolares/
├── index.html
├── src/
│   ├── app.js                 # Entry point, inicializa MVC
│   ├── models/
│   │   ├── ExchangeRate.js   # Modelo de tasas de cambio
│   │   ├── Transaction.js    # Modelo de transacciones
│   │   ├── Portfolio.js      # Modelo de portafolio
│   │   ├── Alert.js          # Modelo de alertas
│   │   └── DataSource.js     # Modelo de fuentes de datos
│   ├── views/
│   │   ├── DashboardView.js
│   │   ├── TransactionView.js
│   │   ├── SettingsView.js
│   │   └── components/
│   │       ├── RateCard.js
│   │       ├── AlertCard.js
│   │       └── TransactionList.js
│   ├── controllers/
│   │   ├── DashboardController.js
│   │   ├── TransactionController.js
│   │   └── SettingsController.js
│   ├── services/
│   │   ├── ApiService.js      # Cliente HTTP para APIs
│   │   ├── StorageService.js  # Wrapper de IndexedDB
│   │   ├── NotificationService.js # Service Worker + Notifications
│   │   └── CalculationService.js # Lógica de cálculos
│   └── utils/
│       ├── helpers.js
│       └── validators.js
├── styles/
│   ├── main.css
│   └── components.css
├── assets/
│   └── icons/
├── package.json
├── vite.config.js (o similar)
└── README.md
```

## 8. Consideraciones de Seguridad

### Sin Backend:
1. **API Keys**: No usar APIs que requieran keys (o usar solo públicas)
2. **Validación**: Validar todos los inputs del usuario
3. **Sanitización**: Sanitizar datos antes de mostrar
4. **HTTPS**: Siempre usar HTTPS (Vercel/Netlify lo proveen)

### Con Datos Locales:
1. **IndexedDB**: Los datos están en el navegador del usuario
2. **Export/Import**: Permitir exportar datos para backup
3. **Privacidad**: Todo queda local, no se envía a servidores

## 9. Plan de Implementación Sugerido

### Fase 1: MVP (Mínimo Producto Viable)
1. ✅ Estructura MVC básica
2. ✅ Consumir 1 API de tasas (ExchangeRate-API)
3. ✅ Dashboard simple con tasa actual
4. ✅ Agregar transacción (compra)
5. ✅ Calcular ganancia/pérdida básica
6. ✅ Almacenamiento en IndexedDB

### Fase 2: Funcionalidades Core
1. ✅ Múltiples fuentes de datos
2. ✅ Cálculo de promedio
3. ✅ Historial de transacciones
4. ✅ Múltiples compras a diferentes tasas
5. ✅ Tracking de comisiones

### Fase 3: Funcionalidades Avanzadas
1. ✅ Integración Binance (USDT/USDC)
2. ✅ Sistema de alertas
3. ✅ Notificaciones del navegador
4. ✅ Gráficos de evolución
5. ✅ Export/Import de datos

### Fase 4: Polish
1. ✅ UI/UX mejorado
2. ✅ Responsive design
3. ✅ Optimizaciones de rendimiento
4. ✅ Documentación

## 10. Preguntas Finales para Decidir

1. **¿Prefieres empezar con vanilla JS o usar un framework ligero?**
   - Recomendación: Vanilla JS para aprender MVC puro

2. **¿Quieres que sea PWA (Progressive Web App)?**
   - Permite instalar en el teléfono como app
   - Funciona offline (con datos cacheados)
   - Notificaciones push

3. **¿Necesitas que funcione offline?**
   - Podemos cachear las últimas tasas
   - Mostrar datos históricos sin conexión

4. **¿Quieres empezar con el MVP o directamente con todas las features?**
   - Recomendación: MVP primero, iterar después

---

## ¿Seguimos con la Implementación?

Una vez que confirmes estos puntos, puedo comenzar a crear la aplicación con la estructura propuesta. ¿Hay algo que quieras ajustar o profundizar antes de empezar?


