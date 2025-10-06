import { createRouter } from './core/Router';
import { Env } from './shared/types/types';

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const router = createRouter(env);
        return router.fetch(request);
    }
};
