import { IRequest } from 'itty-router';
import { Env } from '../../core/database/database';
import { SoftHouseService } from './softhouse.service';


export class SofthouseController {
    private softHouseService: SoftHouseService;

    constructor(env: Env) {
        this.softHouseService = new SoftHouseService(env);
    }


}








