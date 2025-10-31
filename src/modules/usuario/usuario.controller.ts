
import { IRequest } from 'itty-router';
import { respostaCors } from '../../shared/utils/response.handler';
import { AppError } from '../../shared/utils/error.handler';
import { Env } from '../../core/database/database';
import { UsuarioService } from './usuario.service';
import { LoginBody } from '../../shared/types/auth';

export class UsuarioController {
    private usuarioService: UsuarioService;

    constructor(env: Env) {
        this.usuarioService = new UsuarioService(env);
    }

    public async loginEmpresaController(request: IRequest): Promise<Response> {
        try {
            const body: LoginBody = await request.json();
            const res = await this.usuarioService.authenticateEmpresaService(body);
            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }

    public async loginSoftHouseController(request: IRequest): Promise<Response> {
        try {
            const body: LoginBody = await request.json();
            const res = await this.usuarioService.authenticateSoftHouseService(body);
            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }
}








