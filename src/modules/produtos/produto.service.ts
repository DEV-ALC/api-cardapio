import { ProdutoRepository } from "./produto.repository";
import { Env } from '../../core/database/database';
import { CadastroProdutoBody } from "./produto.model";
import { EmpresaService } from "../empresa/empresa.service";

export class ProdutoService {
    private produtoRepository: ProdutoRepository;
    private empresaService: EmpresaService;

    constructor(env: Env) {
        this.produtoRepository = new ProdutoRepository(env);
        this.empresaService = new EmpresaService(env);
    }

    public async buscarProdutosBySlug(slug: string): Promise<CadastroProdutoBody[]> {
        const empresa = await this.empresaService.listarEmpresaBySlug(slug);

        const produtos = await this.produtoRepository.listarProdutosByEmpresaId(empresa);

        return produtos?.results ?? [];
    }
}
