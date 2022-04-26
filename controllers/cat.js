const DB = require('../models/cat');
const Helper = require('../utils/helper');

let add = async (req, res, next) => {
   const dbCat = await DB.findOne({ name: req.body.name });
   if (dbCat) {
      next(new Error("Category name is already in use"));
   } else {
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "Category Saved!", result)
   }
}

let all = async (req, res) => {
   let result = await DB.find().populate({
      path:'subcats',
      populate:{
         path:'childcats',
         model:'childcat'
      }
   });
   Helper.fMsg(res, "All Categores!", result)
}

let get = async (req, res, next) => {
   let result = await DB.findById(req.params.id);
   if (result) {
      Helper.fMsg(res, "Single Category", result);
   } else {
      next(new Error("No Category with that id"));
   }
}
let patch = async (req, res) => {
   let dbCat = await DB.findById(req.params.id);
   if (dbCat) {
      await DB.findByIdAndUpdate(req.params.id, req.body);
      let result = await DB.findById(req.params.id);
      Helper.fMsg(res, "Single Category!", result);
   } else {
      next(new Error("No Category with that id"));
   }
}
let drop = async (req, res) => {
   let dbCat = await DB.findById(req.params.id);
   if (dbCat) {
      await DB.findByIdAndDelete(req.params.id);
      Helper.fMsg(res, "Single Category Deleted!");
   } else {
      next(new Error("No Category with that id"));
   }
}

module.exports = {
   add,
   all,
   get,
   patch,
   drop,
}
