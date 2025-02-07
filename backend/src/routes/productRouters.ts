import { Router } from "express"
import productController from "../controllers/productController"

const productRouters = Router()
const product = new productController()

productRouters.get("/", product.getAll)

export default productRouters
