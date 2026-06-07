import { type Order, type Customer, OrderStatus } from "@prisma/client";
import { api } from "../lib/api.js";
import type { PaymentData } from "../interfaces/PaymentData.js";

export default class PaymantService {
    async process(order: Order, customer: Customer, payment: PaymentData) {
        try {
            // 1. Criar ou buscar o customer no Asaas
            const customerId = await this.createCustomer(customer);
            console.log(`customerId`, customerId);

            // 2. Processar a transação
            const transaction = await this.createTransaction(customerId, order, customer, payment);

            return {
                transactionId: transaction.transactionId,
                status: OrderStatus.PAID, 
            };
        } catch (error) {
            console.error("Erro ao processar pagamento:", error);
            throw error; 
        }
    }

    private async createCustomer(customer: Customer): Promise<string> {
        const customerResponse = await api.get(`customers?email=${customer.email}`);

        if (customerResponse.data?.data?.length > 0) {
            return customerResponse.data?.data[0]?.id;
        }

        const customerParams = {
            name: customer.fullName,
            email: customer.email,
            mobilePhone: customer.mobile,
            cpfCnpj: customer.document,
            postalCode: customer.zipCode,
            address: customer.street,
            addressNumber: customer.number,
            complement: customer.complement,
            province: customer.neighborhood,
            notificationDisabled: true,
        };

        const response = await api.post('/customers', customerParams);
        return response.data?.id;
    }

    private async createTransaction(customerId: string, order: Order, customer: Customer, payment: PaymentData) {
        const paymentParams = {
            customer: customerId, // Corrigido de custiomerId para customerId
            billingType: "CREDIT_CARD",
            dueDate: new Date().toISOString().split('T')[0],
            value: order.total,
            description: `Pedido #${order.id}`,
            externalReference: order.id.toString(),
            creditCard: {
                holderName: payment.creditCardHolder,
                number: payment.creditCardNumber,
                expiryMonth: payment.creditCardExpiration.split('/')[0],
                expiryYear: payment.creditCardExpiration.split('/')[1],
                ccv: payment.creditCardSecurityCode,
            },
            creditCardHolderInfo: {
                name: customer.fullName,
                email: customer.email,
                cpfCnpj: customer.document,
                postalCode: customer.zipCode,
                address: customer.street,
                addressNumber: customer.number,
                addressComplement: customer.complement,
                mobilePhone: customer.mobile,
            }
        };

        const response = await api.post('/payments', paymentParams);

        return {
            transactionId: response.data?.id,
            gatewayStatus: response.data?.status,
        };
    }
}