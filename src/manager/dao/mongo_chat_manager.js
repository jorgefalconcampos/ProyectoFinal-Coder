const { chatModel } = require("./models/chats_model.js");

class ChatManagerMongo {
  async addChat(newChat) {
    console.log(newChat);

    return await chatModel.create(newChat);
  }
}

module.exports = new ChatManagerMongo();
