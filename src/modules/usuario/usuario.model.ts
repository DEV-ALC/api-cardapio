export interface CadastroUsuarioBody {
    empresa: string;
    usuario: string;
    senha: string;
};

export interface AuthEmpresaRepository {
    empresa_id: string;
    usuario_nome: string;
    senha: string;
}

export interface AuthEmpresaResponse {
    token: string;
    usuario: string;
    empresa: string;
}

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