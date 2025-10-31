export interface CadastroProdutoBody {
    cod: string;
    nomeProduto: string;
    valor: number;
    codBA: string;
    grupoID: string;
    imagemId?: string | null;
};

