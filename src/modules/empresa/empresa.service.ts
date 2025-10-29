import { ICadastroEmpresaBody } from '../empresa/empresa.model';
import { Env } from '../../core/database/database';
import { respostaCors } from '../../shared/utils/response.handler';
import { empresaRepository } from '../empresa/empresa.repository';
import { LoginBody } from '../../shared/types/auth';
import { validarSenha } from '../../shared/utils/crypto.utils';
import { gerarToken } from '../../shared/middlewares/ensureAuthenticated';
import { TokenPayload } from '../../shared/types/auth';

export class EmpresaService {
    private empresaRepository: empresaRepository;

    constructor(env: Env) {
        this.empresaRepository = new empresaRepository(env);
    }

    public async createEmpresa(body: ICadastroEmpresaBody): Promise<Response> {
        const tokenGerado = body.token;
        const expira = new Date();
        expira.setFullYear(expira.getFullYear() + 1);

        await this.empresaRepository.createEmpresa(body);

        return respostaCors({ empresa: body.empresa, token: tokenGerado });
    }

    // ====================== ATUALIZAR EMPRESA ======================
    public async updateEmpresa(body: ICadastroEmpresaBody): Promise<Response> {
        const empresaId = body.empresa;
        if (!empresaId) return respostaCors("Parâmetro 'empresa' é obrigatório", 400);

        const existe = await this.empresaRepository.listarEmpresaBindId(empresaId,);

        if (!existe) return respostaCors("Empresa não encontrada", 404);

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

        if (updates.length === 0) return respostaCors("Nenhum campo para atualizar", 400);

        valores.push(empresaId);

        await this.empresaRepository.updateEmpresa(updates, valores,)

        return respostaCors({ message: "Empresa atualizada com sucesso!" });
    }

    // ====================== LISTAR EMPRESAS ======================
    public async listarEmpresa(): Promise<Response> {

        const res = await this.empresaRepository.listarEmpresa()

        return respostaCors(res.results);
    }


    public async authenticateEmpresaService(body: LoginBody): Promise<Response> {

        const res = await this.empresaRepository.authenticateEmpresaRepository(body.usuario);
        if (!res) {
            return respostaCors("Usuário ou senha incorretos", 401);
        }

        const senhaValida = await validarSenha(body.senha, res.senha);
        if (!senhaValida) {
            return respostaCors("Usuário ou senha incorretos", 401);
        }

        const token = await gerarToken({
            usuario: res.usuario_nome,
            empresa: res.empresa_id,
            tipo: 'admin' as TokenPayload['tipo'],
        });

        return respostaCors({ token, usuario: res.usuario_nome, empresa: res.empresa_id });

    }
}