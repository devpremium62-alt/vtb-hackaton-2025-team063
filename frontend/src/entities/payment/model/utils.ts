import {PaymentType} from "@/entities/payment";

export function isPaymentPayed(payment: PaymentType) {
    return payment.payed;
}

export function isPaymentExpired(payment: PaymentType) {
    return Date.now() > payment.date.getTime() && !payment.payed;
}

export function isPaymentActual(payment: PaymentType) {
    return Date.now() < payment.date.getTime() && !payment.payed;
}