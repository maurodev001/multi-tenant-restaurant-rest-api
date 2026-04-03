const Joi = require('joi');

const CATEGORIES = ['appetizer', 'main', 'dessert', 'beverage', 'side'];

const createMenuItem = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().max(500).allow(''),
  price: Joi.number().min(0).precision(2).required(),
  category: Joi.string()
    .trim()
    .valid(...CATEGORIES)
    .required(),
  isAvailable: Joi.boolean(),
});

const updateMenuItem = Joi.object({
  name: Joi.string().trim().min(2).max(150),
  description: Joi.string().trim().max(500).allow(''),
  price: Joi.number().min(0).precision(2),
  category: Joi.string()
    .trim()
    .valid(...CATEGORIES),
  isAvailable: Joi.boolean(),
}).min(1);

module.exports = { createMenuItem, updateMenuItem };
