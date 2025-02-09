import { Request, Response } from "express"
import { prisma } from "@/prisma"

export default class ProductController {
  // Get all products
  getAll = async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany()
      res.status(200).json(products)
    } catch (err) {
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  // Get a single product by ID
  getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const product = await prisma.product.findUnique({ where: { id } })

      if (!product) {
        return res
          .status(404)
          .json({ errors: { message: "Product not found" } })
      }

      res.status(200).json(product)
    } catch (err) {
      console.error("Error fetching product:", err)
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  // Create a new product
  create = async (req: Request, res: Response) => {
    try {
      const { name, price, description, stockQuantity } = req.body

      // Validate required fields
      if (!name || price === undefined || stockQuantity === undefined) {
        return res.status(400).json({
          errors: { message: "Name, price, and stockQuantity are required" },
        })
      }

      const product = await prisma.product.create({
        data: {
          name,
          price,
          description,
          stockQuantity,
        },
      })

      res.status(201).json(product)
    } catch (err) {
      console.error(err) // Log error for debugging
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  // Update an existing product
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { name, price, description, stockQuantity } = req.body

      // Validate required fields
      if (!name || price === undefined || stockQuantity === undefined) {
        return res.status(400).json({
          errors: { message: "Name, price, and stockQuantity are required" },
        })
      }

      // Update the product in the database
      const updatedProduct = await prisma.product.update({
        where: {
          id,
        },
        data: {
          name,
          price,
          description,
          stockQuantity,
        },
      })

      res.status(200).json(updatedProduct)
    } catch (err) {
      console.error("Error updating product:", err)
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  // Delete a product
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      // Delete the product with the given id
      const deletedProduct = await prisma.product.delete({
        where: {
          id,
        },
      })

      res.status(200).json(deletedProduct) // Respond with the deleted product
    } catch (err) {
      console.error("Error deleting product:", err)
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }
}
