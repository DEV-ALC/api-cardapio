import { AutoRouter } from 'itty-router';
import { loginController, loginSoftHouseController } from '../modules/auth/auth.controller';
import { Env, CadastroEmpresaBody } from '../shared/types/types';
import { validarToken } from '../shared/middlewares/ensureAuthenticated';
import { CreateEmpresaController } from '../modules/softhouse/softhouse.controller'

// Recebe env e retorna o router configurado
export function createRouter(env: Env) {
    const router = AutoRouter();

    router.get('/', () => new Response("✅ Worker rodando!", { status: 200 }));

    router.post('/login', async (request) => {
        return await loginController(request, env);
    });
    router.post('/softhouse', async (request) => {
        return await loginSoftHouseController(request, env);
    });

    router.post('/cliente', async (request) => {
        const body: CadastroEmpresaBody = await request.json();
        return await CreateEmpresaController(body, env);
    });



    return { ...router };
}
