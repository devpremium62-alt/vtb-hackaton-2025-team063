import fetchWrap from "@/shared/lib/fetchWrap";
import {PaymentType} from "@/entities/payment";

export async function getPayments(): Promise<PaymentType[]> {
    const payments = await fetchWrap("/api/payments");
    return payments.map((payment: PaymentType) => ({
        ...payment,
        date: new Date(payment.date),
    }));
}

export async function addPayment(newPayment: Omit<PaymentType, "id" | "payed" | "category"> & {category: number}): Promise<PaymentType> {
    const payment = await fetchWrap("/api/payments", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newPayment),
    });

    payment.date = new Date(payment.date);
    return payment;
}

export async function deletePayment(paymentId: number): Promise<void> {
    await fetchWrap(`/api/payments/?id=${paymentId}`, {
        method: "DELETE",
    });
}