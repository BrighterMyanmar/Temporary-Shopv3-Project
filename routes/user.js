const router = require('express').Router();
const controller = require('../controllers/user');
const { UserSchema } = require('../utils/schema');
const { validateBody } = require('../utils/validator');


router.post('/', [validateBody(UserSchema.login), controller.login]);
router.post('/register', [validateBody(UserSchema.register), controller.register]);
router.post('/add/role', controller.addRole);
router.post('/remove/role', controller.removeRole);
router.post('/add/permit',controller.addPermit);
router.post('/remove/permit',controller.removePermit);

module.exports = router;