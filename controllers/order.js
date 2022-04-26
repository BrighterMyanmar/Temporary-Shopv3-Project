const DB = require('../models/order');
const OrderItemDB = require('../models/orderItems');
const ProductDB = require('../models/product');
const Helper = require('../utils/helper');

const add = async (req, res, next) => {
   const user = req.user;
   const items = req.body.items;

   let saveOreder = new DB();
   let orderItemsObj = [];
   let total = 0;

   for await (let item of items) {
      let product = await ProductDB.findById(item.id);
      let obj = {
         order: saveOreder._id,
         count: item.count,
         productId: product._id,
         name: product.name,
         price: product.price,
      };
      orderItemsObj.push(obj);
      total += product.price * item.count;
   }
   let orderItemsResult = await OrderItemDB.insertMany(orderItemsObj);
   let orderItemIds = orderItemsResult.map(item => item._id);

   saveOreder.user = user._id;
   saveOreder.items = orderItemIds;
   saveOreder.count = items.length;
   saveOreder.total = total;

   let result = await saveOreder.save();

   Helper.fMsg(res, "Order Accepted", result);
}

let getMyOrders = async(req,res,next) =>{
   let authUser = req.user;
   let orders = await DB.find({user:authUser._id}).populate('items');
   Helper.fMsg(res,"All Ur orders",orders);
}

module.exports = {
   add,
   getMyOrders
}