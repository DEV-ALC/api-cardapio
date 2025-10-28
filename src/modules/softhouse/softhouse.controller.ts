
import { IRequest } from 'itty-router';
import { respostaCors } from '../../shared/utils/response.handler';
import { Env, LoginBody, CadastroEmpresaBody } from '../../shared/types/types';
import { SoftHouseService } from './softhouse.service';

export class SofthouseController {
    private softHouseService: SoftHouseService;

    constructor(env: Env) {
        this.softHouseService = new SoftHouseService(env);
    }

    public async CreateEmpresaController(body: CadastroEmpresaBody): Promise<Response> {
        try {
            return await this.softHouseService.createEmpresa(body);
        } catch (error: any) {
            console.error("❌ [Controller] - Erro capturado:", error.message);
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }

    public async updateEmpresaController(body: CadastroEmpresaBody): Promise<Response> {
        try {
            return await this.softHouseService.updateEmpresa(body);
        } catch (error: any) {
            console.error("❌ [Controller] - Erro capturado:", error.message);
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }

    public async listEmpresaController(): Promise<Response> {
        try {
            return await this.softHouseService.listarEmpresa();
        } catch (error: any) {
            console.error("❌ [Controller] - Erro capturado:", error.message);
            return respostaCors({ error: error.message }, 500);
        }
    }
}








