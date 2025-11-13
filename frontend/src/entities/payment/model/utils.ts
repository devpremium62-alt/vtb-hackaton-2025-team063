import {PaymentType} from "@/entities/payment";

export function isPaymentPayed(payment: PaymentType) {
    return payment.payed;
}

export function isPaymentExpired(payment: PaymentType) {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    return todayStart > payment.date.getTime() && !payment.payed;
}

export function isPaymentActual(payment: PaymentType) {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    return todayStart <= payment.date.getTime() && !payment.payed;
}