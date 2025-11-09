import {BankKey} from "@/entities/bank";

export type UserInput = {
    name: string;
    phone: string;
    image_url: string;
}

export type UserType = {
    name: string;
    gender: string;
    phone: string;
    photo: string;
    code?: number | null;
    banks: BankKey[];
}