import bcrypt from "bcryptjs";
import { D1Database } from '@cloudflare/workers-types';

export async function gerarHash(senha: string): Promise<string> {
    const hash = await bcrypt.hash(senha, 10); // assíncrono
    return hash; // <- isso é fundamental
}

// Comparar senha recebida com hash salvo no banco
export async function validarSenha(senha: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(senha, hash); // direto, não precisa gerar outro hash
}

export interface Env {
    D1_BANCO: D1Database;
}
