import { Env } from '../../core/database/database';
import { softHouseRepository } from './softhouse.repository';
import { LoginBody, TokenPayload } from '../../shared/types/auth';
import { validarSenha } from '../../shared/utils/crypto.utils';
import { gerarToken } from '../../shared/middlewares/ensureAuthenticated';
import { UnauthorizedError } from '../../shared/utils/error.handler';
import { AuthSoftHouseResponse } from './softhouse.model';

export class SoftHouseService {
    private softHouseRepository: softHouseRepository;

    constructor(env: Env) {
        this.softHouseRepository = new softHouseRepository(env);
    }

    public async authenticateSoftHouseService(body: LoginBody): Promise<AuthSoftHouseResponse> {

        const res = await this.softHouseRepository.authenticateSoftHouseRepository(body.usuario);
        if (!res) {
            throw new UnauthorizedError("Usuário ou senha incorretos");
        }

        const senhaValida = await validarSenha(body.senha, res.senha);
        if (!senhaValida) {
            throw new UnauthorizedError("Usuário ou senha incorretos");
        }

        const token = await gerarToken({
            usuario: res.usuario_nome,
            empresa: res.softhouse_id,
            tipo: 'softhouse' as TokenPayload['tipo'],
        });

        return { token, usuario: res.usuario_nome, empresa: res.softhouse_id };
    }
}