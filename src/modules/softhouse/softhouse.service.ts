import { TokenPayload, CadastroEmpresaBody, Env } from '../../shared/types/types';
import { respostaCors } from '../../shared/utils/response.handler';
import { softHouseRepository } from './softhouse.repository';


export class SoftHouseService {
    private softHouseRepository: softHouseRepository;

    constructor(env: Env) {
        this.softHouseRepository = new softHouseRepository(env);
    }

    public async createEmpresa(body: CadastroEmpresaBody): Promise<Response> {
        const tokenGerado = body.token;
        const expira = new Date();
        expira.setFullYear(expira.getFullYear() + 1);

        await this.softHouseRepository.createEmpresa(body);

        return respostaCors({ empresa: body.empresa, token: tokenGerado });
    }

    // ====================== ATUALIZAR EMPRESA ======================
    public async updateEmpresa(body: CadastroEmpresaBody): Promise<Response> {
        const empresaId = body.empresa;
        if (!empresaId) return respostaCors("Parâmetro 'empresa' é obrigatório", 400);

        const existe = await this.softHouseRepository.listarEmpresaBindId(empresaId,);

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

        await this.softHouseRepository.updateEmpresa(updates, valores,)

        return respostaCors({ message: "Empresa atualizada com sucesso!" });
    }

    // ====================== LISTAR EMPRESAS ======================
    public async listarEmpresa(): Promise<Response> {

        const res = await this.softHouseRepository.listarEmpresa()

        return respostaCors(res.results);
    }
}