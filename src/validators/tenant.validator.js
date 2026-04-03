const Joi = require('joi');

const createTenant = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Slug may only contain lowercase letters, numbers, and hyphens',
    }),
  contactEmail: Joi.string().trim().email().required(),
  isActive: Joi.boolean(),
});

const updateTenant = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .min(2)
    .max(50)
    .messages({
      'string.pattern.base': 'Slug may only contain lowercase letters, numbers, and hyphens',
    }),
  contactEmail: Joi.string().trim().email(),
  isActive: Joi.boolean(),
}).min(1);

module.exports = { createTenant, updateTenant };
