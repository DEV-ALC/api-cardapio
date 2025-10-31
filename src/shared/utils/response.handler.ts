export function respostaCors(data: any, status: number = 200) {
    const body = typeof data === 'string' ? { message: data } : data;
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
