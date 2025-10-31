import { IRequest } from 'itty-router';
import { Env } from '../../core/database/database';
import { ProdutoService } from './produto.service';
import { respostaCors } from '../../shared/utils/response.handler';
import { AppError } from '../../shared/utils/error.handler';

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
            const res = await this.produtoService.buscarProdutosBySlug(slug);
            return respostaCors(res);
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }
}








