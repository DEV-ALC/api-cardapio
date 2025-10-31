import { Env } from '../../core/database/database';
import { ICadastroEmpresaBody } from './empresa.model';


export class empresaRepository {
    constructor(private env: Env) { }

    public async createEmpresa(body: ICadastroEmpresaBody): Promise<ICadastroEmpresaBody> {
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

        return body;

    }


    public async updateEmpresa(updates: string[], valores: any[]): Promise<void> {
        await this.env.D1_BANCO
            .prepare(`UPDATE empresa SET ${updates.join(", ")} WHERE empresa = ?`)
            .bind(...valores)
            .run();
    }


    public async listarEmpresaById(idempresa: string): Promise<ICadastroEmpresaBody | null> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT * FROM empresa WHERE empresa = ?")
            .bind(idempresa)
            .first<ICadastroEmpresaBody>();
        return res;
    }


    public async listarEmpresaBySlug(slug: string): Promise<{ empresa_id: string } | null> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT empresa_id FROM empresa WHERE slug = ?")
            .bind(slug)
            .first<{ empresa_id: string }>();
        return res;
    }

    // ====================== LISTAR EMPRESAS ======================
    public async listarEmpresa(): Promise<ICadastroEmpresaBody[] | null> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT empresa_id, nome_empresa, slug, imagem_id FROM empresa")
            .all<ICadastroEmpresaBody>();

        return res.results
    }
}