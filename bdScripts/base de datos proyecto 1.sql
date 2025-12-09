

create database Proyecto1;
use Proyecto1;
drop table task;
drop table user;
create table task(
id Integer primary key auto_increment,
name varchar(255),
status varchar(255),
deadline varchar(255)
);
create table user(
id Integer primary key auto_increment,
nombre varchar(255),
correo varchar(255),
boleta varchar(255),
carrera varchar(255),
contrasena varchar(255)
)







select * from user;
select * from task;
