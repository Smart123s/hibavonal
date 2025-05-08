// https://github.com/omermecitoglu/next-openapi-json-generator/issues/33#issuecomment-2811604527
export const dynamic = 'force-static';
import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";

export async function GET() {
    const spec = await generateOpenApiSpec({

    });
    return Response.json(spec);
}