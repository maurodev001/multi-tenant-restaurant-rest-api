const express = require('express');
const tenantResolver = require('./middlewares/tenantResolver');
const errorHandler = require('./middlewares/errorHandler');
const tenantRoutes = require('./routes/tenant.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuItemRoutes = require('./routes/menuItem.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tenants', tenantRoutes);

app.use('/api/restaurants', tenantResolver, restaurantRoutes);
app.use('/api/restaurants/:restaurantId/menu', tenantResolver, menuItemRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
