import { AutoRouter } from 'itty-router';
import { Env } from './database/database';
import { requireAuth } from '../shared/middlewares/ensureAuthenticated';
import { EmpresaController } from '../modules/empresa/empresa.controller'
import { SofthouseController } from '../modules/softhouse/softhouse.controller';

export function createRouter(env: Env) {
    const empresaController = new EmpresaController(env)
    const softhouseController = new SofthouseController(env)
    const router = AutoRouter();

    router.get('/', () => new Response("✅ Worker rodando!", { status: 200 }));

    router.post('/login-empresa', async (request) => {
        return await empresaController.loginEmpresaController(request);
    });
    router.post('/login-softhouse', async (request) => {
        return await softhouseController.loginSoftHouseController(request);
    });

    router.get('/empresa', async (request) => {
        return await empresaController.listEmpresaController();
    });

    router.post('/empresa', async (request) => {
        const authError = await requireAuth(request);
        if (authError) return authError;
        return await empresaController.CreateEmpresaController(request);
    });

    router.put('/empresa', async (request) => {
        const authError = await requireAuth(request);
        if (authError) return authError;
        return await empresaController.updateEmpresaController(request);
    });

    return { ...router };
}
