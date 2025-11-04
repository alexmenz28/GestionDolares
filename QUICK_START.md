# 🚀 Inicio Rápido

## Pasos para Ejecutar la Aplicación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### 3. Usar la Aplicación

1. **Agregar tu Primera Compra**:
   - Haz clic en "➕ Agregar Compra"
   - Completa el formulario:
     - Fecha de compra
     - Cantidad en USD (ej: 1000)
     - Tasa de cambio (ej: 17.00 BOB/USD)
     - Ubicación (efectivo, Binance, banco, etc.)
     - Comisión si la hubo (opcional)
   - Guarda la transacción

2. **Ver el Dashboard**:
   - La tasa de cambio se actualiza automáticamente
   - Ve el resumen de tu portafolio
   - Monitorea ganancias/pérdidas en tiempo real

3. **Ver Transacciones**:
   - Navega a la pestaña "Transacciones"
   - Revisa todas tus compras
   - Cada transacción muestra el valor actual y ROI

## 📝 Notas Importantes

- **Datos Locales**: Todos tus datos se guardan en tu navegador (IndexedDB)
- **Tasa de Cambio**: Se actualiza automáticamente desde ExchangeRate-API
- **Sin Internet**: Puedes ver tus datos históricos sin conexión (pero no actualizar tasas)

## 🐛 Solución de Problemas

### La aplicación no carga
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de haber ejecutado `npm install`

### No se actualiza la tasa de cambio
- Verifica tu conexión a internet
- Revisa la consola del navegador (F12) para errores
- La API tiene límites de uso (1,500 requests/mes)

### Los datos no se guardan
- Verifica que tu navegador soporte IndexedDB
- Asegúrate de no estar en modo incógnito (algunos navegadores lo bloquean)

## 📦 Build para Producción

```bash
npm run build
```

Los archivos estarán en `dist/` listos para desplegar.

## 🚀 Desplegar

### Opción 1: Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Opción 2: Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist/` a Netlify Drop

### Opción 3: GitHub Pages
1. Sube la carpeta `dist/` a un repositorio
2. Activa GitHub Pages en la configuración del repositorio

---

¡Listo! Ahora puedes gestionar tus dólares desde Bolivia 🎉

