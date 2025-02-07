import { Request, Response } from "express"
import { prisma } from "@/prisma"

export default class productController {
  getAll = async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany()
      res.status(200).json(products)
    } catch (err) {
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }
}
