export type PartnerType = {
    avatar: string;
    name: string;
    status: "connected" | "waiting" | "disconnected";
    date: Date;
}