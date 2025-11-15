export default function getAbsoluteSeverUrl(path?: string): string {
    if (!path) {
        return "";
    }

    if (path.startsWith("http")) {
        return path;
    }

    const base = process.env.NEXT_PUBLIC_UPLOADS_BASE_URL  === undefined ? "http://localhost:8000" : process.env.NEXT_PUBLIC_UPLOADS_BASE_URL;
    return `${base}${path}`;
}