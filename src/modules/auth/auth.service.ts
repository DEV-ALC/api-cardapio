import * as jose from 'jose';
import { TokenPayload, LoginBody, Env } from '../../shared/types/types';
import { gerarHash, validarSenha } from '../../shared/utils/crypto.utils'
import { respostaCors } from '../../shared/utils/response.handler';
import { gerarToken, } from '../../shared/middlewares/ensureAuthenticated'



export async function authenticateEmpresaService(body: LoginBody, env: Env): Promise<Response> {
  try {


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


export async function authenticateSoftHouseService(body: LoginBody, env: Env): Promise<Response> {
  try {

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



