import { TokenPayload, CadastroEmpresaBody, Env } from '../../shared/types/types';
import { respostaCors } from '../../shared/utils/response.handler';

export async function cadastrarEmpresaService(body: CadastroEmpresaBody, env: Env): Promise<Response> {

    const tokenGerado = body.token;
    const expira = new Date();
    expira.setFullYear(expira.getFullYear() + 1);




    await env.D1_BANCO
        .prepare(`
      INSERT INTO empresa (empresa_id, softhouse_id, nome_empresa, slug, token, token_expira, imagem_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
        .bind(
            body.empresa,
            body.softhouse,
            body.nomeEmpresa,
            body.slug,
            tokenGerado,
            expira.toISOString(),
            body.imagemId || null
        )
        .run();

    return respostaCors({ empresa: body.empresa, token: tokenGerado });

}