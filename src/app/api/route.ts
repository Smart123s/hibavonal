import { auth } from "@/auth";

export async function GET(request: Request) {
    const session = await auth();
    return new Response("Hello, world!" + session, {
        headers: { "content-type": "text/plain" },
    });
}