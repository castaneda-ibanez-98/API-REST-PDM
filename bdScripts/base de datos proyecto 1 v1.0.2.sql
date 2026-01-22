create table task(
id Integer primary key auto_increment,
user Integer not null,
name varchar(255),
status varchar(255),
deadline varchar(255),
updateAt long,
pendingSync boolean default false,
deleted boolean default false,
FOREIGN KEY (user) REFERENCES user(id)
);

create table user(
id Integer primary key auto_increment,
nombre varchar(255),
correo varchar(255),
boleta varchar(255),
carrera varchar(255),
contrasena varchar(255),
updateAt long,
pendingSync boolean default false,
deleted boolean default false
)







select * from user;
select * from task;