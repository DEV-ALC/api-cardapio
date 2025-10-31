import { Env } from '../../core/database/database';
import { CadastroProdutoBody } from './produto.model';

export class ProdutoRepository {
    constructor(private env: Env) { }

    public async listarProdutosByEmpresaId(empresaId: string): Promise<D1Result<CadastroProdutoBody> | null> {
        const res = await this.env.D1_BANCO
            .prepare(`SELECT produto_id, empresa_id, nome_produto, valor, cod_ba, grupo_id, imagem_id 
              FROM produtos 
              WHERE deleted= 0 and empresa_id = ?`)
            .bind(empresaId)
            .all<CadastroProdutoBody>();
        return res;
    }
}