export async function fetchMock(url: string, data?: any): Promise<any> {
    const baseUrl =
        typeof window === "undefined"
            ? process.env.MOCK_BASE_URL_INTERNAL
            : process.env.NEXT_PUBLIC_MOCK_BASE_URL;

    const response = await fetch(`${baseUrl || "http://localhost:3000"}${url}`, {
        cache: "no-store",
        ...data
    });

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function fetchData(url: string, data?: any): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${url}`, data);

    if (response.status === 204) {
        return null;
    }

    return response.json();
}