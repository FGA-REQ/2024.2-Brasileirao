import { Router } from "express"
import productController from "../controllers/productController"

const productRouters = Router()
const product = new productController()

productRouters.get("/", product.getAll)
productRouters.post("/", product.create)
productRouters.get("/:id", product.getOne)
productRouters.delete("/:id", product.delete)
productRouters.put("/:id", product.update)

export default productRouters
