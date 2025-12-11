DROP DATABASE IF EXISTS db_gestao_receita_ds2t;
CREATE DATABASE db_gestao_receita_ds2t;
USE db_gestao_receita_ds2t;

-- ==================================================================
-- 1. CRIAÇÃO DAS TABELAS
-- ==================================================================

CREATE TABLE tbl_usuario(
    id_usuario  INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    imagem      VARCHAR(255) NULL
);

CREATE TABLE tbl_receita(
    id_receita      INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_usuario      INT NOT NULL,
    titulo          VARCHAR(100) NOT NULL,
    descricao       TEXT NOT NULL,
    tempo_preparo   INT NOT NULL,
    dificuldade     ENUM ('facil', 'medio', 'dificil') NOT NULL,
    data_criacao    DATE NOT NULL,
    data_edicao     DATE NULL,
    imagem          VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario)
);

CREATE TABLE tbl_ingredientes(
    id_ingredientes INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome            VARCHAR(100) NOT NULL,
    tipo            VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_cozinha(
    id_cozinha   INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome         VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE tbl_categoria(
    id_categoria INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome         VARCHAR(100) NOT NULL UNIQUE,
    descricao    TEXT NULL
);

CREATE TABLE tbl_alergenos(
    id_alergenos INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome         VARCHAR(100) NOT NULL,
    descricao    TEXT NOT NULL
);

CREATE TABLE tbl_modo_preparo(
    id_modo_preparo INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_receita      INT NOT NULL,
    numero_passo    INT NOT NULL,
    descricao       TEXT NOT NULL,
    FOREIGN KEY (id_receita) REFERENCES tbl_receita(id_receita)
);

CREATE TABLE tbl_receita_ingredientes (
    id_receita_ingredientes INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_receita              INT NOT NULL,
    id_ingredientes         INT NOT NULL,
    quantidade              DECIMAL(10,2) NOT NULL,
    unidade                 VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_receita) REFERENCES tbl_receita(id_receita),
    FOREIGN KEY (id_ingredientes) REFERENCES tbl_ingredientes(id_ingredientes)
);

CREATE TABLE tbl_usuario_notas_receita(
    id_usuario_notas_receita INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_usuario               INT NOT NULL,
    id_receita               INT NOT NULL,
    nota                     DECIMAL(2,1) NOT NULL,
    descricao                VARCHAR(200) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id_usuario),
    FOREIGN KEY (id_receita) REFERENCES tbl_receita(id_receita)
);

CREATE TABLE tbl_ingredientes_alergenos(
    id_ingredientes_alergenos INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_alergenos              INT NOT NULL,
    id_ingredientes           INT NOT NULL,
    FOREIGN KEY (id_ingredientes) REFERENCES tbl_ingredientes(id_ingredientes),
    FOREIGN KEY (id_alergenos) REFERENCES tbl_alergenos(id_alergenos)
);

CREATE TABLE tbl_receita_cozinha(
    id_receita_cozinha INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_receita         INT NOT NULL,
    id_cozinha         INT NOT NULL,
    FOREIGN KEY (id_receita) REFERENCES tbl_receita(id_receita),
    FOREIGN KEY (id_cozinha) REFERENCES tbl_cozinha(id_cozinha)
);

CREATE TABLE tbl_receita_categoria(
    id_receita_categoria INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_receita INT NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_receita) REFERENCES tbl_receita(id_receita),
    FOREIGN KEY (id_categoria) REFERENCES tbl_categoria(id_categoria)
);

-- ==================================================================
-- 2. INSERÇÃO DE DADOS (ORDEM CORRIGIDA E CONSOLIDADA)
-- ==================================================================

-- Usuários
INSERT INTO tbl_usuario (id_usuario, nome, email, senha, imagem) VALUES
(1, 'Kauan Silva', 'kauan1@email.com', '12345', 'user1.png'),
(2, 'Mariana Lima', 'mariana@email.com', 'abcde', 'user2.png'),
(3, 'João Pedro', 'joao@email.com', 'senha1', 'user3.png'),
(4, 'Lucas Rocha', 'lucas@email.com', 'senha2', 'user4.png'),
(5, 'Ana Souza', 'ana@email.com', 'pass123', 'user5.png');

-- Ingredientes (1-5 originais, 6-20 novos)
INSERT INTO tbl_ingredientes (id_ingredientes, nome, tipo) VALUES
(1, 'Farinha', 'Seco'),
(2, 'Açúcar', 'Seco'),
(3, 'Leite', 'Líquido'),
(4, 'Frango', 'Carne'),
(5, 'Arroz', 'Grão'),
(6, 'Penne', 'Seco'),
(7, 'Presunto', 'Carne'),
(8, 'Creme de Leite', 'Líquido'),
(9, 'Goma de Tapioca', 'Seco'),
(10, 'Ovo', 'Proteína'),
(11, 'Queijo Mussarela', 'Laticínio'),
(12, 'Canela em Pó', 'Tempero'),
(13, 'Carne Moída', 'Carne'),
(14, 'Molho de Tomate', 'Líquido'),
(15, 'Polvilho Azedo', 'Seco'),
(16, 'Chocolate Meio Amargo', 'Doce'),
(17, 'Manteiga', 'Gordura'),
(18, 'Limão', 'Fruta'),
(19, 'Leite Condensado', 'Líquido'),
(20, 'Bolacha Maisena', 'Seco');

-- Cozinhas
INSERT INTO tbl_cozinha (id_cozinha, nome) VALUES
(1, 'Brasileira'),
(2, 'Italiana'),
(3, 'Japonesa'),
(4, 'Mexicana'),
(5, 'Francesa'),
(6, 'Outra');

-- Categorias
INSERT INTO tbl_categoria (id_categoria, nome, descricao) VALUES
(1, 'entradas', 'Categoria de entradas'),
(2, 'pratos_principais', 'Categoria de pratos principais'),
(3, 'acompanhamentos', 'Categoria de acompanhamentos'),
(4, 'saladas', 'Categoria de saladas'),
(5, 'sopas', 'Categoria de sopas'),
(6, 'massas', 'Categoria de massas'),
(7, 'carnes', 'Categoria de carnes'),
(8, 'frango', 'Categoria de frango'),
(9, 'peixes_e_frutos_do_mar', 'Categoria de peixes e frutos do mar'),
(10, 'lanches', 'Categoria de lanches'),
(11, 'petiscos', 'Categoria de petiscos'),
(12, 'sobremesas', 'Categoria de sobremesas'),
(13, 'bolos_e_tortas', 'Categoria de bolos e tortas'),
(14, 'bebidas', 'Categoria de bebidas'),
(15, 'vegano', 'Categoria vegana'),
(16, 'vegetariano', 'Categoria vegetariana'),
(17, 'light__fit', 'Categoria light/fit'),
(18, 'café_da_manhã', 'Categoria de café da manhã'),
(19, 'brunch', 'Categoria de brunch');

-- Alergenos
INSERT INTO tbl_alergenos (id_alergenos, nome, descricao) VALUES
(1, 'Glúten', 'Proteína presente no trigo'),
(2, 'Lactose', 'Açúcar presente no leite'),
(3, 'Amendoim', 'Oleaginosa comum em alergias'),
(4, 'Ovos', 'Alérgeno comum em bolos'),
(5, 'Soja', 'Ingrediente presente em diversos alimentos');

-- Vinculo Ingredientes -> Alergenos
INSERT INTO tbl_ingredientes_alergenos (id_alergenos, id_ingredientes) VALUES
(1, 1), -- Farinha tem Glúten
(2, 2), -- Açúcar (no exemplo original tinha lactose, mantido)
(2, 3), -- Leite tem Lactose
(4, 4), -- Frango (no exemplo original tinha Ovos, mantido)
(5, 5), -- Arroz (no exemplo original tinha Soja, mantido)
(1, 6), -- Penne tem Glúten
(2, 8), -- Creme de Leite tem Lactose
(4, 10), -- Ovo
(2, 11), -- Queijo tem Lactose
(2, 16), -- Chocolate pode ter Lactose
(5, 16), -- Chocolate pode ter Soja
(2, 17), -- Manteiga tem Lactose
(2, 19), -- Leite Condensado tem Lactose
(1, 20); -- Bolacha tem Glúten

-- Receitas (1-5 originais, 6-12 novas)
INSERT INTO tbl_receita (id_receita, id_usuario, titulo, descricao, tempo_preparo, dificuldade, data_criacao, data_edicao, imagem) VALUES
(6, 1, 'Penne ao Molho Branco com Presunto', 'Massa penne com molho cremoso e cubos de presunto.', 25, 'facil', curdate(), NULL, 'https://toquesenaistorage.blob.core.windows.net/tgsenai/Comidacompresunto.jpeg'),
(7, 1, 'Crepioca de Queijo', 'Massa leve de tapioca com ovo recheada.', 15, 'facil', curdate(), NULL, 'https://toquesenaistorage.blob.core.windows.net/tgsenai/crepioca.jpeg'),
(8, 1, 'Bolo Caseiro de Canela', 'Bolo fofinho para o café da tarde.', 45, 'facil', curdate(), NULL, 'https://toquesenaistorage.blob.core.windows.net/tgsenai/bolocaseiro.jpeg'),
(9, 1, 'Panqueca de Carne Moída', 'Panquecas recheadas cobertas com molho vermelho.', 40, 'medio', curdate(), NULL, 'https://toquesenaistorage.blob.core.windows.net/tgsenai/panquecacomcarnemoidaemolhodetomate.jpeg'),
(10, 1, 'Pão de Queijo Mineiro', 'Tradicional, crocante por fora e macio por dentro.', 35, 'medio', curdate(), NULL, 'https://toquesenaistorage.blob.core.windows.net/tgsenai/paodequeijo.jpeg'),
(11, 1, 'Brownie de Chocolate', 'Sobremesa densa e muito chocolatuda.', 50, 'medio', curdate(), NULL, 'https://toquesenaistorage.blob.core.windows.net/tgsenai/brownie.jpeg'),
(12, 1, 'Torta Mousse de Limão', 'Base crocante com creme de limão refrescante.', 30, 'facil', curdate(), NULL, 'https://toquesenaistorage.blob.core.windows.net/tgsenai/tortadelimao.jpeg');

-- Vinculo Receita -> Cozinha
INSERT INTO tbl_receita_cozinha (id_receita, id_cozinha) VALUES
(6, 2), -- Penne -> Italiana
(7, 1), -- Crepioca -> Brasileira
(8, 1), -- Bolo Canela -> Brasileira
(9, 1), -- Panqueca -> Brasileira
(10, 1), -- Pão de Queijo -> Brasileira
(11, 6), -- Brownie -> Outra
(12, 5); -- Torta Mousse -> Francesa

-- Vinculo Receita -> Categoria
INSERT INTO tbl_receita_categoria (id_receita, id_categoria) VALUES
(6, 6),  -- Penne -> Massas
(7, 10), -- Crepioca -> Lanches
(8, 13), -- Bolo Canela -> Bolos e Tortas
(9, 6),  -- Panqueca -> Massas
(10, 10), -- Pão de Queijo -> Lanches
(11, 12), -- Brownie -> Sobremesas
(12, 12); -- Torta Mousse -> Sobremesas

-- Vinculo Receita -> Ingredientes
INSERT INTO tbl_receita_ingredientes (id_receita, id_ingredientes, quantidade, unidade) VALUES
-- Receita 6 (Penne)
(6, 6, 250, 'g'), (6, 7, 100, 'g'), (6, 8, 200, 'ml'),
-- Receita 7 (Crepioca)
(7, 9, 2, 'col'), (7, 10, 1, 'uni'), (7, 11, 50, 'g'),
-- Receita 8 (Bolo Canela - reusa farinha/acucar + canela)
(8, 1, 3, 'xic'), (8, 2, 2, 'xic'), (8, 12, 1, 'col'),
-- Receita 9 (Panqueca - reusa farinha + novos)
(9, 13, 300, 'g'), (9, 1, 200, 'g'), (9, 14, 1, 'lt'),
-- Receita 10 (Pão Queijo)
(10, 15, 500, 'g'), (10, 11, 300, 'g'), (10, 10, 3, 'uni'),
-- Receita 11 (Brownie - reusa acucar + novos)
(11, 16, 200, 'g'), (11, 17, 100, 'g'), (11, 2, 1, 'xic'),
-- Receita 12 (Torta Mousse)
(12, 20, 200, 'g'), (12, 19, 1, 'lt'), (12, 18, 3, 'uni');

-- Modo de Preparo
INSERT INTO tbl_modo_preparo (id_receita, numero_passo, descricao) VALUES
-- Receitas 6-12 (Versão detalhada 5 passos)
-- Penne
(6, 1, 'Coloque 2 litros de água a ferver com uma pitada generosa de sal.'),
(6, 2, 'Adicione o penne e cozinhe pelo tempo indicado na embalagem até ficar "al dente".'),
(6, 3, 'Enquanto a massa cozinha, corte o presunto em cubos pequenos e reserve.'),
(6, 4, 'Numa panela separada, aqueça o creme de leite, tempere e adicione o presunto.'),
(6, 5, 'Escorra o macarrão e envolva-o imediatamente no molho quente antes de servir.'),
-- Crepioca
(7, 1, 'Numa tigela pequena, parta o ovo e bata ligeiramente com um garfo.'),
(7, 2, 'Adicione a goma de tapioca e uma pitada de sal, misturando até ficar homogéneo.'),
(7, 3, 'Aqueça uma frigideira antiaderente em lume brando (unte levemente se necessário).'),
(7, 4, 'Verta a mistura na frigideira e deixe firmar, como se fosse uma panqueca.'),
(7, 5, 'Quando a massa estiver firme, coloque o queijo, dobre ao meio e deixe derreter.'),
-- Bolo Caseiro
(8, 1, 'Pré-aqueça o forno a 180°C e unte uma forma com buraco no meio.'),
(8, 2, 'Bata os ovos, a manteiga e o açúcar até obter um creme fofo e esbranquiçado.'),
(8, 3, 'Adicione a farinha e o leite alternadamente, batendo em velocidade baixa.'),
(8, 4, 'Junte o fermento e a canela, misturando delicadamente com uma colher.'),
(8, 5, 'Despeje a massa na forma e leve ao forno por aproximadamente 40 minutos.'),
-- Panqueca
(9, 1, 'No liquidificador, bata o leite, os ovos e a farinha até obter uma massa líquida.'),
(9, 2, 'Aqueça uma frigideira e faça discos finos de massa, dourando dos dois lados.'),
(9, 3, 'Numa panela, refogue a carne moída com temperos até ficar bem cozinhada.'),
(9, 4, 'Recheie cada disco de massa com a carne e enrole-os cuidadosamente.'),
(9, 5, 'Cubra com o molho de tomate aquecido e sirva de imediato.'),
-- Pão de Queijo
(10, 1, 'Ferva o leite, a água e o óleo numa panela até levantar fervura.'),
(10, 2, 'Coloque o polvilho numa tigela e despeje o líquido fervente para escaldar.'),
(10, 3, 'Aguarde a massa arrefecer um pouco e adicione os ovos e o queijo.'),
(10, 4, 'Sove bem a massa com as mãos até que esta deixe de colar.'),
(10, 5, 'Modele bolinhas de tamanho médio e leve a assar até ficarem douradas.'),
-- Brownie
(11, 1, 'Derreta o chocolate juntamente com a manteiga em banho-maria ou no micro-ondas.'),
(11, 2, 'Numa outra tigela, misture bem o açúcar e os ovos.'),
(11, 3, 'Incorpore o chocolate derretido à mistura de ovos e mexa bem.'),
(11, 4, 'Adicione a farinha peneirada e misture até a massa ficar homogénea.'),
(11, 5, 'Asse em forno médio por cerca de 25 minutos (o interior deve ficar húmido).'),
-- Torta Limão
(12, 1, 'Triture a bolacha maisena até virar uma farofa e misture com manteiga derretida.'),
(12, 2, 'Forre o fundo e as laterais de uma forma com essa massa de bolacha.'),
(12, 3, 'No liquidificador, bata o leite condensado com o sumo dos limões até engrossar.'),
(12, 4, 'Despeje o creme de limão sobre a base de bolacha já preparada.'),
(12, 5, 'Leve ao frigorífico por pelo menos 2 horas e decore com raspas de limão.');

-- Notas (para receitas 1-5)
INSERT INTO tbl_usuario_notas_receita (id_usuario, id_receita, nota, descricao) VALUES
(1, 6, 4.5, 'Ficou ótimo!'),
(2, 7, 5.0, 'Delicioso!'),
(3, 8, 3.5, 'Difícil, mas bom.'),
(4, 9, 4.0, 'Bem refrescante.'),
(5, 10, 5.0, 'Perfeito!');

-- ==================================================================
-- 3. VIEWS, PROCEDURES E TRIGGERS
-- ==================================================================

CREATE VIEW vw_receitas_completas AS
SELECT
    r.id_receita,
    r.titulo,
    r.descricao,
    r.tempo_preparo,
    r.dificuldade,
    r.data_criacao,
    r.data_edicao,
    r.imagem,
    i.nome AS ingrediente,
    cz.nome AS cozinha,
    cat.nome AS categoria
FROM tbl_receita r
LEFT JOIN tbl_receita_ingredientes ri ON ri.id_receita = r.id_receita
LEFT JOIN tbl_ingredientes i ON i.id_ingredientes = ri.id_ingredientes
LEFT JOIN tbl_receita_cozinha rc ON rc.id_receita = r.id_receita
LEFT JOIN tbl_cozinha cz ON cz.id_cozinha = rc.id_cozinha
LEFT JOIN tbl_receita_categoria rcat ON rcat.id_receita = r.id_receita
LEFT JOIN tbl_categoria cat ON cat.id_categoria = rcat.id_categoria;

CREATE VIEW vw_receita_ingredientes AS
SELECT
    r.id_receita,
    r.titulo,
    i.nome AS ingrediente,
    ri.quantidade,
    ri.unidade
FROM tbl_receita r
JOIN tbl_receita_ingredientes ri ON ri.id_receita = r.id_receita
JOIN tbl_ingredientes i ON i.id_ingredientes = ri.id_ingredientes;

CREATE VIEW vw_modo_preparo AS
SELECT
    m.id_receita,
    r.titulo,
    m.numero_passo,
    m.descricao
FROM tbl_modo_preparo m
JOIN tbl_receita r ON r.id_receita = m.id_receita
ORDER BY m.id_receita, m.numero_passo;

CREATE VIEW vw_alergenos_por_ingredientes AS
SELECT 
    i.id_ingredientes,
    i.nome AS ingrediente,
    a.nome AS alergeno
FROM tbl_ingredientes i
LEFT JOIN tbl_ingredientes_alergenos ia ON ia.id_ingredientes = i.id_ingredientes
LEFT JOIN tbl_alergenos a ON a.id_alergenos = ia.id_alergenos;

CREATE VIEW vw_notas_receitas AS
SELECT
    u.nome AS usuario,
    r.titulo AS receita,
    n.nota,
    n.descricao AS comentario
FROM tbl_usuario_notas_receita n
JOIN tbl_usuario u ON u.id_usuario = n.id_usuario
JOIN tbl_receita r ON r.id_receita = n.id_receita;

DELIMITER $$

CREATE PROCEDURE filtrar_por_ingrediente(IN p_ingrediente VARCHAR(100))
BEGIN 
    SELECT
        r.id_receita,
        r.titulo,
        r.descricao,
        i.nome AS ingrediente
    FROM tbl_receita r
    JOIN tbl_receita_ingredientes ri ON r.id_receita = ri.id_receita
    JOIN tbl_ingredientes i ON ri.id_ingredientes = i.id_ingredientes
    WHERE i.nome LIKE CONCAT('%', p_ingrediente, '%');
END $$

CREATE PROCEDURE filtrar_por_categoria(IN p_categoria VARCHAR(100))
BEGIN
    SELECT
        r.titulo,
        c.nome AS categoria,
        r.dificuldade,
        r.tempo_preparo
    FROM tbl_receita r
    JOIN tbl_receita_categoria rc ON r.id_receita = rc.id_receita
    JOIN tbl_categoria c ON rc.id_categoria = c.id_categoria
    WHERE c.nome = p_categoria
    GROUP BY r.id_receita, r.titulo, c.nome, r.dificuldade, r.tempo_preparo;
END $$

CREATE PROCEDURE filtrar_por_dificuldade(IN p_dificuldade ENUM('facil', 'medio', 'dificil'))
BEGIN
    SELECT
        titulo,
        dificuldade,
        tempo_preparo
    FROM tbl_receita
    WHERE dificuldade = p_dificuldade
    ORDER BY tempo_preparo ASC;
END $$

CREATE PROCEDURE filtrar_por_tempo_maximo(IN p_tempo_maximo INT)
BEGIN
    SELECT 
        titulo, 
        tempo_preparo 
    FROM tbl_receita
    WHERE tempo_preparo <= p_tempo_maximo
    ORDER BY tempo_preparo ASC;
END $$

CREATE PROCEDURE filtrar_por_cozinha(IN p_cozinha VARCHAR(100))
BEGIN
    SELECT
        r.titulo,
        cz.nome AS cozinha
    FROM tbl_receita r
    JOIN tbl_receita_cozinha rc ON r.id_receita = rc.id_receita
    JOIN tbl_cozinha cz ON rc.id_cozinha = cz.id_cozinha
    WHERE cz.nome = p_cozinha
    GROUP BY r.id_receita, r.titulo, cz.nome;
END $$

CREATE PROCEDURE filtrar_excluir_alergeno(IN p_alergeno VARCHAR(100))
BEGIN
    SELECT r.id_receita, r.titulo, r.descricao  
    FROM tbl_receita r
    WHERE r.id_receita NOT IN (
        SELECT ri.id_receita
        FROM tbl_receita_ingredientes ri
        JOIN tbl_ingredientes_alergenos ia ON ri.id_ingredientes = ia.id_ingredientes
        JOIN tbl_alergenos a ON ia.id_alergenos = a.id_alergenos
        WHERE a.nome = p_alergeno
    );
END $$

DELIMITER $$

CREATE TRIGGER trg_delete_receita_relations 
BEFORE DELETE ON tbl_receita
FOR EACH ROW
BEGIN 
    DELETE FROM tbl_modo_preparo WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_receita_ingredientes WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_usuario_notas_receita WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_receita_cozinha WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_receita_categoria WHERE id_receita = OLD.id_receita;
END $$

CREATE TRIGGER trg_delete_ingredientes_relations
BEFORE DELETE ON tbl_ingredientes
FOR EACH ROW
BEGIN
    DELETE FROM tbl_receita_ingredientes WHERE id_ingredientes = OLD.id_ingredientes;
    DELETE FROM tbl_ingredientes_alergenos WHERE id_ingredientes = OLD.id_ingredientes;
END $$

CREATE TRIGGER trg_delete_alergenos_relations
BEFORE DELETE ON tbl_alergenos
FOR EACH ROW 
BEGIN
    DELETE FROM tbl_ingredientes_alergenos WHERE id_alergenos = OLD.id_alergenos;
END $$

CREATE TRIGGER trg_delete_usuario_relations
BEFORE DELETE ON tbl_usuario
FOR EACH ROW
BEGIN
    DELETE FROM tbl_usuario_notas_receita WHERE id_usuario = OLD.id_usuario;
END $$

CREATE TRIGGER trg_delete_categoria_relations
BEFORE DELETE ON tbl_categoria
FOR EACH ROW
BEGIN
    DELETE FROM tbl_receita_categoria WHERE id_categoria = OLD.id_categoria;
END $$

CREATE TRIGGER trg_delete_cozinha_relations
BEFORE DELETE ON tbl_cozinha
FOR EACH ROW
BEGIN
    DELETE FROM tbl_receita_cozinha WHERE id_cozinha = OLD.id_cozinha;
END $$

DELIMITER ;

select * from tbl_receita_cozinha;