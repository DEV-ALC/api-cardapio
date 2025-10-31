import { IRequest } from 'itty-router';
import { Env } from '../../core/database/database';
import { SoftHouseService } from './softhouse.service';
import { respostaCors } from '../../shared/utils/response.handler';
import { LoginBody } from '../../shared/types/auth';
import { AppError } from '../../shared/utils/error.handler';

export class SofthouseController {
    private softHouseService: SoftHouseService;

    constructor(env: Env) {
        this.softHouseService = new SoftHouseService(env);
    }

    public async loginSoftHouseController(request: IRequest): Promise<Response> {
        try {
            const body: LoginBody = await request.json();
            const res = await this.softHouseService.authenticateSoftHouseService(body);
            return respostaCors(res)
        } catch (error) {
            if (error instanceof AppError) {
                return respostaCors(error.message, error.status);
            }
            return respostaCors({ error: 'Erro interno do servidor' }, 500);
        }
    }
}








