import { AutoRouter } from 'itty-router';
import { loginController } from '../modules/auth/auth.controller';
import { Env } from '../shared/types/types';

// Recebe env e retorna o router configurado
export function createRouter(env: Env) {
    const router = AutoRouter();

    router.get('/', () => new Response("✅ Worker rodando!", { status: 200 }));

    router.post('/login', async (request) => {
        return await loginController(request, env);
    });

    router.all('*', () =>
        new Response(JSON.stringify({ error: 'Rota não encontrada' }), { status: 404 })
    );

    return { ...router };
}
