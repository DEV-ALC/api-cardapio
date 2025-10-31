
import { IRequest } from 'itty-router';
import { respostaCors } from '../../shared/utils/response.handler';
import { AppError } from '../../shared/utils/error.handler';
import { Env } from '../../core/database/database';
import { ICadastroEmpresaBody } from '../empresa/empresa.model'
import { EmpresaService } from './empresa.service';
import { LoginBody } from '../../shared/types/auth';


export class EmpresaController {
    private EmpresaService: EmpresaService;

    constructor(env: Env) {
        this.EmpresaService = new EmpresaService(env);
    }

    public async createEmpresaController(request: IRequest): Promise<Response> {
        try {
            const body: ICadastroEmpresaBody = await request.json();
            const res = await this.EmpresaService.createEmpresa(body);
            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }

    public async updateEmpresaController(request: IRequest): Promise<Response> {
        try {
            const body: ICadastroEmpresaBody = await request.json();
            const res = await this.EmpresaService.updateEmpresa(body);
            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }

    public async listEmpresaController(): Promise<Response> {
        try {
            const res = await this.EmpresaService.listarEmpresas();
            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }

    public async loginEmpresaController(request: IRequest): Promise<Response> {
        try {
            const body: LoginBody = await request.json();
            const res = await this.EmpresaService.authenticateEmpresaService(body);
            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors('Erro interno do servidor', 500);
        }
    }
}








