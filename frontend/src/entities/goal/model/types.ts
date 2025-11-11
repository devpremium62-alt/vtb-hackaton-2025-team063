export type GoalType = {
    id: number;
    name: string;
    icon?: string;
    date: Date;
    value: number;
    bankId: string;
    collected: number;
};