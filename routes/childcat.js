const router = require('express').Router();
const controller = require('../controllers/childcat');
const { saveFile } = require('../utils/gallery');


router.post('/', [saveFile, controller.add])
router.get('/', controller.all)

router.route('/:id')
   .get(controller.get)
   .patch(saveFile, controller.patch)
   .delete(controller.drop)

module.exports = router;