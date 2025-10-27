import { IRequest } from 'itty-router';
import { respostaCors } from '../../shared/utils/response.handler';
import { Env, LoginBody } from '../../shared/types/types';
// Importa as funções do nosso novo service
import { authenticateEmpresaService, authenticateSoftHouseService } from './auth.service';

export async function loginController(request: IRequest, env: Env): Promise<Response> {
    try {

        const body: LoginBody = await request.json();
        return await authenticateEmpresaService(body, env);
    } catch (error: any) {
        console.error("❌ [Controller] - Erro capturado:", error.message);
        if (error.message === 'Credenciais inválidas') {
            return respostaCors({ error: 'Usuário ou senha incorretos' }, 401);
        }
        return respostaCors({ error: 'Erro interno do servidor' }, 500);
    }
}

export async function loginSoftHouseController(request: IRequest, env: Env): Promise<Response> {
    try {
        const body: LoginBody = await request.json();
        return await authenticateSoftHouseService(body, env);

    } catch (error: any) {
        if (error.message === 'Credenciais inválidas') {
            return respostaCors({ error: 'Usuário ou senha incorretos' }, 401);
        }
        return respostaCors({ error: 'Erro interno do servidor' }, 500);
    }
}