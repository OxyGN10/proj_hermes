-- SGBD: PostgreSQL

create table COMPONENTES (
    LATTES_ID BIGINT,
    NOME VARCHAR(128) not null,

    constraint COMPONENTES_pk primary key(LATTES_ID)
);

insert into COMPONENTES VALUES(-255, 'SISTEMA');

create table PROJETOS (
    COD_PROJ INTEGER GENERATED always as identity,
    TITULO VARCHAR(256) not null,
    TIPO VARCHAR(64) not null,
    INICIO date default current_date,
    FIM date,

    constraint PROJETOS_pk primary key(COD_PROJ)
);

create table COMP_PROJ (
    COD_COMP INTEGER generated always as identity,
    PROJETO INTEGER not null,
    COMPONENTE BIGINT not null,
    FUNCAO VARCHAR(64) not null,
    ESTADO VARCHAR(64) not null default 'ativo' check (ESTADO in ('ativo', 'desligado', 'suspenso')),
    ENTRADA DATE not NULL default current_date,
    SAIDA DATE,

    constraint COMP_PROJ_pk primary key(COD_COMP),
    constraint COMP_PROJ_fk foreign key(PROJETO) references PROJETOS(COD_PROJ) on delete cascade,
    constraint COMP_PROJ_fk2 foreign key(COMPONENTE) references COMPONENTES(LATTES_ID) on delete cascade
);

create table AVISOS (
    COD_AVISO INTEGER GENERATED always as identity,
    PROJETO INTEGER not null,
    REMETENTE bigint,
    AVISO TEXT,
    PUBLICACAO timestamptz not null default current_timestamp,

    constraint AVISOS_pk primary key(COD_AVISO),
    constraint AVISOS_fk1 foreign key(PROJETO) references PROJETOS(COD_PROJ) on delete cascade,
    constraint AVISOS_fk2 foreign key(REMETENTE) references COMPONENTES(LATTES_ID) on delete set null
);

create view proj_lista as
select c.lattes_id,
c.nome as nome_componente,
p.cod_proj,
p.titulo as titulo_projeto,
p.tipo as tipo_projeto,
p.inicio as inicio_projeto,
p.fim as fim_projeto,
cp.funcao,
cp.estado,
cp.entrada,
cp.saida
from COMP_PROJ cp
inner join componentes c on cp.componente = c.lattes_id
inner join projetos p on cp.projeto = p.cod_proj
where cp.funcao = 'lider';

create view comp_data as 
select * from componentes c inner join comp_proj cp on cp.componente = c.lattes_id