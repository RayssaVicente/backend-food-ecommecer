import type { ProductData } from "../interfaces/ProductData.js"
import type { CustomerData } from "../interfaces/CustomerData.js"
import type { PaymentData } from "../interfaces/PaymentData.js"

import type { Order } from '@prisma/client';

import { PrismaClient } from "@prisma/client"

import PaymantService from "./PaymantSevice.js";

export default class CheckoutService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async process(
        cart: ProductData[], 
        customer: CustomerData, 
        paymentMethod: PaymentData
    ): Promise<{id: number, transactionId: string, status: string}> {
        // Todo: "puxar " os dados de produtos do banco de dados
        const products = await this.prisma.product.findMany({
            where:{
                id:{
                    in: cart.map((product) => product.id),
                }
            }
        })
        console.log(`products`,products)

        const ProductInCart = products.map((product) => {
            // 1. Busca o item no carrinho uma única vez por iteração
            const cartItem = cart.find((item) => item.id === product.id);
            
            // 2. Define a quantidade (se não achar, assume 0 ou 1 dependendo da sua lógica)
            const quantity = cartItem?.quantity || 0;
            const price = Number(product.price);

            return {
                ...product,
                price: price,
                quantity: quantity,
                subTotal: quantity * price,
            };

           
        });
        console.log(`ProductInCart`,ProductInCart)




        // Todo: registrar os dados do cliente no banco de dados
        const costumerCreated = await this.createCustomer(customer)
        console.log(`costumerCreated`,costumerCreated)
        
        
        // Todo: criar uma order
        let orderCreated = await this.createOrder(ProductInCart, costumerCreated)
        console.log(`orderCreated`,orderCreated)

        // Todo: processar o pagamento
        const { transactionId, status} = await new PaymantService().process(orderCreated, costumerCreated, paymentMethod)

        orderCreated = await this.prisma.order.update({
            where: { id: orderCreated.id },
            data: { 
                transactionId: transactionId,
                status: status,
             },
        })

        return{
            id: orderCreated.id,
            transactionId: orderCreated.transactionId!,
            status: orderCreated.status,
        }

    }

    private async createCustomer(customer: CustomerData) {
            const customerCreated = await this.prisma.customer.upsert({
            where: { email: customer.email },
            update: customer,
            create: customer,
            })

            return customerCreated
    }

    private async createOrder(productsInCart: any[], customer: any): Promise<Order> {
    const total = productsInCart.reduce((acc, item) => acc + item.subTotal, 0);

    return await this.prisma.order.create({
        data: {
            total,
            customer: {
                connect: { id: customer.id },
            },
            orderItems: {
                create: productsInCart.map((product) => ({
                    productId: product.id, // Apenas o ID direto
                    quantity: product.quantity,
                    subTotal: product.subTotal,
                })),
            },
        },
        include: {
            customer: true,
            orderItems: { include: { product: true } },
        },
    });
}


}

