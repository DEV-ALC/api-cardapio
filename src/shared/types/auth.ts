export interface TokenPayload {
    usuario: string;
    empresa: string;
    tipo: 'admin' | 'softhouse';
}

export interface LoginBody {
    usuario: string;
    senha: string;
}