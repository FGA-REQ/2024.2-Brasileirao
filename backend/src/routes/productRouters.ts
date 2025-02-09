import { Router } from "express"
import productController from "../controllers/productController"

const productRouters = Router()
const product = new productController()

productRouters.get("/", product.getAll)
productRouters.post("/", product.create) // Add this line!
productRouters.get("/:id", product.getOne) // Add this route!

export default productRouters
