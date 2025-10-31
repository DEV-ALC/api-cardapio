import { Env } from '../../core/database/database';
import { AuthSofthouseRepository } from './softhouse.model';

export class softHouseRepository {
    constructor(private env: Env) { }

    public async authenticateSoftHouseRepository(usuarioName: string): Promise<AuthSofthouseRepository | null> {
        const res = await this.env.D1_BANCO
            .prepare("SELECT softhouse_id, usuario_nome, senha FROM usuariosofthouse WHERE usuario_nome = ?")
            .bind(usuarioName)
            .first<AuthSofthouseRepository>();
        return res;
    }
}