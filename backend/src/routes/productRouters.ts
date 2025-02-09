import { Router } from "express"
import productController from "../controllers/productController"

const productRouters = Router()
const product = new productController()

productRouters.get("/", product.getAll)
productRouters.post("/", product.create) // Add this line!

export default productRouters
