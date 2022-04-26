const MessageDB = require('../models/message');
const UnreadDB = require('../models/unread');
const Helper = require('./helper');

let liveUser = async (socketId, user) => {
   user["socketId"] = socketId;
   Helper.set(socketId, user._id);
   Helper.set(user._id, user);
}

let initialize = async (io, socket) => {
   socket["currentUserId"] = socket.userData._id;
   await liveUser(socket.id, socket.userData);

   socket.on('message', data => incommingMessage(io, socket, data));
   socket.on('unreads', data => loadUnReadMsg(socket));
   socket.on('load-more', obj => loadMore(socket, obj));
}
let loadMore = async (socket, obj) => {
   let limit = Number(process.env.MESSAGE_LIMIT);
   let sk = Number(obj.page) == 1 ? 0 : (Number(obj.page) - 1);
   let skipCount = sk * 2;
   let messages = await MessageDB.find({
      $or: [{ from: socket.currentUserId }, { to: socket.currentUserId }]
   }).sort({ created: -1 }).skip(skipCount).limit(limit).populate('from to', 'name _id');
   socket.emit('messages', messages);
}

let loadUnReadMsg = async (socket) => {
   let unreads = await UnreadDB.find({ to: socket.currentUserId });
   if (unreads.length > 0) {
      unreads.forEach(async (unread) => {
         await UnreadDB.findByIdAndDelete(unread._id);
      });
   }
   socket.emit('unreads', { msg: unreads.length });
}

let incommingMessage = async (io, socket, data) => {
   const saveMsg = await new MessageDB(data).save();
   const msgResult = await MessageDB.findById(saveMsg._id).populate('from to', 'name _id');
   const toUser = await Helper.get(msgResult.to._id);

   if (toUser) {
      let toSocket = io.of('/chat').to(toUser.socketId);
      if (toSocket) {
         toSocket.emit('message', msgResult);
      } else {
         console.log("No Socket for to User")
      }
   } else {
      await new UnreadDB({ from: msgResult.from._id, to: msgResult.to._id }).save();
   }
   socket.emit('message', msgResult);
}

module.exports = {
   initialize
}