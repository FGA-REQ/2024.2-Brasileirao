import { Router } from "express"
import userController from "../controllers/userController"

const userRouters = Router()
const user = new userController()

userRouters.post("/", user.create)
userRouters.post("/login", user.login)
userRouters.get("/:id", user.profile)
userRouters.put("/:id/changeRole", user.changeRole)
export default userRouters
