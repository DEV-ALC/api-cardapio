import * as jose from 'jose';
import { TokenPayload } from './types';

const SECRET = new TextEncoder().encode("sua-chave-secreta-super-segura");

// Gera token apenas com uuid e tipo
export async function gerarToken(payload: TokenPayload): Promise<string> {
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(SECRET);
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
