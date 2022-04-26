const req = require('express/lib/request');
const DB = require('../models/user');
const RoleDB = require('../models/role');
const PermitDB = require('../models/permit');
const Helper = require('../utils/helper');

const login = async (req, res, next) => {
   let dbUser = await DB.findOne({ phone: req.body.phone }).populate('roles permits');
   if (dbUser) {
      if (Helper.comparePass(req.body.password, dbUser.password)) {
         let user = dbUser.toObject();
         delete user.password;
         user.token = Helper.makeToken(user);
         Helper.set(user._id, user);
         Helper.fMsg(res, "Login Success", user);
      } else {
         next(new Error("Creditial Error"));
      }
   } else {
      next(new Error("Creditial Error"));
   }
}

const register = async (req, res, next) => {
   let emailUser = await DB.findOne({ email: req.body.email });
   if (emailUser) {
      next(new Error("Email is already in use!"));
      return;
   }

   let phoneUser = await DB.findOne({ phone: req.body.phone });
   if (phoneUser) {
      next(new Error("Phone is already in use!"));
      return;
   }

   let user = req.body;
   user.password = Helper.encode(user.password);

   let userResult = await new DB(user).save();
   let userRole = await RoleDB.findOne({ name: "USER" });
   await DB.findByIdAndUpdate(userResult._id, { $push: { roles: userResult._id } });
   let updatedUser = await DB.findById(userResult._id);
   Helper.fMsg(res, "Register Success", updatedUser);
}
const addRole = async (req, res, next) => {
   let dbUser = await DB.findById(req.body.userId);
   let dbRole = await RoleDB.findById(req.body.roleId);

   if (dbUser && dbRole) {
      let hasRole = dbUser.roles.find(ro => ro.equals(dbRole._id));
      if (hasRole) {
         next(new Error("Role Already Exist!"));
      } else {
         await DB.findByIdAndUpdate(dbUser._id, { $push: { roles: dbRole._id } });
         Helper.fMsg(res, "Role added to User");
      }
   } else {
      next(new Error("No user or role to add"));
   }
}
const removeRole = async (req, res, next) => {
   let dbUser = await DB.findById(req.body.userId);
   let dbRole = await RoleDB.findById(req.body.roleId);

   if (dbUser && dbRole) {
      await DB.findByIdAndUpdate(dbUser._id, { $pull: { roles: dbRole._id } });
      Helper.fMsg(res, "Role remove from User");
   } else {
      next(new Error("No user or role to add"));
   }
}

const addPermit = async (req, res, next) => {
   let dbUser = await DB.findById(req.body.userId);
   let dbPermit = await PermitDB.findById(req.body.permitId);

   if (dbUser && dbPermit) {
      let hasPermit = dbUser.permits.find(perm => perm.equals(dbPermit._id));
      if (hasPermit) {
         next(new Error("Permit Already Exist!"));
      } else {
         await DB.findByIdAndUpdate(dbUser._id, { $push: { permits: dbPermit._id } });
         Helper.fMsg(res, "Permit added to User");
      }
   } else {
      next(new Error("No user or permit to add"));
   }
}

const removePermit = async (req, res, next) => {
   let dbUser = await DB.findById(req.body.userId);
   let dbPermit = await PermitDB.findById(req.body.permitId);

   if (dbUser && dbPermit) {
      let hasPermit = dbUser.permits.find(perm => perm.equals(dbPermit._id));
      if (hasPermit) {
         await DB.findByIdAndUpdate(dbUser._id, { $pull: { permits: dbPermit._id } });
         Helper.fMsg(res, "Permit remove from User");
      } else {
         next(new Error("User have not that permission"));
      }
   } else {
      next(new Error("No user or permit to add"));
   }
}

module.exports = {
   login,
   register,
   addRole,
   removeRole,
   addPermit,
   removePermit
}