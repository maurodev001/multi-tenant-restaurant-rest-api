const Joi = require('joi');

const addressSchema = Joi.object({
  street: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().allow(''),
  zipCode: Joi.string().trim().allow(''),
  country: Joi.string().trim().required(),
});

const createRestaurant = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().max(500).allow(''),
  address: addressSchema.required(),
  cuisineType: Joi.array().items(Joi.string().trim()).min(1).required(),
  rating: Joi.number().min(0).max(5),
  isActive: Joi.boolean(),
});

const updateRestaurant = Joi.object({
  name: Joi.string().trim().min(2).max(150),
  description: Joi.string().trim().max(500).allow(''),
  address: addressSchema,
  cuisineType: Joi.array().items(Joi.string().trim()).min(1),
  rating: Joi.number().min(0).max(5),
  isActive: Joi.boolean(),
}).min(1);

module.exports = { createRestaurant, updateRestaurant };
