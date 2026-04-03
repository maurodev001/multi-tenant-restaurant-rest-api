const { Router } = require('express');
const controller = require('../controllers/menuItem.controller');
const validate = require('../middlewares/validate');
const { createMenuItem, updateMenuItem } = require('../validators/menuItem.validator');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(controller.getAllMenuItems)
  .post(validate(createMenuItem), controller.createMenuItem);

router
  .route('/:id')
  .get(controller.getMenuItemById)
  .put(validate(updateMenuItem), controller.updateMenuItem)
  .delete(controller.deleteMenuItem);

module.exports = router;
