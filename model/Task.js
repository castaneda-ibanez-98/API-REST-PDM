import pool from "../config/db.js";

export class Task {
  
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM Task");
    return rows;
  }

  static async getAllByUser(userId){
    const [rows] = await pool.query("SELECT * FROM task WHERE user=? AND deleted = 0",[userId])
  return rows
  }

  static async getById(id,userId) {
    const [rows] = await pool.query("SELECT * FROM Task WHERE id = ? AND user =?", [id,userId]);
    return rows[0];
  }

  static async create(task,userId) {
    const { name, status, deadline } = task;
    const [result] = await pool.query(
      "INSERT INTO Task (user,name,status,deadline,updatedAt,deleted) VALUES (?, ?, ?, ?,?,?)",
      [userId,name, status, deadline,Date.now(),false]
    );
    return { id: result.insertId, ...task };
  }

  static async update(id, task,userId) {
    const { name, status, deadline,updateAt,deleted } = task;
    await pool.query(
      "UPDATE Task SET name=?,status=?,deadline=?,updatedAt=?,deleted=? WHERE id=? AND user=?",
      [name, status, deadline,updateAt,deleted,id,userId]
    );
  }

  static async delete(id,userId) {
    await pool.query("DELETE FROM Task WHERE id=? AND user=?", [id,userId]);
  }



  /*METODO PARA DEVOLVER DESPUES DE ACTUALIZADO*/ 
static async getUpdatedAfter(userId, timestamp) {
  const [rows] = await pool.query(
    "SELECT * FROM Task WHERE user=? AND updatedAt > ?",
    [userId, timestamp]
  );
  return rows;
}

}