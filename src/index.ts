import { D1Database } from '@cloudflare/workers-types';
import { gerarToken, validarToken, loginEmpresa, loginSoftHouse } from './auth/auth';
import { LoginBody, CadastroEmpresaBody, CadastroUsuarioBody, CadastroProdutoBody, TokenPayload } from './types';
import { gerarHash, validarSenha, Env } from './utils';


export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // === CORS ===
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, tipo',
        },
      });
    }

    // Função helper pra responder com CORS
    const respostaCors = (body: any, status = 200) => {
      return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    };

    // ====================== LOGIN ======================
    if (url.pathname === '/login' && request.method === 'POST') {
      return loginEmpresa(request, env, validarSenha, respostaCors);
    }

    if (url.pathname === '/softhouse' && request.method === 'POST') {
      return loginSoftHouse(request, env, validarSenha, respostaCors);
    }

    if (url.pathname === '/produtos-grupos' && request.method === 'GET') {
      const slug = url.searchParams.get('slug');
      if (!slug) {
        return new Response(
          JSON.stringify({ error: "Parâmetro 'slug' é obrigatório" }),
          {
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // 1. Buscar a empresa pelo slug
      const empresaRes = await env.D1_BANCO
        .prepare("SELECT empresa_id FROM empresa WHERE slug = ?")
        .bind(slug)
        .first<{ empresa: number }>();

      if (!empresaRes || !empresaRes.empresa) {
        return new Response(
          JSON.stringify({ error: "Empresa não encontrada" }),
          {
            status: 404,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const empresaId = empresaRes.empresa;

      // 2. Buscar os produtos dessa empresa
      const res = await env.D1_BANCO
        .prepare(`SELECT produto_id, empresa_id, nome_produto, valor, cod_ba, grupo_id, , imagem_id 
              FROM produtos 
              WHERE empresa_id = ?`)
        .bind(empresaId)
        .all<CadastroProdutoBody>();

      if (!res.results || res.results.length === 0) {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
      }

      return new Response(JSON.stringify(res.results), {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // ====================== ROTAS PROTEGIDAS ======================
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return respostaCors("Token faltando", 401);
    const token = authHeader.split(' ')[1];
    const payload: TokenPayload | null = await validarToken(token);
    if (!payload) return respostaCors("Token inválido ou expirado", 401);

    // ====================== CADASTRAR EMPRESA ======================
    if (url.pathname === '/cadastrar-empresa' && request.method === 'POST') {
      if (payload.tipo !== 'softhouse' && payload.tipo !== 'admin')
        return respostaCors("Permissão negada", 403);

      const body: CadastroEmpresaBody = await request.json();

      const tokenGerado = body.token; // gera se não veio
      const expira = new Date();
      expira.setFullYear(expira.getFullYear() + 1);

      // softhouse vem do token
      const softhouseId = payload.empresa;

      await env.D1_BANCO
        .prepare(`
      INSERT INTO empresa (empresa_id, softhouse_id, nome_empresa, slug, token, token_expira, imagem_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
        .bind(
          body.empresa,
          softhouseId,
          body.nomeEmpresa,
          body.slug,
          tokenGerado,
          expira.toISOString(),
          body.imagemId || null
        )
        .run();

      return respostaCors({ empresa: body.empresa, token: tokenGerado });
    }

    if (url.pathname === '/empresa' && request.method === 'GET') {
      // precisa de autorização
      if (payload.tipo !== 'softhouse' && payload.tipo !== 'admin')
        return respostaCors("Permissão negada", 403);

      // pegar id da empresa que vem no query param
      const empresaId = url.searchParams.get("empresa");
      if (!empresaId) {
        return respostaCors("Parâmetro 'empresa' é obrigatório", 400);
      }

      // busca no banco
      const result = await env.D1_BANCO
        .prepare(`
      SELECT empresa_id, softhouse_id, nome_empresa, slug, token, token_expira, imagem_id
      FROM empresa
      WHERE empresa_id = ?
    `)
        .bind(empresaId)
        .first(); // pega um único registro

      if (!result) {
        return respostaCors("Empresa não encontrada", 404);
      }

      return respostaCors(result); // devolve JSON direto
    }

    // ====================== ATUALIZAR EMPRESA ======================
    if (url.pathname === '/empresa' && request.method === 'PUT') {
      if (payload.tipo !== 'softhouse' && payload.tipo !== 'admin')
        return respostaCors("Permissão negada", 403);

      const body: Partial<CadastroEmpresaBody> & { empresa: string } = await request.json();
      const empresaId = body.empresa;
      if (!empresaId) return respostaCors("Parâmetro 'empresa' é obrigatório", 400);

      const existe = await env.D1_BANCO
        .prepare("SELECT empresa_id FROM empresa WHERE empresa_id = ?")
        .bind(empresaId)
        .first();

      if (!existe) return respostaCors("Empresa não encontrada", 404);

      // Atualiza apenas os campos permitidos
      const updates: string[] = [];
      const valores: any[] = [];

      if (body.nomeEmpresa !== undefined) {
        updates.push("nome_empresa = ?");
        valores.push(body.nomeEmpresa);
      }
      if (body.token !== undefined) {
        updates.push("token = ?");
        valores.push(body.token);
      }
      if (body.tokenExpira !== undefined) {
        updates.push("token_expira = ?");
        valores.push(body.tokenExpira);
      }
      if (body.imagemId !== undefined) {
        updates.push("imagem_id = ?");
        valores.push(body.imagemId);
      }

      if (updates.length === 0) return respostaCors("Nenhum campo para atualizar", 400);

      valores.push(empresaId); // para o WHERE

      await env.D1_BANCO
        .prepare(`UPDATE empresa SET ${updates.join(", ")} WHERE empresa = ?`)
        .bind(...valores)
        .run();

      return respostaCors({ message: "Empresa atualizada com sucesso!" });
    }




    // ====================== LISTAR EMPRESAS ======================
    if (url.pathname === '/empresas' && request.method === 'GET') {
      if (payload.tipo !== 'softhouse') return respostaCors("Permissão negada", 403);

      const res = await env.D1_BANCO
        .prepare("SELECT empresa_id, nome_empresa, slug, imagem_id FROM empresa")
        .all<{ empresa: string; nomeEmpresa: string; slug: string; imagemId: string }>();

      return respostaCors(res.results || []);
    }

    // ====================== CADASTRAR USUÁRIO ======================
    if (url.pathname === '/cadastrar-usuario' && request.method === 'POST') {
      if (payload.tipo !== 'softhouse' && payload.tipo !== 'admin') return respostaCors("Permissão negada", 403);

      const body: CadastroUsuarioBody = await request.json();
      const senhaHash = await gerarHash(body.senha);

      await env.D1_BANCO
        .prepare("INSERT INTO usuario (empresa_id, usuario_nome, senha) VALUES (?, ?, ?)")
        .bind(body.empresa, body.usuario, senhaHash)
        .run();

      return respostaCors("Usuário cadastrado com sucesso!");
    }

    // ====================== LISTAR USUÁRIOS ======================
    // GET /usuarios?empresa=ID_DA_EMPRESA
    if (url.pathname === '/usuarios' && request.method === 'GET') {
      if (payload.tipo !== 'softhouse')
        return respostaCors("Permissão negada", 403);

      const empresaId = url.searchParams.get("empresa");
      if (!empresaId) return respostaCors("Parâmetro 'empresa' obrigatório", 400);

      const res = await env.D1_BANCO
        .prepare("SELECT empresa_id, usuario_id FROM usuario WHERE empresa_id = ?")
        .bind(empresaId)
        .all<{ empresa: string; usuario: string }>();

      return respostaCors(res.results || []);
    }
    // PUT /usuario
    if (url.pathname === '/usuario' && request.method === 'PUT') {
      if (payload.tipo !== 'softhouse' && payload.tipo !== 'admin')
        return respostaCors("Permissão negada", 403);

      const body: { empresa: string; usuario: string; senha: string } = await request.json();
      if (!body.empresa || !body.usuario || !body.senha)
        return respostaCors("Empresa, usuário e senha são obrigatórios", 400);

      const senhaHash = await gerarHash(body.senha); // mesma função que você usa para cadastrar

      await env.D1_BANCO
        .prepare("UPDATE usuario SET senha = ? WHERE empresa_id = ? AND usuario_id = ?")
        .bind(senhaHash, body.empresa, body.usuario)
        .run();

      return respostaCors("Senha atualizada com sucesso!");
    }




    // ====================== PRODUTOS ======================

    // GET /produtos?empresa=slug -> lista produtos da empresa
    if (url.pathname === '/produtos' && request.method === 'GET') {
      const empresaSlug = payload.empresa;

      const res = await env.D1_BANCO
        .prepare("SELECT produto_id, empresa_id, nome_produto, valor, cod_ba,  grupo_id, imagem_id FROM produtos WHERE empresa_id = ?")
        .bind(empresaSlug)
        .all<CadastroProdutoBody>();

      if (!res.results || res.results.length === 0) {
        // Retorna 204 No Content quando não houver produtos
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
      }

      return respostaCors(res.results);
    }

    // GET /produtos/:cod -> detalhes de um produto
    if (url.pathname.startsWith('/produto/') && request.method === 'GET') {
      const cod = url.pathname.split('/')[2];
      const empresaSlug = payload.empresa;
      if (!cod) return respostaCors("Código do produto obrigatório", 400);

      const produto = await env.D1_BANCO
        .prepare("SELECT produto_id, empresa_id, nome_produto, valor, cod_ba, grupo_id, imagem_id FROM produtos WHERE produto_id = ? AND empresa_id=?")
        .bind(cod, empresaSlug)
        .first<CadastroProdutoBody>();

      if (!produto) return respostaCors("Produto não encontrado", 404);

      return respostaCors(produto);
    }

    // POST /produtos -> cadastrar produto
    if (url.pathname === '/produtos' && request.method === 'POST') {
      const empresaSlug = payload.empresa;

      const body: CadastroProdutoBody = await request.json();

      await env.D1_BANCO
        .prepare("INSERT INTO produtos (produto_id, empresa_id, nome_produto, valor, cod_ba, grupo_id, imagem_id) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(
          body.cod,
          empresaSlug,
          body.nomeProduto,
          body.valor,
          body.codBA,
          body.grupoID,
          body.imagemId
        )
        .run();

      return respostaCors(body, 201);
    }

    // PUT /produtos/:cod -> atualizar produto
    if (url.pathname === '/produto' && request.method === 'PUT') {
      const body: Partial<CadastroProdutoBody> = await request.json();

      // Verifica se o cod veio no JSON
      if (!body.cod) return respostaCors("Código do produto obrigatório", 400);

      const updates: string[] = [];
      const valores: any[] = [];

      if (body.nomeProduto !== undefined) { updates.push("nome_produto = ?"); valores.push(body.nomeProduto); }
      if (body.valor !== undefined) { updates.push("valor = ?"); valores.push(body.valor); }
      if (body.codBA !== undefined) { updates.push("cod_ba = ?"); valores.push(body.codBA); }
      if (body.grupoID !== undefined) { updates.push("grupo_id = ?"); valores.push(body.grupoID); }
      if (body.imagemId !== undefined) { updates.push("imagem_id = ?"); valores.push(body.imagemId); }

      if (updates.length === 0) return respostaCors("Nenhum campo para atualizar", 400);

      valores.push(body.cod); // usa o cod do JSON

      await env.D1_BANCO
        .prepare(`UPDATE produtos SET ${updates.join(", ")} WHERE cod = ?`)
        .bind(...valores)
        .run();

      return respostaCors({ message: "Produto atualizado com sucesso!" });
    }



    return respostaCors("Rota não encontrada", 404);
  }
};
