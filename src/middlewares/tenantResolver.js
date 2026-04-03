const Tenant = require('../models/Tenant');

const tenantResolver = async (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];

  if (!tenantId) {
    return res.status(400).json({
      success: false,
      error: 'Missing x-tenant-id header',
    });
  }

  try {
    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
      });
    }

    if (!tenant.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Tenant account is inactive',
      });
    }

    req.tenantId = tenant._id;
    req.tenant = tenant;
    next();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid tenant ID format',
      });
    }
    next(error);
  }
};

module.exports = tenantResolver;
