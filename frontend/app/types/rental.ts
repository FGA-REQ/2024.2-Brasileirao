export type Rental = {
    id: string
    userId: string
    productId: string
    startDate: string
    endDate: string
    user?: {
        id: string
        name: string
    }
    product?: {
        id: string
        name: string
    }
} 