import { ProdutoRepository } from "./produto.repository";
import { Env } from '../../core/database/database';
import { CadastroProdutoBody } from "./produto.model";
import { EmpresaService } from "../empresa/empresa.service";
import { BadRequestError, NotFoundError } from "../../shared/utils/error.handler";

export class ProdutoService {
    private produtoRepository: ProdutoRepository;
    private empresaService: EmpresaService;

    constructor(env: Env) {
        this.produtoRepository = new ProdutoRepository(env);
        this.empresaService = new EmpresaService(env);
    }

    // ====================== LISTAR PRODUTO  ======================
    public async buscarProdutosBySlugService(slug: string): Promise<CadastroProdutoBody[]> {
        const empresa = await this.empresaService.listarEmpresaBySlug(slug);

        const produtos = await this.produtoRepository.listarProdutosByEmpresaIdRepository(empresa);

        return produtos ?? [];
    }

    public async buscarProdutoByIdService(id: string, empresa: string): Promise<CadastroProdutoBody> {

        const produto = await this.produtoRepository.listarProdutosByIdRepository(id, empresa);
        if (!produto) {
            throw new NotFoundError("Produto não encontrado");
        }

        return produto;
    }

    // ====================== CRUD PRODUTO ======================
    public async createProdutoService(body: CadastroProdutoBody,): Promise<CadastroProdutoBody> {
        const produto = await this.produtoRepository.createProdutoRepository(body);
        if (!produto) {
            throw new NotFoundError("Produto não cadastrado");
        }
        return produto;
    }

    public async updateProdutoService(body: Partial<CadastroProdutoBody>): Promise<void> {
        if (!body.cod) {
            throw new BadRequestError("Código do produto obrigatório");
        }

        const updates: string[] = [];
        const valores: (string | number | null)[] = [];

        if (body.nomeProduto !== undefined) updates.push("nome_produto = ?"), valores.push(body.nomeProduto);
        if (body.valor !== undefined) updates.push("valor = ?"), valores.push(body.valor);
        if (body.codBA !== undefined) updates.push("cod_ba = ?"), valores.push(body.codBA);
        if (body.grupoID !== undefined) updates.push("grupo_id = ?"), valores.push(body.grupoID);
        if (body.imagemId !== undefined) updates.push("imagem_id = ?"), valores.push(body.imagemId);

        if (updates.length === 0) {
            throw new BadRequestError("Nenhum campo para atualizar");
        }

        valores.push(body.cod);

        await this.produtoRepository.updateProdutoRepository(valores, updates);
    }

    public async deleteProdutoService(idProduto: string, idEmpresa: string): Promise<void> {
        if (!idProduto || !idEmpresa) {
            throw new BadRequestError("ID do produto e ID da empresa são obrigatórios");
        }

        const updates: string[] = ["deletado_at = CURRENT_TIMESTAMP"];
        const valores: (string | number | null)[] = [];

        valores.push(idEmpresa);
        valores.push(idProduto);

        await this.produtoRepository.softDeleteProdutoRepository(valores, updates);
    }
}

