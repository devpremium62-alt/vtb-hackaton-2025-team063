export default async function fetchWrap(url: string, data?: any): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${url}`, {
        cache: "no-store",
        ...data
    });

    if (response.status === 204) {
        return null;
    }

    return response.json();
}