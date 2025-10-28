export function respostaCors(body: any, status = 200): Response {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    const responseBody = typeof body === 'string' ? body : JSON.stringify(body);

    return new Response(responseBody, { status, headers });
}