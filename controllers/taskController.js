import { Task } from "../model/Task.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.getAll();
  res.json(tasks);
};


export const getTasksUser = async (req, res) => {
  const userId = req.user.id
  const tasks = await Task.getAllByUser(userId);
  res.json(tasks);
};


export const getTask = async (req, res) => {
  const userId = req.user.id
  const task = await Task.getById(req.params.id,userId);
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
  res.json(task);
};

export const createTask = async (req, res) => {
  const userId = req.user.id
  const newTask = await Task.create(req.body,userId);
  res.status(201).json(newTask);
};

export const updateTask = async (req, res) => {
  const userId = req.user.id
  await Task.update(req.params.id, req.body,userId);
  res.json({ message: "Tarea actualizada" });
};

export const deleteTask = async (req, res) => {
  const userId =req.user.id
  await Task.delete(req.params.id,userId);
  res.json({ message: "Tarea eliminada" });
};



/*METODO DE SINCRONIZACION*/ 
export const syncTasks = async (req, res) => {
  const userId = req.user.id;
  const clientTasks = req.body;

  const serverUpdates = [];
  const conflicts = [];

 if (!Array.isArray(req.body))
  return res.status(400).json({ message: "Se esperaba un arreglo de tareas" });

for (const clientTask of req.body) {
  const serverTask = await Task.getById(clientTask.id, userId);

  if (!serverTask) {                                  // nueva (id temporal negativo)
    const created = await Task.create(clientTask, userId);
    serverUpdates.push({ ...created, tempId: clientTask.id });
  } else if (clientTask.updatedAt > serverTask.updatedAt) {
    await Task.update(serverTask.id, clientTask, userId);       // gana el cliente
  } else if (clientTask.updatedAt < serverTask.updatedAt) {
    conflicts.push({ client: clientTask, server: serverTask }); // gana el servidor
  }                                                   // iguales: nada que hacer
}

const lastSync = Number(req.query.lastSync ?? 0);
  const updatedOnServer = await Task.getUpdatedAfter(userId, lastSync);

  serverUpdates.push(...updatedOnServer);

  res.json({ serverUpdates, conflicts });
};
