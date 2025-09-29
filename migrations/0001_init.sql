-- Tabela softhouse
CREATE TABLE softhouse (
    softhouse_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomesofthouse TEXT NOT NULL,
    token TEXT NOT NULL,
    token_expira TEXT,
    imagem_id TEXT
);

-- Tabela empresa
CREATE TABLE empresa (
    empresa_id INTEGER PRIMARY KEY AUTOINCREMENT,
    softhouse_id INTEGER NOT NULL,
    nome_empresa TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    token TEXT NOT NULL,
    token_expira TEXT,
    imagem_id TEXT,
    FOREIGN KEY (softhouse_id) REFERENCES softhouse(softhouse_id)
);

-- Tabela usuario
CREATE TABLE usuario (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER NOT NULL,
    usuario_nome TEXT NOT NULL,
    senha TEXT NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id)
);

-- Tabela usuariosofthouse
CREATE TABLE usuariosofthouse (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    softhouse_id INTEGER NOT NULL,
    usuario_nome TEXT NOT NULL,
    senha TEXT NOT NULL,
    PRIMARY KEY (softhouse_id, usuario_id),
    FOREIGN KEY (softhouse_id) REFERENCES softhouse(softhouse_id),
);

-- Tabela produtos
CREATE TABLE produtos (
    produto_id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER NOT NULL,
    nome_produto TEXT NOT NULL,
    valor REAL NOT NULL,
    cod_ba TEXT NOT NULL,
    grupo_id TEXT NOT NULL,
    imagem_id TEXT,
    FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id)
);

-- Tabela venda
CREATE TABLE venda (
    venda_id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    data TEXT DEFAULT CURRENT_TIMESTAMP,
    ativo INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Pendente',
    FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id)
);

-- Tabela venda_item
CREATE TABLE venda_item (
    venda_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    desconto REAL NOT NULL,
    quantidade REAL NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Pendente',
    FOREIGN KEY (venda_id) REFERENCES venda(venda_id),
    FOREIGN KEY (produto_id) REFERENCES produtos(produto_id)
);

-- Tabela grupo_prod
CREATE TABLE grupo_prod (
    grupo_id TEXT NOT NULL,
    nome_grupo TEXT NOT NULL,
    empresa_id INTEGER NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (grupo_id, empresa_id),
    FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id)
);


-- Inserir softhouse
INSERT INTO softhouse (nomesofthouse, token, token_expira)
VALUES ('Softhouse Master', 'token-teste', '2099-12-31');

-- Inserir empresa vinculada à softhouse
INSERT INTO empresa (softhouse_id, nome_empresa, slug, token, token_expira)
VALUES (1, 'Empresa Teste', 'empresa-teste', 'token-empresa', '2099-12-31');

-- Inserir usuários da empresa
INSERT INTO usuario (empresa_id, usuario_nome, senha)
VALUES (1, 'usuario1', '$2b$10$rM2Q1NIXqwTlfJVq7rcYwOClpNuXkJbZ4mpXI/UhYBq0JxRBfRji6');

INSERT INTO usuario (empresa_id, usuario_nome, senha)
VALUES (1, 'usuario2', '$2b$10$rM2Q1NIXqwTlfJVq7rcYwOClpNuXkJbZ4mpXI/UhYBq0JxRBfRji6');

-- Inserir usuariosofthouse (relacionamento entre softhouse e usuários)
INSERT INTO usuariosofthouse (softhouse_id, usuario_id, senha)
VALUES (1, 1, '$2b$10$rM2Q1NIXqwTlfJVq7rcYwOClpNuXkJbZ4mpXI/UhYBq0JxRBfRji6');

INSERT INTO usuariosofthouse (softhouse_id, usuario_id, senha)
VALUES (1, 2, '$2b$10$rM2Q1NIXqwTlfJVq7rcYwOClpNuXkJbZ4mpXI/UhYBq0JxRBfRji6');

-- Inserir produto para a empresa
INSERT INTO produtos (empresa_id, nome_produto, valor, cod_ba, grupo_id)
VALUES (1, 'Produto Teste', 100.00, 'BA123', 'GT001');

-- Inserir venda
INSERT INTO venda (empresa_id, valor, status)
VALUES (1, 150.00, 'Pendente');

-- Inserir item da venda
INSERT INTO venda_item (venda_id, produto_id, valor, desconto, quantidade, status)
VALUES (1, 1, 100.00, 10.00, 1, 'Pendente');

-- Inserir grupo de produtos
INSERT INTO grupo_prod (grupo_id, nome_grupo, empresa_id)
VALUES ('GT001', 'Grupo Teste', 1);
