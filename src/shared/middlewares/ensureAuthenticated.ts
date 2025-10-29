
import * as jose from 'jose';
import { TokenPayload } from '../types/auth';

const SECRET = new TextEncoder().encode("sua-chave-secreta-super-segura");

export async function requireAuth(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Token faltando' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = await validarToken(token);

    if (!payload) {
        return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
    }

    // @ts-ignore
    request.user = payload;
    return null;
}

export async function validarToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jose.jwtVerify(token, SECRET);

        if (
            typeof payload.usuario === 'string' &&
            typeof payload.empresa === 'string' &&
            typeof payload.tipo === 'string'
        ) {
            return {
                usuario: payload.usuario,
                empresa: payload.empresa,
                tipo: payload.tipo as TokenPayload['tipo']
            };
        }
        return null;
    } catch {
        return null;
    }
}

export async function gerarToken(payload: TokenPayload): Promise<string> {
    return new jose.SignJWT(payload as unknown as jose.JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(SECRET);
}