
import { IRequest } from 'itty-router';
import { respostaCors } from '../../shared/utils/response.handler';
import { Env } from '../../core/database/database';
import { ICadastroEmpresaBody } from '../empresa/empresa.model'
import { EmpresaService } from './empresa.service';
import { LoginBody } from '../../shared/types/auth';

export class EmpresaController {
    private EmpresaService: EmpresaService;

    constructor(env: Env) {
        this.EmpresaService = new EmpresaService(env);
    }

    public async CreateEmpresaController(request: IRequest): Promise<Response> {
        try {
            const body: ICadastroEmpresaBody = await request.json();
            return await this.EmpresaService.createEmpresa(body);
        } catch (error: any) {
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }

    public async updateEmpresaController(request: IRequest): Promise<Response> {
        try {
            const body: ICadastroEmpresaBody = await request.json();
            return await this.EmpresaService.updateEmpresa(body);
        } catch (error: any) {
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }

    public async listEmpresaController(): Promise<Response> {
        try {
            return await this.EmpresaService.listarEmpresa();
        } catch (error: any) {
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }

    public async loginEmpresaController(request: IRequest): Promise<Response> {
        try {
            const body: LoginBody = await request.json();
            return await this.EmpresaService.authenticateEmpresaService(body,);
        } catch (error: any) {
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }
}








