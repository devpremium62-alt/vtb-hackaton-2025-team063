export default async function fetchWrap(url: string, ...args: any[]) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${url}`, {
        cache: "no-store",
        ...args
    });

    return response.json();
}