const DB = require('../models/product');
const Helper = require('../utils/helper');

const add = async (req, res, next) => {
   const dbProduct = await DB.findOne({ name: req.body.name });
   if (dbProduct) {
      next(new Error("Product name is already in use"));
   } else {
      req.body.colors = req.body.colors.split(",");
      let result = await new DB(req.body).save();
      Helper.fMsg(res, "Product Added", result);
   }
}
const paginate = async (req, res, next) => {
   const limit = Number(process.env.PAGE_LIMIT);
   const pageNum = Number(req.params.page);
   const reqPage = pageNum == 1 ? 0 : pageNum - 1;
   const skipCount = limit * reqPage;

   let result = await DB.find().skip(skipCount).limit(limit);
   Helper.fMsg(res, "Paginated Prducts", result);
}

const patch = async (req, res, next) => {
   const dbProduct = await DB.findById(req.params.id);
   if (dbProduct) {
      await DB.findByIdAndUpdate(dbProduct._id, req.body);
      let product = await DB.findById(dbProduct._id);
      Helper.fMsg(res, "Product Updated", product);
   } else {
      next(new Error("No Proudct with that id"));
   }
}

const drop = async (req, res, next) => {
   const dbProduct = await DB.findById(req.params.id);
   if (dbProduct) {
      await DB.findByIdAndDelete(dbProduct._id);
      Helper.fMsg(res, "Product Deleted");
   } else {
      next(new Error("No Proudct with that id"));
   }
}

const byCat = async (req, res, next) => {
   const limit = Number(process.env.PAGE_LIMIT);
   const pageNum = Number(req.params.page);
   const reqPage = pageNum == 1 ? 0 : pageNum - 1;
   const skipCount = limit * reqPage;

   let result = await DB.find({cat:req.params.id}).skip(skipCount).limit(limit);
   Helper.fMsg(res, "Paginated Prducts", result);
}

module.exports = {
   add,
   paginate,
   patch,
   drop,
   byCat
}