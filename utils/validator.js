const jwt = require('jsonwebtoken');
const Helper = require('./helper');

module.exports = {
   validateBody: (schema) => {
      return (req, res, next) => {
         let result = schema.validate(req.body);
         if (result.error) {
            next(new Error(result.error.details[0].message));
         } else {
            next();
         }
      }
   },
   validateParam: (schema, name) => {
      return (req, res, next) => {
         let obj = {};
         obj[`${name}`] = req.params[name]
         let result = schema.validate(obj);
         if (result.error) {
            next(new Error(result.error.details[0].message));
         } else {
            next();
         }
      }
   },
   validateToken: () => {
      return async (req, res, next) => {
         if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1];
            let decoded = jwt.decode(token, process.env.SECRET_KEY);
            let user = await Helper.get(decoded._id);
            if (user) {
               req.user = user;
               next();
            } else {
               next(new Error("Tokenization Error!"));
            }
         } else {
            next(new Error("Tokenization Error!"));
         }
      }
   },
   hasAnyRole: (roleNames) => {
      return (req, res, next) => {
         let bol = false;
         for (let i = 0; i < roleNames.length; i++) {
            let hasRole = req.user.roles.find(ro => ro.name == roleNames[i]);
            if (hasRole) {
               bol = true;
               break;
            }
         }
         if (bol) {
            next();
         } else {
            next(new Error("You don't have this permission"));
         }
      }
   },
   hasAnyPermit: (permitNames) => {
      return (req, res, next) => {
         let bol = false;
         for (let i = 0; i < permitNames.length; i++) {
            let hasPermit = req.user.permits.find(pm => pm.name == permitNames[i]);
            if (hasPermit) {
               bol = true;
               break;
            }
         }
         if (bol) {
            next();
         } else {
            next(new Error("You don't have this permission"));
         }
      }
   },
}