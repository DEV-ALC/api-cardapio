import { Env } from '../../core/database/database';
import { CadastroProdutoBody } from './produto.model';

export class ProdutoRepository {
    constructor(private env: Env) { }

    public async listarProdutosByEmpresaIdRepository(empresaId: string): Promise<CadastroProdutoBody[] | null> {
        const res = await this.env.D1_BANCO
            .prepare(`SELECT produto_id, empresa_id, nome_produto, valor, cod_ba, grupo_id, imagem_id 
              FROM produtos 
              WHERE deleted= 0 and empresa_id = ?`)
            .bind(empresaId)
            .all<CadastroProdutoBody>();
        return res.results;
    }


    public async listarProdutosByIdRepository(id: string, empresa: string): Promise<CadastroProdutoBody | null> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT produto_id, empresa_id, nome_produto, valor, cod_ba, grupo_id, imagem_id FROM produtos WHERE produto_id = ? AND empresa_id= ?")
            .bind(id, empresa)
            .first<CadastroProdutoBody>();
        return res;
    }

    public async createProdutoRepository(body: CadastroProdutoBody): Promise<CadastroProdutoBody> {

        const res = await this.env.D1_BANCO
            .prepare("INSERT INTO produtos (produto_id, empresa_id, nome_produto, valor, cod_ba, grupo_id, imagem_id) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .bind(
                body.cod,
                body.empresa_id,
                body.nomeProduto,
                body.valor,
                body.codBA,
                body.grupoID,
                body.imagemId
            )
            .run();
        return body;
    }

    public async updateProdutoRepository(valores: any, updates: any): Promise<void> {

        const res = await this.env.D1_BANCO
            .prepare(`UPDATE produtos SET ${updates.join(", ")} WHERE cod = ?`)
            .bind(...valores)
            .run();
        return;
    }


    public async softDeleteProdutoRepository(valores: (string | number | null)[], updates: string[]): Promise<void> {
        await this.env.D1_BANCO
            .prepare(`UPDATE produtos SET ${updates.join(", ")} WHERE empresa_id = ? AND id = ?`)
            .bind(...valores)
            .run();
    }
}