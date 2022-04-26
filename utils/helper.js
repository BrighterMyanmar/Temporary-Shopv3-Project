const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Redis = require('async-redis').createClient();

module.exports = {
   encode: payload => bcrypt.hashSync(payload),
   comparePass: (plain, hash) => bcrypt.compareSync(plain, hash),
   fMsg: (res, msg = "", result = []) => res.status(200).json({ con: true, msg, result }),
   makeToken: payload => jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' }),
   set: async (key, value) => await Redis.set(key.toString(), JSON.stringify(value)),
   get: async key => JSON.parse(await Redis.get(key.toString())),
   drop: async key => await Redis.del(key.toString())
}