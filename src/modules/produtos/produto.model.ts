export interface CadastroProdutoBody {
    cod: string;
    nomeProduto: string;
    empresa_id: string;
    valor: number;
    codBA: string;
    grupoID: string;
    imagemId?: string | null;
};

