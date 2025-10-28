import { respostaCors } from '../../shared/utils/response.handler';
import { Env, CadastroEmpresaBody } from '../../shared/types/types';


export class softHouseRepository {
    constructor(private env: Env) { }

    public async createEmpresa(body: CadastroEmpresaBody): Promise<Response> {
        const expira = new Date();
        expira.setFullYear(expira.getFullYear() + 1);

        await this.env.D1_BANCO
            .prepare(`
          INSERT INTO empresa (empresa_id, softhouse_id, nome_empresa, slug, token, token_expira, imagem_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
            .bind(
                body.empresa,
                body.softhouse,
                body.nomeEmpresa,
                body.slug,
                body.token,
                expira.toISOString(),
                body.imagemId || null
            )
            .run();

        return respostaCors({ empresa: body.empresa });

    }


    public async updateEmpresa(updates: string[], valores: any[]): Promise<void> {
        await this.env.D1_BANCO
            .prepare(`UPDATE empresa SET ${updates.join(", ")} WHERE empresa = ?`)
            .bind(...valores)
            .run();
    }


    public async listarEmpresaBindId(idempresa: string,): Promise<Record<string, unknown> | null> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT empresa FROM empresa WHERE empresa = ?")
            .bind(idempresa)
            .first();
        return res;
    }

    // ====================== LISTAR EMPRESAS ======================
    public async listarEmpresa(): Promise<D1Result> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT empresa_id, nome_empresa, slug, imagem_id FROM empresa")
            .all<{ empresa: string; nomeEmpresa: string; slug: string; imagemId: string }>();

        return res
    }
}