import pool from "../config/db.js";

export class Task {
  
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM task");
    return rows;
  }

  static async getAllByUser(userId){
    const [rows] = await pool.query("SELECT * FROM task WHERE userId=? AND deleted = 0",[userId])
  return rows
  }

  static async getById(id,userId) {
    const [rows] = await pool.query("SELECT * FROM task WHERE id = ? AND userId =?", [id,userId]);
    return rows[0];
  }



static async create(task, userId) {
  const { name, status, deadline } = task;
  const updatedAt = task.updatedAt ?? Date.now();
  const deleted = task.deleted ?? false;
  const [result] = await pool.query(
    "INSERT INTO task (userId,name,status,deadline,updatedAt,deleted) VALUES (?,?,?,?,?,?)",
    [userId, name, status, deadline, updatedAt, deleted]
  );
  return { id: result.insertId, userId, name, status, deadline, updatedAt, deleted };
}

static async update(id, task, userId) {
  const { name, status, deadline, updatedAt, deleted } = task;
  await pool.query(
    "UPDATE task SET name=?, status=?, deadline=?, updatedAt=?, deleted=? WHERE id=? AND userId=?",
    [name, status, deadline, updatedAt, deleted ?? false, id, userId]
  );
}

static async delete(id,userId) {
    await pool.query("DELETE FROM task WHERE id=? AND userId=?", [id,userId]);
  }



  /*METODO PARA DEVOLVER DESPUES DE ACTUALIZADO*/ 
static async getUpdatedAfter(userId, timestamp) {
  const [rows] = await pool.query(
    "SELECT * FROM task WHERE userId=? AND updatedAt > ?",
    [userId, timestamp]
  );
  return rows;
}

}