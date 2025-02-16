import { auth } from "@/auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    const session = await auth();
    return new Response("Hello, world!" + session?.user?.name, {
        headers: { "content-type": "text/plain" },
    });
}
