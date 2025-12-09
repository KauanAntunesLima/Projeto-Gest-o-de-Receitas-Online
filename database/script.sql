CREATE DATABASE db_gestao_receita_ds2t;

USE db_gestao_receita_ds2t;

CREATE TABLE tbl_receita(
    id_receita      INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    titulo          VARCHAR(100) NOT NULL,
    descricao       TEXT NOT NULL,
    tempo_preparo   INT NOT NULL,
    dificuldade     ENUM ('facil', 'medio', 'dificil') NOT NULL,
    data_criacao    DATE NOT NULL,
    data_edicao     DATE NULL,
    imagem          VARCHAR(255) NOT NULL
);

INSERT INTO tbl_receita (titulo, descricao, tempo_preparo, dificuldade, data_criacao, data_edicao, imagem) VALUES
('Bolo de Cenoura', 'Bolo simples com cobertura de chocolate.', 40, 'facil', '2025-01-01', NULL, 'bolo.jpg'),
('Lasanha Tradicional', 'Receita italiana clássica.', 90, 'medio', '2025-01-02', NULL, 'lasanha.jpg'),
('Sushi', 'Prato japonês com arroz e peixe.', 60, 'dificil', '2025-01-03', NULL, 'sushi.jpg'),
('Torta de Limão', 'Sobremesa gelada com creme de limão.', 50, 'medio', '2025-01-04', NULL, 'torta.jpg'),
('Strogonoff de Frango', 'Clássico brasileiro de frango com creme.', 35, 'facil', '2025-01-05', NULL, 'strogonoff.jpg');

CREATE TABLE tbl_ingredientes(
    id_ingredientes INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome            VARCHAR(100) NOT NULL,
    tipo            VARCHAR(100) NOT NULL
);

INSERT INTO tbl_ingredientes (nome, tipo) VALUES
('Farinha', 'Seco'),
('Açúcar', 'Seco'),
('Leite', 'Líquido'),
('Frango', 'Carne'),
('Arroz', 'Grão');

CREATE TABLE tbl_cozinha(
    id_cozinha   INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome         VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO tbl_cozinha (nome) VALUES
('Brasileira'),
('Italiana'),
('Japonesa'),
('Mexicana'),
('Francesa');


CREATE TABLE tbl_usuario(
    id_usuario  INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    senha       VARCHAR(50) NOT NULL,
    imagem      VARCHAR(255) NOT NULL
);

INSERT INTO tbl_usuario (nome, email, senha, imagem) VALUES
('Kauan Silva', 'kauan1@email.com', '12345', 'user1.png'),
('Mariana Lima', 'mariana@email.com', 'abcde', 'user2.png'),
('João Pedro', 'joao@email.com', 'senha1', 'user3.png'),
('Lucas Rocha', 'lucas@email.com', 'senha2', 'user4.png'),
('Ana Souza', 'ana@email.com', 'pass123', 'user5.png');


CREATE TABLE tbl_categoria(
    id_categoria INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome         VARCHAR(100) NOT NULL UNIQUE,
    descricao    TEXT NULL
);

INSERT INTO tbl_categoria (nome, descricao) VALUES
('Sobremesa', 'Doces e bolos'),
('Massas', 'Lasanhas, macarrões'),
('Frutos do Mar', 'Peixes e mariscos'),
('Carnes', 'Receitas com carnes'),
('Vegano', 'Receitas sem origem animal');

CREATE TABLE tbl_modo_preparo(
    id_modo_preparo INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_receita      INT NOT NULL,
    numero_passo    INT NOT NULL,
    descricao       TEXT NOT NULL,

    CONSTRAINT FK_MODO_PREPARO_RECEITA
    FOREIGN KEY (id_receita)
    REFERENCES tbl_receita(id_receita)
);

INSERT INTO tbl_modo_preparo (id_receita, numero_passo, descricao) VALUES
(1, 1, 'Misture a massa'),
(1, 2, 'Asse no forno'),
(2, 1, 'Monte as camadas'),
(3, 1, 'Cozinhe o arroz'),
(5, 1, 'Refogue o frango');

CREATE TABLE tbl_alergenos(
    id_alergenos INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome         VARCHAR(100) NOT NULL,
    descricao    TEXT NOT NULL
);

INSERT INTO tbl_alergenos (nome, descricao) VALUES
('Glúten', 'Proteína presente no trigo'),
('Lactose', 'Açúcar presente no leite'),
('Amendoim', 'Oleaginosa comum em alergias'),
('Ovos', 'Alérgeno comum em bolos'),
('Soja', 'Ingrediente presente em diversos alimentos');

CREATE TABLE tbl_receita_ingredientes (
    id_receita_ingredientes INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_receita              INT NOT NULL,
    id_ingredientes         INT NOT NULL,
    quantidade              DECIMAL(10,2) NOT NULL,
    unidade                 VARCHAR(20) NOT NULL,

    CONSTRAINT FK_RECEITA_INGREDIENTES_RECEITA
        FOREIGN KEY (id_receita)
        REFERENCES tbl_receita(id_receita),

    CONSTRAINT FK_INGREDIENTES_RECEITA_INGREDIENTES
        FOREIGN KEY (id_ingredientes)
        REFERENCES tbl_ingredientes(id_ingredientes)
);

INSERT INTO tbl_receita_ingredientes (id_receita, id_ingredientes, quantidade, unidade) VALUES
(1, 1, 200, 'g'),
(1, 2, 100, 'g'),
(2, 4, 300, 'g'),
(5, 4, 250, 'g'),
(5, 5, 150, 'g');


CREATE TABLE tbl_usuario_notas_receita(
    id_usuario_notas_receita INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_usuario               INT NOT NULL,
    id_receita               INT NOT NULL,
    nota                     DECIMAL(2,1) NOT NULL,
    descricao                VARCHAR(200) NOT NULL,
    
    CONSTRAINT FK_USUARIO_NOTAS_RECEITA_USUARIO
        FOREIGN KEY (id_usuario)
        REFERENCES tbl_usuario(id_usuario),
    
    CONSTRAINT FK_RECEITA_NOTAS_USUARIO_RECEITA
        FOREIGN KEY (id_receita)
        REFERENCES tbl_receita(id_receita)
);

INSERT INTO tbl_usuario_notas_receita (id_usuario, id_receita, nota, descricao) VALUES
(1, 1, 4.5, 'Ficou ótimo!'),
(2, 2, 5.0, 'Delicioso!'),
(3, 3, 3.5, 'Difícil, mas bom.'),
(4, 4, 4.0, 'Bem refrescante.'),
(5, 5, 5.0, 'Perfeito!');

CREATE TABLE tbl_ingredientes_alergenos(
    id_ingredientes_alergenos INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_alergenos              INT NOT NULL,
    id_ingredientes           INT NOT NULL,
    
    CONSTRAINT FK_INGREDIENTES_ALERGENOS_INGREDIENTES
        FOREIGN KEY (id_ingredientes)
        REFERENCES tbl_ingredientes(id_ingredientes),
    
    CONSTRAINT FK_ALERGENOS_INGREDIENTES_ALERGENOS
        FOREIGN KEY (id_alergenos)
        REFERENCES tbl_alergenos(id_alergenos)
);

INSERT INTO tbl_ingredientes_alergenos (id_alergenos, id_ingredientes)
VALUES (1, 1);

INSERT INTO tbl_ingredientes_alergenos (id_alergenos, id_ingredientes)
VALUES (2, 2);

INSERT INTO tbl_ingredientes_alergenos (id_alergenos, id_ingredientes)
VALUES (3, 3);

INSERT INTO tbl_ingredientes_alergenos (id_alergenos, id_ingredientes)
VALUES (4, 4);

INSERT INTO tbl_ingredientes_alergenos (id_alergenos, id_ingredientes)
VALUES (5, 5);



CREATE TABLE tbl_receita_cozinha(
    id_receita_cozinha INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_receita         INT NOT NULL,
    id_cozinha         INT NOT NULL,
    
    CONSTRAINT FK_RECEITA_COZINHA_RECEITA
        FOREIGN KEY (id_receita)
        REFERENCES tbl_receita(id_receita),
    
    CONSTRAINT FK_COZINHA_RECEITA_COZINHA
        FOREIGN KEY (id_cozinha)
        REFERENCES tbl_cozinha(id_cozinha)
);

INSERT INTO tbl_receita_cozinha (id_receita, id_cozinha) VALUES
(1, 1),
(2, 2),
(3, 3),
(5, 1),
(4, 5);

CREATE TABLE tbl_receita_categoria(
    id_receita_categoria INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_receita INT NOT NULL,
    id_categoria INT NOT NULL,

    CONSTRAINT FK_RECEITA_CATEGORIA_RECEITA
        FOREIGN KEY (id_receita)
        REFERENCES tbl_receita(id_receita),

    CONSTRAINT FK_RECEITA_CATEGORIA_CATEGORIA
        FOREIGN KEY (id_categoria)
        REFERENCES tbl_categoria(id_categoria)
);

INSERT INTO tbl_receita_categoria (id_receita, id_categoria) VALUES
(1, 1),  
(2, 2),  
(3, 3),  
(4, 1),  
(5, 4);  

-- Criação das minhas VIEW.

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

    GROUP_CONCAT(DISTINCT i.nome SEPARATOR ', ') AS ingredientes,
    GROUP_CONCAT(DISTINCT cz.nome SEPARATOR ', ') AS cozinhas,
    GROUP_CONCAT(DISTINCT cat.nome SEPARATOR ', ') AS categorias

FROM tbl_receita r

LEFT JOIN tbl_receita_ingredientes ri 
       ON ri.id_receita = r.id_receita
LEFT JOIN tbl_ingredientes i 
       ON i.id_ingredientes = ri.id_ingredientes

LEFT JOIN tbl_receita_cozinha rc 
       ON rc.id_receita = r.id_receita
LEFT JOIN tbl_cozinha cz 
       ON cz.id_cozinha = rc.id_cozinha

LEFT JOIN tbl_receita_categoria rcat
       ON rcat.id_receita = r.id_receita
LEFT JOIN tbl_categoria cat
       ON cat.id_categoria = rcat.id_categoria
GROUP BY r.id_receita;


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
	i.nome as ingrediente,
    GROUP_CONCAT(a.nome SEPARATOR ', ') AS alergenos
FROM tbl_ingredientes i 
LEFT JOIN  tbl_ingredientes_alergenos ia ON ia.id_ingredientes = i.id_ingredientes 
LEFT JOIN  tbl_alergenos a ON a.id_alergenos = ia.id_alergenos
GROUP BY i.id_ingredientes;


CREATE VIEW vw_notas_receitas AS
SELECT
	u.nome 	 	AS usuario,
    r.titulo 	AS receita,
    n.nota,
    n.descricao AS comentario
FROM tbl_usuario_notas_receita n
JOIN tbl_usuario u ON u.id_usuario = n.id_usuario
JOIN tbl_receita r ON r.id_receita = n.id_receita;


-- Criação dos meus filtros

DELIMITER $$

CREATE PROCEDURE filtrar_por_ingrediente(IN p_ingrediente VARCHAR(100))
BEGIN 
    SELECT
        r.id_receita,
        r.titulo,
        r.descricao,
        i.nome AS ingrediente
    FROM tbl_receita r
    JOIN tbl_receita_ingredientes ri 
        ON r.id_receita = ri.id_receita
    JOIN tbl_ingredientes i 
        ON ri.id_ingredientes = i.id_ingredientes
    WHERE i.nome LIKE CONCAT('%', p_ingrediente, '%');
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE filtrar_por_categoria(IN p_categoria VARCHAR(100))
BEGIN
	SELECT
		r.titulo,
        c.nome AS categoria,
        r.dificuldade,
        r.tempo_preparo
	FROM
		tbl_receita r
	JOIN
		tbl_receita_categoria rc ON r.id_receita = rc.id_receita
	JOIN
		tbl_categoria c ON rc.id_categoria = c.id_categoria
	WHERE
		c.nome = p_categoria
	GROUP BY
		r.id_receita, r.titulo, c.nome, r.dificuldade, r.tempo_preparo;
END $$

DELIMITER;

DELIMITER $$

CREATE PROCEDURE filtrar_por_dificuldade(IN p_dificuldade ENUM('facil', 'medio', 'dificil'))
BEGIN
    SELECT
        titulo,
        dificuldade,
        tempo_preparo
    FROM
        tbl_receita
    WHERE
        dificuldade = p_dificuldade
    ORDER BY
        tempo_preparo ASC;
END $$

DELIMITER;

DELIMITER $$

CREATE PROCEDURE filtrar_por_tempo_maximo(IN p_tempo_maximo INT)
BEGIN
    SELECT 
        titulo, 
        tempo_preparo 
    FROM 
        tbl_receita
    WHERE 
        tempo_preparo <= p_tempo_maximo
    ORDER BY 
        tempo_preparo ASC;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE filtrar_por_cozinha(IN p_cozinha VARCHAR(100))
BEGIN
	SELECT
		r.titulo,
        cz.nome AS cozinha
	FROM 
		tbl_receita r
	JOIN
		tbl_receita_cozinha rc ON r.id_receita = rc.id_receita
	JOIN	
		tbl_cozinha cz ON rc.id_cozinha = cz.id_cozinha
	WHERE
		cz.nome = p_cozinha 
	GROUP BY
		r.id_receita, r.titulo, cz.nome;
END $$

DELIMITER;

DELIMITER $$

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

DELIMITER ;

-- Criação das minhas TRIGGERS    
    
DELIMITER $$

CREATE  TRIGGER trg_delete_receita_relations 
BEFORE DELETE ON tbl_receita
FOR EACH ROW
BEGIN 
	DELETE FROM tbl_modo_preparo 		  WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_receita_ingredientes  WHERE id_receita = OLD.id_receita;
    DELETE FROM tbl_usuario_notas_receita WHERE id_receita = OLD.id_receita;
	DELETE FROM tbl_receita_cozinha		  WHERE id_receita = OLD.id_receita;
END $$

CREATE TRIGGER trg_delete_ingredientes_relations
BEFORE DELETE ON tbl_ingredientes
FOR EACH ROW
BEGIN
	DELETE FROM tbl_receita_ingredientes   WHERE id_ingredientes = OLD.id_ingredientes;
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

DELIMITER ;tbl_receita_categoria

select * from tbl_receita_ingredientes;
select * from tbl_receita_cozinha;
select * from tbl_cozinha;

select * from tbl_receita;

select * from tbl_receita_categoria;



CREATE VIEW view_receita_categoria AS
SELECT c.id_categoria, rc.id_receita, c.descricao, c.nome
FROM tbl_categoria c
JOIN tbl_receita_categoria rc
ON rc.id_categoria=c.id_categoria
JOIN tbl_receita r
ON r.id_receita = rc.id_receita 
WHERE r.id_receita=1;

