const router = require('express').Router();
const controller = require('../controllers/role');
const { PermitSchema, AllSchema } = require('../utils/schema');
const { validateBody, validateParam } = require('../utils/validator');


router.post('/', [validateBody(PermitSchema.add), controller.add]);
router.get('/', controller.all);
router.post('/add/permit', [validateBody(PermitSchema.roleAddPermit), controller.roleAddPermit]);
router.post('/remove/permit', [validateBody(PermitSchema.roleAddPermit), controller.roleRemovePermit]);

router.route('/:id')
   .get(validateParam(AllSchema.id, "id"), controller.get)
   .patch(validateParam(AllSchema.id, "id"), controller.patch)
   .delete(validateParam(AllSchema.id, "id"), controller.drop)

module.exports = router;