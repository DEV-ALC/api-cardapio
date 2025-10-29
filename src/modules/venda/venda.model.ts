export interface VendaBody {
    empresa: string;       // ID ou slug da empresa
    venda: string;         // numero da venda
    valor: number;         // valor da venda
    data: Date;
}