export interface Env {
  D1_BANCO: D1Database;
}

export interface LoginBody {
  usuario: string;
  senha: string;
}

export interface CadastroEmpresaBody {
  empresa: string;       // ID ou slug da empresa
  nomeEmpresa: string;   // Nome completo
  softhouse?: string;    // ID da softhouse que cria a empresa (opcional, pode vir do token)
  slug: string;          // identificador curto
  token?: string;        // token gerado (opcional, pode gerar no backend)
  imagemId?: string | null; // logo ou imagem
  tokenExpira: string;
}

export interface VendaBody {
  empresa: string;       // ID ou slug da empresa
  venda: string;   // numero da venda
  valor: number;          // valor da venda
  data: Date;
}

export interface VendaBody {
  empresa: string;       // ID ou slug da empresa
  venda: string;   // numero da venda
  valor: number;          // valor da venda
  data: Date;
}

export interface CadastroUsuarioBody {
  empresa: string;
  usuario: string;
  senha: string;
};

export interface CadastroProdutoBody {
  cod: string;
  nomeProduto: string;
  valor: number;
  codBA: string;
  grupoID: string;
  imagemId?: string | null;
};

// TokenPayload só com uuid e tipo
export interface TokenPayload {
  usuario: string;
  empresa: string;
  tipo: 'admin' | 'softhouse';
}

