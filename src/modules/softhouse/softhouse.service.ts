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


}