import { Request, Response } from "express"
import { Prisma } from "@prisma/client"
import { ZodError } from "zod"
import { hash, compare } from "bcrypt"
import { prisma } from "@/prisma"
import AuthUser from "@/middleware/authUser"
import { userSchema } from "@/zodSchemas/user.zod"
import { fromZodError } from "zod-validation-error"

export default class UserController {
  getAll = async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
      })

      return res.status(200).json(users)
    } catch (err) {
      console.error("Get all users error:", err)
      return res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const data = userSchema.parse(req.body)
      const hashedPassword = await hash(data.password, 10)

      await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      })
      res.status(201).json(data)
    } catch (err) {
      let inputErr: { email?: string; username?: string } = {}

      if (err instanceof ZodError) {
        return res.status(400).json(fromZodError(err))
      } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const target = err.meta?.target as string[] | undefined

        if (target?.includes("email")) inputErr = { email: "Invalid email" }
        if (target?.includes("username"))
          inputErr = { username: "Username already exists" }

        if (inputErr) return res.status(400).json({ errors: inputErr })
      }

      console.error("Create user error:", err)
      return res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body

      console.log("Login attempt for email:", email) // Debug log

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        console.log("User not found for email:", email) // Debug log
        return res
          .status(400)
          .json({ errors: { loginSchema: "Invalid credentials" } })
      }

      const passwordMatch = await compare(password, user.password)

      if (!passwordMatch) {
        console.log("Invalid password for email:", email) // Debug log
        return res
          .status(400)
          .json({ errors: { loginSchema: "Invalid credentials" } })
      }

      const authUser = new AuthUser()
      const token = authUser.generateToken({ id: user.id })

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token,
        role: user.role,
      })
    } catch (err) {
      console.error("Login error:", err) // Debug log
      return res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  profile = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return res.status(404).json({ errors: { user: "User not found" } })
      }

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    } catch (err) {
      console.error("Profile error:", err)
      return res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  changeRole = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return res.status(404).json({ errors: { user: "User not found" } })
      }

      const newRole = user.role === "CLIENT" ? "ADMIN" : "CLIENT"

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      })

      return res.status(200).json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      })
    } catch (err) {
      console.error("Change role error:", err)
      return res.status(500).json({ errors: { server: "Server error" } })
    }
  }
}
