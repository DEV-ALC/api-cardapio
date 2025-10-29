import { IRequest } from 'itty-router';
import { Env } from '../../core/database/database';
import { SoftHouseService } from './softhouse.service';
import { respostaCors } from '../../shared/utils/response.handler';
import { LoginBody } from '../../shared/types/auth';

export class SofthouseController {
    private softHouseService: SoftHouseService;

    constructor(env: Env) {
        this.softHouseService = new SoftHouseService(env);
    }

    public async loginSoftHouseController(request: IRequest): Promise<Response> {
        try {
            const body: LoginBody = await request.json();
            return await this.softHouseService.authenticateSoftHouseService(body);

        } catch (error: any) {
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }
}








