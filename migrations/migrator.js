const fs = require('fs');
const DB = require('../models/user');
const RoleDB = require('../models/role');
const PermitDB = require('../models/permit');
const Helper = require('../utils/helper');

const storage = filename => `./migrations/${filename}.json`;

const readFile = filename => JSON.parse(fs.readFileSync(storage(filename)));

const migrate = () => {
   let users = readFile('users');
   // users = users.map(user => user.pssword = Helper.encode(user.password));
   users.forEach(async user => {
      user.password = Helper.encode(user.password);
      let ownerResult = await new DB(user).save();
      console.log(ownerResult);
      let ownerRole = await RoleDB.findOne({ name: "OWNER" });
      await DB.findByIdAndUpdate(ownerResult._id, { $push: { roles: ownerRole._id } });
      let owner = await DB.findById(ownerResult._id).populate('roles');
      console.log(owner)
   });
   // users.forEach(async user => await new DB(user).save());
}

const backup = async () => {
   let users = await DB.find();
   fs.writeFileSync(storage('users'), JSON.stringify(users));
   console.log("Users Backuedup");
}

const rolepermitMigrate = async () => {
   const rp = readFile('rolepermits');
   rp.roles.forEach(async (role) => {
      let result = await new RoleDB(role).save();
      console.log(result);
   });
   rp.permits.forEach(async (permit) => {
      let result = await new PermitDB(permit).save();
      console.log(result);
   });
}

module.exports = {
   migrate,
   backup,
   rolepermitMigrate,
}