-- Tabela venda com soft delete
CREATE TABLE venda (
    venda TEXT NOT NULL,
    empresa TEXT NOT NULL,
    valor REAL NOT NULL,           
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo INTEGER NOT NULL DEFAULT 1, -- 1 = ativo, 0 = deletado
    PRIMARY KEY (venda, empresa),
    FOREIGN KEY (empresa) REFERENCES empresa(empresa)
);

-- Tabela venda_item com soft delete
CREATE TABLE venda_item (
    venda TEXT NOT NULL,
    empresa TEXT NOT NULL,
    codProduto TEXT NOT NULL,
    nomeProduto TEXT NOT NULL,
    valor REAL NOT NULL,
    codBA TEXT NOT NULL,
    grupo TEXT NOT NULL,
    grupoID TEXT NOT NULL,
    imagemId TEXT,                    
    quantidade INTEGER NOT NULL DEFAULT 1,
    ativo INTEGER NOT NULL DEFAULT 1, -- 1 = ativo, 0 = deletado
    PRIMARY KEY (venda, empresa, codProduto),
    FOREIGN KEY (empresa) REFERENCES empresa(empresa),
    FOREIGN KEY (codProduto, empresa) REFERENCES produtos(cod, empresaDoProduto)
);
