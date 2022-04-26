const DB = require('../models/role');
const PermitDB = require('../models/permit');
const Helper = require('../utils/helper');

let add = async (req, res, next) => {
   let dbRole = await DB.findOne({ name: req.body.name });
   if (dbRole) {
      next(new Error("Role name is already in use"));
      return;
   }
   let result = await new DB(req.body).save();
   Helper.fMsg(res, "Role Saved", result);
}
let all = async (req, res) => {
   let result = await DB.find().populate('permits');
   Helper.fMsg(res, "All Roles", result);
}
let get = async (req, res) => {
   let result = await DB.findById(req.params.id);
   Helper.fMsg(res, "Single Role!", result);
}
let patch = async (req, res) => {
   await DB.findByIdAndUpdate(req.params.id, req.body);
   let result = await DB.findById(req.params.id);
   Helper.fMsg(res, "Role Updated!", result);
}
let drop = async (req, res) => {
   let result = await DB.findByIdAndDelete(req.params.id);
   Helper.fMsg(res, "Role Deleted!", result);
}

let roleAddPermit = async (req, res, ext) => {
   let dbRole = await DB.findById(req.body.roleId);
   let dbPermit = await PermitDB.findById(req.body.permitId);
   await DB.findByIdAndUpdate(dbRole._id, { $push: { permits: dbPermit._id } });
   Helper.fMsg(res, "Permission Added to Role");
}
let roleRemovePermit = async (req, res, ext) => {
   let dbRole = await DB.findById(req.body.roleId);
   let dbPermit = await PermitDB.findById(req.body.permitId);
   await DB.findByIdAndUpdate(dbRole._id, { $pull: { permits: dbPermit._id } });
   Helper.fMsg(res, "Permission Remove From Role");
}

module.exports = {
   add,
   all,
   get,
   patch,
   drop,
   roleAddPermit,
   roleRemovePermit
}
