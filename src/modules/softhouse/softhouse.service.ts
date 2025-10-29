import { Env } from '../../core/database/database';
import { softHouseRepository } from './softhouse.repository';
import { respostaCors } from '../../shared/utils/response.handler';
import { LoginBody, TokenPayload } from '../../shared/types/auth';
import { validarSenha } from '../../shared/utils/crypto.utils';
import { gerarToken } from '../../shared/middlewares/ensureAuthenticated';

export class SoftHouseService {
    private softHouseRepository: softHouseRepository;

    constructor(env: Env) {
        this.softHouseRepository = new softHouseRepository(env);
    }

    public async authenticateSoftHouseService(body: LoginBody): Promise<Response> {

        const res = await this.softHouseRepository.authenticateSoftHouseRepository(body.usuario);
        if (!res) {
            return respostaCors("Usuário ou senha incorretos", 401)
        }

        const senhaValida = await validarSenha(body.senha, res.senha);
        if (!senhaValida) {
            return respostaCors("Usuário ou senha incorretos", 401)
        }

        const token = await gerarToken({
            usuario: res.usuario_nome,
            empresa: res.softhouse_id,
            tipo: 'softhouse' as TokenPayload['tipo'],
        });

        return respostaCors({ token, usuario: res.usuario_nome, empresa: res.softhouse_id });

    }
}