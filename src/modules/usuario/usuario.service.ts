import { AuthEmpresaResponse, AuthSoftHouseResponse } from './usuario.model';
import { Env } from '../../core/database/database';
import { UsuarioRepository } from './usuario.repository';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../shared/utils/error.handler';
import { LoginBody } from '../../shared/types/auth';
import { validarSenha } from '../../shared/utils/crypto.utils';
import { gerarToken } from '../../shared/middlewares/ensureAuthenticated';
import { TokenPayload } from '../../shared/types/auth';


export class UsuarioService {
    private usuarioRepository: UsuarioRepository;

    constructor(env: Env) {
        this.usuarioRepository = new UsuarioRepository(env);
    }

    // ====================== AUTENTICAR EMPRESA ======================
    public async authenticateEmpresaService(body: LoginBody): Promise<AuthEmpresaResponse> {

        const res = await this.usuarioRepository.authenticateEmpresaRepository(body.usuario);
        if (!res) {
            throw new UnauthorizedError("Usuário ou senha incorretos");
        }

        const senhaValida = await validarSenha(body.senha, res.senha);
        if (!senhaValida) {
            throw new UnauthorizedError("Usuário ou senha incorretos");

        }

        const token = await gerarToken({
            usuario: res.usuario_nome,
            empresa: res.empresa_id,
            tipo: 'admin' as TokenPayload['tipo'],
        });

        return { token, usuario: res.usuario_nome, empresa: res.empresa_id };
    }

    // ====================== AUTENTICAR SOFTHOUSE ======================
    public async authenticateSoftHouseService(body: LoginBody): Promise<AuthSoftHouseResponse> {

        const res = await this.usuarioRepository.authenticateSoftHouseRepository(body.usuario);
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