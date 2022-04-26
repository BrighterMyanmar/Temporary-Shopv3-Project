const router = require('express').Router();
const controller = require('../controllers/order');


router.post('/', controller.add)
router.get('/my', controller.getMyOrders)

module.exports = router;