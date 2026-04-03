const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

const ensureRestaurantBelongsToTenant = async (restaurantId, tenantId) => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, tenant: tenantId });
  return restaurant;
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const restaurant = await ensureRestaurantBelongsToTenant(
      req.params.restaurantId,
      req.tenantId
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    const menuItem = await MenuItem.create({
      ...req.body,
      tenant: req.tenantId,
      restaurant: restaurant._id,
    });

    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'A menu item with this name already exists in this restaurant',
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    next(error);
  }
};

exports.getAllMenuItems = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, isAvailable } = req.query;
    const filter = {
      tenant: req.tenantId,
      restaurant: req.params.restaurantId,
    };

    if (category) {
      filter.category = category;
    }
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    const menuItems = await MenuItem.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ category: 1, name: 1 });

    const total = await MenuItem.countDocuments(filter);

    res.json({
      success: true,
      data: menuItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    next(error);
  }
};

exports.getMenuItemById = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findOne({
      _id: req.params.id,
      tenant: req.tenantId,
      restaurant: req.params.restaurantId,
    });

    if (!menuItem) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.json({ success: true, data: menuItem });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    next(error);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant: req.tenantId,
        restaurant: req.params.restaurantId,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.json({ success: true, data: menuItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'A menu item with this name already exists in this restaurant',
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    next(error);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenantId,
      restaurant: req.params.restaurantId,
    });

    if (!menuItem) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    res.json({ success: true, data: {}, message: 'Menu item deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    next(error);
  }
};
