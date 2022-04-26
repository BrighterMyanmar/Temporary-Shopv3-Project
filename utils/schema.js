const Joi = require('joi');

module.exports = {
   UserSchema: {
      login: Joi.object({
         phone: Joi.string().min(7).max(11).required(),
         password: Joi.string().min(8).required()
      }),
      register: Joi.object({
         name: Joi.string().min(5).required(),
         email: Joi.string().email().required(),
         phone: Joi.string().min(7).max(11).required(),
         password: Joi.string().min(8).required()
      })
   },
   PermitSchema: {
      add: Joi.object({
         name: Joi.string().required()
      }),
      roleAddPermit: Joi.object({
         roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
         permitId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
      })
   },

   AllSchema: {
      id: Joi.object({
         id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
      })
   }
}