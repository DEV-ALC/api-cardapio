export interface AuthSofthouseRepository {
    softhouse_id: string;
    usuario_nome: string;
    senha: string;
}

export interface AuthSoftHouseResponse {
    token: string;
    usuario: string;
    empresa: string;
}