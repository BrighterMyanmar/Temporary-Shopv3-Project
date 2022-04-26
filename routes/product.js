const router = require('express').Router();
const controller = require('../controllers/product');
const { saveFiles } = require('../utils/gallery');


router.post('/', [saveFiles, controller.add]);
router.get('/:page', controller.paginate);
router.get('/bycat/:page/:id',controller.byCat)

router.route('/:id')
   .patch(controller.patch)
   .delete(controller.drop)

module.exports = router;