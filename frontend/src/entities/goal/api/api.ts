import {GoalType} from "@/entities/goal";
import { fetchMock } from "@/shared/lib/fetchMock";
import universalFetch from "@/shared/lib/universalFetch";

export async function getGoals(): Promise<GoalType[]> {
    const goals = await universalFetch<GoalType[]>("/goals");
    return goals.map((goal: GoalType) => ({
        ...goal,
        date: new Date(goal.date),
    }));
}

export async function addGoal(newGoal: Omit<GoalType, "id" | "collected">): Promise<GoalType> {
    const goal = await universalFetch<GoalType>("/goals", {
        method: "POST",
        body: newGoal,
    });

    goal.date = new Date(goal.date);
    return goal;
}

export async function deleteGoal(goalId: number): Promise<void> {
    await universalFetch(`/goals/${goalId}`, {
        method: "DELETE",
    });
}