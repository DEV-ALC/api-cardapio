-- Criar tabela softhouse
CREATE TABLE softhouse (
    softhouse TEXT PRIMARY KEY,      
    nomesofthouse TEXT NOT NULL,
    token TEXT NOT NULL,
    tokenExpira DATETIME,
    imagemId TEXT
);

-- Criar tabela empresa
CREATE TABLE empresa (
    empresa TEXT PRIMARY KEY,        
    softhouse TEXT NOT NULL,
    nomeEmpresa TEXT NOT NULL,
    slug TEXT NOT NULL,
    token TEXT NOT NULL,
    tokenExpira DATETIME,
    imagemId TEXT,
    FOREIGN KEY (softhouse) REFERENCES softhouse(softhouse)
);

-- Criar tabela usuario
CREATE TABLE usuario (
    empresa TEXT NOT NULL,           
    usuario TEXT NOT NULL,
    senha TEXT NOT NULL,
    PRIMARY KEY (empresa, usuario),
    FOREIGN KEY (empresa) REFERENCES empresa(empresa)
);

-- Criar tabela usuariosofthouse
CREATE TABLE usuariosofthouse (
    softhouse TEXT NOT NULL,
    usuario TEXT NOT NULL,
    senha TEXT NOT NULL,
    PRIMARY KEY (softhouse, usuario),
    FOREIGN KEY (softhouse) REFERENCES softhouse(softhouse)
);

-- Criar tabela produtos
CREATE TABLE produtos (
    cod TEXT NOT NULL,
    empresaDoProduto TEXT NOT NULL,
    nomeProduto TEXT NOT NULL,
    valor REAL NOT NULL,
    codBA TEXT NOT NULL,
    grupo TEXT NOT NULL,
    grupoID TEXT NOT NULL,
    imagemId TEXT,                    
    PRIMARY KEY (cod, empresaDoProduto),
    FOREIGN KEY (empresaDoProduto) REFERENCES empresa(empresa)
);

-- Inserts iniciais
INSERT INTO softhouse (softhouse, nomesofthouse, token, tokenExpira)
VALUES ('softhouse', 'Softhouse Master', 'token-teste', '2099-12-31');

INSERT INTO usuariosofthouse (softhouse, usuario, senha)
VALUES ('softhouse', 'central', '$2b$10$rM2Q1NIXqwTlfJVq7rcYwOClpNuXkJbZ4mpXI/UhYBq0JxRBfRji6');
