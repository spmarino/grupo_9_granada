var express = require('express');
var router = express.Router();
let adminController = require('../controllers/adminController')
const userCheck = require('../middlewares/userCheck')
const adminNotCheck = require('../middlewares/adminNotCheck')


/*MIDDLEWARES*/
const upload = require('../middlewares/uploadImg');


/* GET home page. */
router.get('/',userCheck,adminNotCheck, adminController.adminIndex)
router.get('/filter',userCheck,adminNotCheck, adminController.adminFilter)
router.get('/search',userCheck,adminNotCheck, adminController.adminSearch)
router.get('/products',userCheck,adminNotCheck, adminController.productList)
router.get('/products/create',userCheck,adminNotCheck, adminController.productLoad)
router.post('/products/create',userCheck,adminNotCheck, upload.any(), adminController.productNew)
router.get('/products/edit/:id',userCheck,adminNotCheck,  adminController.productEdit)
router.put('/products/edit/:id',userCheck,adminNotCheck, upload.any(), adminController.productUpdate)
router.get('/products/:id',userCheck,adminNotCheck,  adminController.productDetailAdmin)
router.delete('/products/delete/:id',userCheck,adminNotCheck, adminController.productDestroit)


module.exports = router;
