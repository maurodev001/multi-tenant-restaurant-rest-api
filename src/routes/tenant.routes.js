const { Router } = require('express');
const controller = require('../controllers/tenant.controller');
const validate = require('../middlewares/validate');
const { createTenant, updateTenant } = require('../validators/tenant.validator');

const router = Router();

router
  .route('/')
  .get(controller.getAllTenants)
  .post(validate(createTenant), controller.createTenant);

router
  .route('/:id')
  .get(controller.getTenantById)
  .put(validate(updateTenant), controller.updateTenant)
  .delete(controller.deleteTenant);

module.exports = router;
