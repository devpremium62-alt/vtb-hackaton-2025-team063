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

export type UserFromResponse = {
    id: number;
    name: string;
    phone: string;
    image_url: string;
}

export type UserResponse = {
    access_token: string;
    token_type: "bearer";
    epires_in: number;
    user: UserFromResponse;
}