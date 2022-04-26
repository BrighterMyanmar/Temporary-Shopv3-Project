require('dotenv').config();
const express = require('express'),
   app = express(),
   server = require('http').createServer(app),
   io = require('socket.io')(server),
   fileUpload = require('express-fileupload'),
   mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DbName}`);

app.use(fileUpload());
app.use(express.json());

const { migrate } = require('./migrations/migrator');
const permitRouter = require('./routes/permit');
const roleRoute = require('./routes/role');
const userRoute = require('./routes/user');
const catRoute = require('./routes/cat');
const subcatRoute = require('./routes/subcat');
const childcatRoute = require('./routes/childcat');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');

const { validateToken, validateRole, hasAnyRole, hasAnyPermit } = require('./utils/validator');

app.use('/permits', validateToken(), permitRouter);
app.use('/roles', validateToken(), hasAnyPermit(["CAN_VIEW_PHP", "CAN_VIEW_NODEJS"]), roleRoute);
app.use('/users', userRoute);
app.use('/cats', catRoute);
app.use('/subcats', subcatRoute);
app.use('/childcats', childcatRoute);
app.use('/products', productRoute);
app.use('/order', validateToken(), orderRoute);


app.use((err, req, res, next) => {
   err.status = err.status || 200;
   res.status(err.status).json({ con: false, msg: err.message });
});

const jwt = require('jsonwebtoken');
const Helper = require('./utils/helper');

io.of('/chat').use(async (socket, next) => {
   let token = socket.handshake.query.token;
   if (token) {
      let decoded = jwt.decode(token, process.env.SECRET_KEY);
      let user = await Helper.get(decoded._id);
      if (user) {
         socket.userData = user;
         next();
      } else {
         next(new Error("Tokenization Error!"));
      }
   } else {
      next(new Error("Token Validation Error"));
   }
}).on('connection', socket => {
   require('./utils/chat').initialize(io, socket);
})

const insert = async () => {
   const migrator = require('./migrations/migrator');
   migrator.rolepermitMigrate();
   migrator.migrate();
   // migrator.backup();
}
// insert();


server.listen(process.env.PORT, console.log(`Server is running at port ${process.env.PORT}`));

