const DB = require('../models/childcat');
const SubCatDB = require('../models/subcat');
const Helper = require('../utils/helper');

let add = async (req, res, next) => {
   let dbChildCat = await DB.findOne({ name: req.body.name });
   if (dbChildCat) {
      next(new Error("Child Category name is already in use!"));
   } else {
      let result = await new DB(req.body).save();
      let subcat = await SubCatDB.findById(result.subcatId);
      console.log("Parent", subcat);
      await SubCatDB.findByIdAndUpdate(subcat._id, { $push: { childcats: result._id } });
      Helper.fMsg(res, "ChildCat Saved!", result);
   }
}
let all = async (req, res) => {
   let result = await DB.find();
   res.send({ con: true, 'msg': "All ChildCats!", result });
}
let get = async (req, res, next) => {
   let result = await DB.findById(req.params.id);
   if (result) {
      Helper.fMsg(res, "Single ChildCat!", result);
   } else {
      next(new Error("No cat with that id"));
   }
}
let patch = async (req, res) => {
   let dbChildCat = await DB.findById(req.params.id);
   if (dbChildCat) {
      await DB.findByIdAndUpdate(dbChildCat._id, req.body);
      let result = await DB.findById(dbChildCat._id);
      res.send({ con: true, 'msg': "Single ChildCat!", result });
   } else {
      next(new Error("No cat with that id"));
   }
}
let drop = async (req, res) => {
   let dbChildCat = await DB.findById(req.params.id);
   if (dbChildCat) {
      let result = await DB.findByIdAndDelete(dbChildCat._id);
      Helper.fMsg(res, "ChildCat! Deleted");
   } else {
      next(new Error("No cat with that id"));
   }

}

module.exports = {
   add,
   all,
   get,
   patch,
   drop,
}
