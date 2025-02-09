import { Request, Response } from "express"
import { prisma } from "@/prisma"

export default class RentalController {
  // Get all rentals
  getAll = async (req: Request, res: Response) => {
    try {
      const rentals = await prisma.rental.findMany({
        include: {
          user: true, // Include the associated user
          product: true, // Include the associated product
        },
      })
      res.status(200).json(rentals)
    } catch (err) {
      console.error("Error fetching rentals:", err)
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  // Get a single rental by ID
  getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const rental = await prisma.rental.findUnique({
        where: { id },
        include: {
          user: true, // Include the associated user
          product: true, // Include the associated product
        },
      })

      if (!rental) {
        return res.status(404).json({ errors: { message: "Rental not found" } })
      }

      res.status(200).json(rental)
    } catch (err) {
      console.error("Error fetching rental:", err)
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  // Create a new rental
  create = async (req: Request, res: Response) => {
    try {
      const { userId, productId, startDate, endDate } = req.body

      // Validate required fields
      if (!userId || !productId || !startDate || !endDate) {
        return res.status(400).json({
          errors: {
            message: "userId, productId, startDate, and endDate are required",
          },
        })
      }

      const rental = await prisma.rental.create({
        data: {
          userId,
          productId,
          startDate,
          endDate,
        },
        include: {
          user: true, // Include the associated user
          product: true, // Include the associated product
        },
      })

      res.status(201).json(rental)
    } catch (err) {
      console.error("Error creating rental:", err)
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  // Update an existing rental
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { startDate, endDate } = req.body

      // Validate required fields
      if (!startDate || !endDate) {
        return res.status(400).json({
          errors: { message: "startDate and endDate are required" },
        })
      }

      // Update the rental in the database
      const updatedRental = await prisma.rental.update({
        where: {
          id,
        },
        data: {
          startDate,
          endDate,
        },
        include: {
          user: true, // Include the associated user
          product: true, // Include the associated product
        },
      })

      res.status(200).json(updatedRental)
    } catch (err) {
      console.error("Error updating rental:", err)
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }

  // Delete a rental
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params

      // Delete the rental with the given id
      const deletedRental = await prisma.rental.delete({
        where: {
          id,
        },
      })

      res.status(200).json(deletedRental) // Respond with the deleted rental
    } catch (err) {
      console.error("Error deleting rental:", err)
      res.status(500).json({ errors: { server: "Server error" } })
    }
  }
}
