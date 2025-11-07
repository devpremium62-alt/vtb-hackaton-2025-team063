import {GoalType} from "@/entities/goal";
import fetchWrap from "@/shared/lib/fetchWrap";

export async function getGoals(): Promise<GoalType[]> {
    const goals = await fetchWrap("/api/goals");
    return goals.map((goal: GoalType) => ({
        ...goal,
        deadline: new Date(goal.deadline),
    }));
}

export async function addGoal(newGoal: Omit<GoalType, "id" | "moneyCollected">): Promise<GoalType> {
    const goal = await fetchWrap("/api/goals", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newGoal),
    });

    goal.deadline = new Date(goal.deadline);
    return goal;
}

export async function deleteGoal(goalId: number): Promise<void> {
    await fetchWrap(`/api/goals/?id=${goalId}`, {
        method: "DELETE",
    });
}