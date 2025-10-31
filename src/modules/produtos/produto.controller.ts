import { IRequest } from 'itty-router';
import { Env } from '../../core/database/database';
import { ProdutoService } from './produto.service';
import { respostaCors } from '../../shared/utils/response.handler';
import { AppError } from '../../shared/utils/error.handler';
import { CadastroProdutoBody } from './produto.model';

export class ProdutoController {
    private produtoService: ProdutoService;

    constructor(env: Env) {
        this.produtoService = new ProdutoService(env);
    }

    public async produtosEmpresaController(request: IRequest): Promise<Response> {
        try {
            const url = new URL(request.url);
            const slug = url.searchParams.get('slug');

            if (!slug) {
                return respostaCors("Parâmetro 'slug' é obrigatório", 400)
            }
            const res = await this.produtoService.buscarProdutosBySlugService(slug);
            return respostaCors(res);
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }


    public async produtoByIdController(request: IRequest): Promise<Response> {
        try {
            const { idEmpresa, idProduto } = request.params;

            const res = await this.produtoService.buscarProdutoByIdService(idProduto, idEmpresa);

            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }

    }

    public async updateProdutoController(request: IRequest): Promise<Response> {
        try {
            const body: Partial<CadastroProdutoBody> = await request.json();

            await this.produtoService.updateProdutoService(body);
            return respostaCors("Atualizado com sucesso", 201)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }
    public async createProdutoController(request: IRequest): Promise<Response> {
        try {
            const body: CadastroProdutoBody = await request.json();
            const res = await this.produtoService.createProdutoService(body);
            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }

    public async deleteProdutoController(request: IRequest): Promise<Response> {
        try {
            const { idEmpresa, idProduto } = request.params;
            await this.produtoService.deleteProdutoService(idProduto, idEmpresa);
            return respostaCors("Produto Deletado", 204)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }
}








