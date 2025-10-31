import { respostaCors } from '../../shared/utils/response.handler';
import { Env } from '../../core/database/database';
import { AuthEmpresaRepository, AuthSofthouseRepository } from './usuario.model';


export class UsuarioRepository {
    constructor(private env: Env) { }

    public async authenticateEmpresaRepository(usarioName: string): Promise<AuthEmpresaRepository | null> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT empresa_id, usuario_nome, senha FROM usuario WHERE usuario_nome = ?")
            .bind(usarioName)
            .first<AuthEmpresaRepository>();
        return res;
    }

    public async authenticateSoftHouseRepository(usuarioName: string): Promise<AuthSofthouseRepository | null> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT softhouse_id, usuario_nome, senha FROM usuariosofthouse WHERE usuario_nome = ?")
            .bind(usuarioName)
            .first<AuthSofthouseRepository>();
        return res;
    }
}