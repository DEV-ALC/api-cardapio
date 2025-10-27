
import { IRequest } from 'itty-router';
import { respostaCors } from '../../shared/utils/response.handler';
import { Env, LoginBody, CadastroEmpresaBody } from '../../shared/types/types';
import { cadastrarEmpresaService } from './softhouse.service';


export async function CreateEmpresaController(body: CadastroEmpresaBody, env: Env): Promise<Response> {
    try {
        return await cadastrarEmpresaService(body, env);
    } catch (error: any) {
        console.error("❌ [Controller] - Erro capturado:", error.message);
        return respostaCors({ error: 'Erro interno do servidor' }, 500);
    }
}






