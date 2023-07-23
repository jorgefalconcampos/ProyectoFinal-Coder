const { orderModel } = require("./models/orders_model");

class OrderManagerMongo {

  async getAllOrders() {
    return await orderModel.find({});
  }
  
  async getOrderById (oid) {
    return await orderModel.findOne({_id: oid}).lean();
    }
}