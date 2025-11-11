import {GoalType} from "@/entities/goal";

let goals: GoalType[] = [
    {
        id: 1,
        name: "Купить ноутбук",
        value: 150000,
        collected: 20000,
        date: new Date("2025-12-01"),
        icon: "target",
    },
    {
        id: 2,
        name: "Путешествие",
        value: 100000,
        collected: 40000,
        date: new Date("2025-09-01"),
        icon: "vacation",
    },
];

export function getGoals() {
    return goals.sort((g1, g2) => new Date(g1.date).getTime() - new Date(g2.date).getTime());
}

export function addGoal(goal: Omit<GoalType, "id">) {
    const newGoal = {
        ...goal,
        id: Math.max(0, ...goals.map((g) => g.id)) + 1,
        moneyCollected: 0,
    };
    goals.push(newGoal);
    return newGoal;
}

export function deleteGoal(goalId: number) {
    goals = goals.filter((goal) => goal.id !== goalId);
}
