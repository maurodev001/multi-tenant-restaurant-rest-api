const { Router } = require('express');
const controller = require('../controllers/restaurant.controller');
const validate = require('../middlewares/validate');
const { createRestaurant, updateRestaurant } = require('../validators/restaurant.validator');

const router = Router();

router
  .route('/')
  .get(controller.getAllRestaurants)
  .post(validate(createRestaurant), controller.createRestaurant);

router
  .route('/:id')
  .get(controller.getRestaurantById)
  .put(validate(updateRestaurant), controller.updateRestaurant)
  .delete(controller.deleteRestaurant);

module.exports = router;
