import { Router } from "express"
import homeRoutes from "./homeRouters"
import userRoutes from "./userRouters"
import productRouters from "./productRouters"
import rentalRouters from "./rentalRouters"

const router = Router()

router.use("/", homeRoutes)
router.use("/user", userRoutes)
router.use("/products", productRouters)
router.use("/rentals", rentalRouters)

export { router }
