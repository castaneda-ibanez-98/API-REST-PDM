create database Proyecto1;
use Proyecto1;

create table user(
id Integer primary key auto_increment,
nombre varchar(255),
correo varchar(255) unique,
boleta varchar(255),
carrera varchar(255),
contrasena varchar(255)
);

create table task(
id Integer primary key auto_increment,
userId Integer not null,
name varchar(255),
status varchar(255),
deadline varchar(255),
updatedAt bigint,
deleted boolean default false,
FOREIGN KEY (userId) REFERENCES user(id)
);

select * from user;
select * from task;


drop database proyecto1