import {fetchData} from "@/shared/lib/fetchMock";
import {UserInput, UserResponse} from "@/entities/user";

export async function registerUser(user: UserInput): Promise<UserResponse> {
    return fetchData("/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            ...user,
            image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
            email: "email@example.com",
            "password": "Password123"
        }),
    });
}