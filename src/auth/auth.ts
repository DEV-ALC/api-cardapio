import * as jose from 'jose';
import { TokenPayload, LoginBody } from '../types';
import { Env } from '../utils';

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

export async function loginEmpresa(request: Request, env: Env, validarSenha: (senha: string, hash: string) => Promise<boolean>, respostaCors: (data: any, status?: number) => Response): Promise<Response> {
  try {
    const body: LoginBody = await request.json();

    // 1. Busca o usuário no banco
    const res = await env.D1_BANCO
      .prepare("SELECT empresa_id, usuario_nome, senha FROM usuario WHERE usuario_nome = ?")
      .bind(body.usuario)
      .first<{ empresa_id: string; usuario_nome: string; senha: string }>();

    if (!res) {
      // Se não encontrou o usuário
      return respostaCors("Usuário ou senha incorretos", 401);
    }

    // 2. Valida a senha
    const senhaValida = await validarSenha(body.senha, res.senha);
    if (!senhaValida) {
      return respostaCors("Usuário ou senha incorretos", 401);
    }

    // 3. Gera o token
    const token = await gerarToken({
      usuario: res.usuario_nome,
      empresa: res.empresa_id,
      tipo: 'admin' as TokenPayload['tipo']
    });

    // 4. Retorna sucesso
    return respostaCors({ token, usuario: res.usuario_nome, empresa: res.empresa_id });

  } catch (error) {
    // Lidar com erros de parsing do JSON ou outros erros inesperados
    console.error("Erro durante o login:", error);
    return respostaCors("Erro interno do servidor", 500);
  }
}


export async function loginSoftHouse(request: Request, env: Env, validarSenha: (senha: string, hash: string) => Promise<boolean>, respostaCors: (data: any, status?: number) => Response): Promise<Response> {
  try {
    const body: LoginBody = await request.json();
    const res = await env.D1_BANCO
      .prepare("SELECT softhouse_id, usuario_nome, senha FROM usuariosofthouse WHERE usuario_nome = ?")
      .bind(body.usuario)
      .first<{ softhouse_id: string; usuario_nome: string; senha: string }>();
    if (!res) return respostaCors("Usuário ou senha incorretos", 401);

    const senhaValida = await validarSenha(body.senha, res.senha);
    if (!senhaValida) return respostaCors("Usuário ou senha incorretos", 401);

    const token = await gerarToken({ usuario: res.usuario_nome, empresa: res.softhouse_id, tipo: 'softhouse' as TokenPayload['tipo'] });
    return respostaCors({ token, usuario: res.usuario_nome, empresa: res.softhouse_id });
  } catch (error) {
    // Lidar com erros de parsing do JSON ou outros erros inesperados
    console.error("Erro durante o login:", error);
    return respostaCors("Erro interno do servidor", 500);
  }
}



