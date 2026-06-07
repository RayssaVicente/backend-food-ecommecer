import 'dotenv/config'; 

import express from "express";
import type { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import type { ProductData} from "./interfaces/ProductData.js"
import type { CustomerData } from "./interfaces/CustomerData.js"
import type { PaymentData } from "./interfaces/PaymentData.js"
import CheckoutService from "./services/CheckoutService.js"

import cors from 'cors';

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response) => {
  return res.send("API rodando 🚀")
})

app.get("/products", async (req: Request, res: Response) => {
  try {
    const { category } = req.query

    if (!category) {
      return res.status(400).send({ error: "Category is required" })
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          equals: category as string,
        },
      },
    })

    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" })
  }
})

interface CheckoutRequest extends Request {
    body: {
        cart : ProductData[]
        customer: CustomerData
        payment: PaymentData
    }
}


app.post("/checkout", async (req: Request, res: Response) => {
    // Altere a desestruturação para capturar 'payment' e nomeá-lo como 'payment'
    const { cart, customer, payment } = req.body; 

    try {
        const checkoutService = new CheckoutService();
        // Passe o 'payment' corretamente
        const orderCreated = await checkoutService.process(cart, customer, payment);

        return res.status(200).send(orderCreated);
    } catch (error) {
        console.error("Erro no checkout:", error);
        return res.status(500).send({ message: "Erro ao processar checkout" });
    }
});

app.get("/orders/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: { orderItems: { include: { product: true } } }
    });
    if (!order) return res.status(404).send({ message: "Pedido não encontrado" });
    return res.json(order);
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀")
})