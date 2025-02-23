import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";

export async function GET() {
    const spec = await generateOpenApiSpec({

    });
    return Response.json(spec);
}