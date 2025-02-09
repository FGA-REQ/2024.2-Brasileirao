import { Router } from "express"
import rentalController from "../controllers/rentalController"

const rentalRouters = Router()
const rental = new rentalController()

rentalRouters.get("/", rental.getAll)
rentalRouters.post("/", rental.create)
rentalRouters.get("/:id", rental.getOne)
rentalRouters.delete("/:id", rental.delete)
rentalRouters.put("/:id", rental.update)

export default rentalRouters
