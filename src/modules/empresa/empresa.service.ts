import { ICadastroEmpresaBody } from '../empresa/empresa.model';
import { Env } from '../../core/database/database';
import { empresaRepository } from '../empresa/empresa.repository';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../shared/utils/error.handler';
import { LoginBody } from '../../shared/types/auth';
import { validarSenha } from '../../shared/utils/crypto.utils';
import { gerarToken } from '../../shared/middlewares/ensureAuthenticated';
import { TokenPayload } from '../../shared/types/auth';


export class EmpresaService {
    private empresaRepository: empresaRepository;

    constructor(env: Env) {
        this.empresaRepository = new empresaRepository(env);
    }


    // ====================== LISTAR EMPRESAS ======================
    public async listarEmpresas(): Promise<ICadastroEmpresaBody[]> {

        const res = await this.empresaRepository.listarEmpresa()

        return res ?? [];
    }

    public async listarEmpresaById(id: string): Promise<ICadastroEmpresaBody> {

        const res = await this.empresaRepository.listarEmpresaById(id)

        if (!res) {
            throw new NotFoundError("Empresa não encontrada");
        }

        return res;
    }

    public async listarEmpresaBySlug(slug: string): Promise<string> {
        const res = await this.empresaRepository.listarEmpresaBySlug(slug)

        if (!res || !res.empresa_id) {
            throw new NotFoundError("Empresa não encontrada");
        }

        return res.empresa_id;
    }

    // ====================== CRUD EMPRESA ======================
    public async createEmpresa(body: ICadastroEmpresaBody): Promise<ICadastroEmpresaBody> {
        const tokenGerado = body.token;
        const expira = new Date();
        expira.setFullYear(expira.getFullYear() + 1);
        const res = await this.empresaRepository.createEmpresa(body);
        return res;
    }

    public async updateEmpresa(body: ICadastroEmpresaBody): Promise<void> {
        const empresaId = body.empresa;
        if (!empresaId) {
            throw new BadRequestError("Parâmetro 'empresa' é obrigatório");
        }

        const existe = await this.empresaRepository.listarEmpresaById(empresaId,);
        if (!existe) {
            throw new NotFoundError("Empresa não encontrada");
        };

        // Atualiza apenas os campos permitidos
        const updates: string[] = [];
        const valores: any[] = [];

        if (body.nomeEmpresa !== undefined) {
            updates.push("nomeEmpresa = ?");
            valores.push(body.nomeEmpresa);
        }
        if (body.token !== undefined) {
            updates.push("token = ?");
            valores.push(body.token);
        }
        if (body.tokenExpira !== undefined) {
            updates.push("tokenExpira = ?");
            valores.push(body.tokenExpira);
        }
        if (body.imagemId !== undefined) {
            updates.push("imagemId = ?");
            valores.push(body.imagemId);
        }

        if (updates.length === 0) {
            throw new BadRequestError("Nenhum campo para atualizar");

        };

        valores.push(empresaId);

        await this.empresaRepository.updateEmpresa(updates, valores,)

        return;
    }
}