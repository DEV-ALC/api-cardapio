export interface ICadastroEmpresaBody {
    empresa: string;          // ID ou slug da empresa
    nomeEmpresa: string;      // Nome completo
    softhouse: string;        // ID da softhouse que cria a empresa (opcional, pode vir do token)
    slug: string;             // identificador curto
    token?: string;           // token gerado (opcional, pode gerar no backend)
    imagemId?: string | null; // logo ou imagem
    tokenExpira: string;
}

export interface CadastroUsuarioBody {
    empresa: string;
    usuario: string;
    senha: string;
};

export interface AuthEmpresaRepository {
    empresa_id: string; usuario_nome: string; senha: string
}

export interface AuthEmpresaResponse {
    token: string;
    usuario: string;
    empresa: string;
}
