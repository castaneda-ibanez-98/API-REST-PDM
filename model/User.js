import pool from "../config/db.js"
import bcrypt from "bcryptjs";

export class User{ 
    static async getAll(){
    const [rows] = await pool.query("SELECT * FROM user");
    return rows;
    }

    static async getById(id){
        const[rows]=await pool.query("SELECT * FROM user WHERE id = ?"[id]);
    return rows[0];
    }


    static async getByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM user WHERE correo = ?", [email]);
    return rows[0];
    }


    static async create(user){
        const {nombre, correo,boleta, carrera, contrasena} = user;
        const hashedPassword = await bcrypt.hash(contrasena,10);/*hasheo de contraseña para mas seguridad*/ 
        const[result] = await pool.query("INSERT INTO user(nombre,correo,boleta,carrera,contrasena) VALUES(?,?,?,?,?)",
            [nombre,correo,boleta,carrera,hashedPassword]);
            return {id: result.insertId,...user};
    }

    static async update(id,user){
        const {nombre,correo,boleta,carrera,contrasena} =user;
        await pool.query("UPDATE user SET nombre=?,correo=?,boleta=?,carera=?,contrasena=? WHERE id =?",
            [nombre,correo,boleta,carrera,contrasena,id]
        );
    }

    static async delete(id){
        await pool.query("DELETE FROM user WHERE id = ?",[id])
    }

    


}