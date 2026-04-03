const Restaurant = require('../models/Restaurant');

exports.createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      tenant: req.tenantId,
    });

    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'A restaurant with this name already exists for this tenant',
      });
    }
    next(error);
  }
};

exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, cuisineType, isActive } = req.query;
    const filter = { tenant: req.tenantId };

    if (cuisineType) {
      filter.cuisineType = { $in: cuisineType.split(',') };
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const restaurants = await Restaurant.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Restaurant.countDocuments(filter);

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      tenant: req.tenantId,
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid restaurant ID' });
    }
    next(error);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenantId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'A restaurant with this name already exists for this tenant',
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid restaurant ID' });
    }
    next(error);
  }
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({
      _id: req.params.id,
      tenant: req.tenantId,
    });

    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }

    res.json({ success: true, data: {}, message: 'Restaurant deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, error: 'Invalid restaurant ID' });
    }
    next(error);
  }
};
