const DB = require('../models/subcat');
const CatDB = require('../models/cat');
const Helper = require('../utils/helper');

let add = async (req, res, next) => {
   let dbSubcat = await DB.findOne({ name: req.body.name });
   if (dbSubcat) {
      next(new Error("Sub Category name is alrady in use!"));
   } else {
      let result = await new DB(req.body).save();
      let category = await CatDB.findById(req.body.catId);
      await CatDB.findByIdAndUpdate(category._id, { $push: { subcats: result._id } });
      Helper.fMsg(res, "Subcat Saved!", result);
   }
}
let all = async (req, res) => {
   let result = await DB.find();
   Helper.fMsg(res, "All models!", result)
}
let get = async (req, res, next) => {
   let result = await DB.findById(req.params.id);
   if (result) {
      Helper.fMsg(res, "Single Subcat!", result);
   } else {
      next(new Error("No Sub Category with that id"));
   }
}
let patch = async (req, res, next) => {
   let dbSubCat = await DB.findById(req.params.id);
   if (dbSubCat) {
      await DB.findByIdAndUpdate(dbSubCat._id, req.body);
      let result = await DB.findById(dbSubCat._id);
      Helper.fMsg(res, "Sub Category Patched", result)
   } else {
      next(new Error("No Sub Category with that id"));
   }
}
let drop = async (req, res) => {
   let dbSubCat = await DB.findByIdAndDelete(req.params.id);
   if (dbSubCat) {
      let category = await CatDB.findById(dbSubCat.catId);
      await CatDB.findByIdAndUpdate(category._id, { $pull: { subcats: dbSubCat._id } });
      await DB.findByIdAndDelete(dbSubCat._id);
      Helper.fMsg(res, "Sub Category Deleted");
   } else {
      next(new Error("No Sub Category with that id"));
   }
}

module.exports = {
   add,
   all,
   get,
   patch,
   drop,
}
