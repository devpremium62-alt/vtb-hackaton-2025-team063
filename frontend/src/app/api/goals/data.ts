import {GoalType} from "@/entities/goal";

let goals: GoalType[] = [
    {
        id: 1,
        name: "Купить ноутбук",
        moneyNeed: 150000,
        moneyCollected: 20000,
        deadline: new Date("2025-12-01"),
        avatar: "target",
    },
    {
        id: 2,
        name: "Путешествие",
        moneyNeed: 100000,
        moneyCollected: 40000,
        deadline: new Date("2025-09-01"),
        avatar: "vacation",
    },
];

export function getGoals() {
    return goals.sort((g1, g2) => new Date(g1.deadline).getTime() - new Date(g2.deadline).getTime());
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
