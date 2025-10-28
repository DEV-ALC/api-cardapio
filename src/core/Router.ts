import { AutoRouter } from 'itty-router';
import { loginController, loginSoftHouseController } from '../modules/auth/auth.controller';
import { Env, CadastroEmpresaBody } from '../shared/types/types';
import { requireAuth } from '../shared/middlewares/ensureAuthenticated';
import { SofthouseController } from '../modules/softhouse/softhouse.controller'

// Recebe env e retorna o router configurado
export function createRouter(env: Env) {
    const softhouseController = new SofthouseController(env)
    const router = AutoRouter();

    router.get('/', () => new Response("✅ Worker rodando!", { status: 200 }));


    router.post('/login', async (request) => {
        return await loginController(request, env);
    });
    router.post('/softhouse', async (request) => {
        return await loginSoftHouseController(request, env);
    });

    router.post('/empresa', async (request) => {
        const authError = await requireAuth(request);
        if (authError) return authError;
        const body: CadastroEmpresaBody = await request.json();
        return await softhouseController.CreateEmpresaController(body);
    });

    router.get('/empresa', async (request) => {
        return await softhouseController.listEmpresaController();
    });

    return { ...router };
}
