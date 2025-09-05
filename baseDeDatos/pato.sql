CREATE DATABASE pato
    DEFAULT CHARACTER SET = 'utf8mb4';
    use pato;

CREATE TABLE Comentario (
  Id_comentario     int(5) NOT NULL AUTO_INCREMENT, 
  Contenido         varchar(255), 
  Fecha_creacion    DATETIME, 
  UsuarioId_usuario int(5) NOT NULL, 
  PostId_post       int(5) NOT NULL, 
  PRIMARY KEY (Id_comentario));
CREATE TABLE Post (
  Id_post           int(5) NOT NULL AUTO_INCREMENT, 
  Titulo            varchar(50), 
  Imagen            TEXT, 
  Contenido         varchar(255), 
  Fecha_creacion    date, 
  UsuarioId_usuario int(5) NOT NULL, 
  PRIMARY KEY (Id_post));
CREATE TABLE Reaccion (
  Id_reaccion       int(5) NOT NULL AUTO_INCREMENT, 
  Tipo              varchar(15), 
  PostId_post       int(5) NOT NULL, 
  UsuarioId_usuario int(5) NOT NULL, 
  PRIMARY KEY (Id_reaccion));
CREATE TABLE Usuario (
  Id_usuario  int(5) NOT NULL AUTO_INCREMENT, 
  Nombre      varchar(30) UNIQUE, 
  Correo      varchar(50) UNIQUE, 
  Contrasena  varchar(50), 
  Foto_perfil TEXT, 
  PRIMARY KEY (Id_usuario));
ALTER TABLE Post ADD CONSTRAINT FKPost404266 FOREIGN KEY (UsuarioId_usuario) REFERENCES Usuario (Id_usuario);
ALTER TABLE Comentario ADD CONSTRAINT FKComentario120007 FOREIGN KEY (UsuarioId_usuario) REFERENCES Usuario (Id_usuario);
ALTER TABLE Comentario ADD CONSTRAINT FKComentario201695 FOREIGN KEY (PostId_post) REFERENCES Post (Id_post);
ALTER TABLE Reaccion ADD CONSTRAINT FKReaccion187679 FOREIGN KEY (PostId_post) REFERENCES Post (Id_post);
ALTER TABLE Reaccion ADD CONSTRAINT FKReaccion537790 FOREIGN KEY (UsuarioId_usuario) REFERENCES Usuario (Id_usuario);




