export async function fetchMock(url: string, data?: any): Promise<any> {
    // Server-side: use internal Docker network URL
    // Client-side: use relative URLs to call Next.js API routes
    const baseUrl =
        typeof window === "undefined"
            ? process.env.MOCK_BASE_URL_INTERNAL || "http://frontend:3000"
            : ""; // Use relative URLs in browser to call Next.js API routes

    const response = await fetch(`${baseUrl}${url}`, {
        cache: "no-store",
        ...data
    });

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function fetchData(url: string, data?: any): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}${url}`, data);

    if (response.status === 204) {
        return null;
    }

    return response.json();
}