import express from 'express'
import { AddProduct, DeleteProduct, EditProduct, GetAllProduct, GetProductbyId } from '../Controllar/ProductControllar.js'
import { uploadProductImages } from '../Middleware/Multer.js';


const ProductRoute = express.Router()


ProductRoute.post("/add-product", (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, AddProduct);

ProductRoute.get('/get-all-product', GetAllProduct)

ProductRoute.get('/get-prduct-byid/:id', GetProductbyId)

ProductRoute.delete('/delete-product/:id', DeleteProduct)

ProductRoute.put(
  "/edit-product/:id",
  (req, res, next) => {
    uploadProductImages(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  EditProduct
);


export default ProductRoute