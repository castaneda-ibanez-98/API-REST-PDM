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
  const newTask = await Task.create(userId);
  res.status(201).json(newTask);
};

export const updateTask = async (req, res) => {
  const userId = req.user.id
  await Task.update(req.params.id, req.body,userId);
  res.json({ message: "Tarea actualizada" });
};

export const deleteTask = async (req, res) => {
  await Task.delete(req.params.id,userId);
  res.json({ message: "Tarea eliminada" });
};



/*METODO DE SINCRONIZACION*/ 
export const syncTasks = async (req, res) => {
  const userId = req.user.id;
  const clientTasks = req.body;

  const serverUpdates = [];
  const conflicts = [];

  for (const clientTask of clientTasks) {
    const serverTask = await Task.getById(clientTask.id, userId);

    if (!serverTask) {
      const created = await Task.create(clientTask, userId);
      serverUpdates.push(created);
      continue;
    }

    if (serverTask.updatedAt !== clientTask.updatedAt) {
      conflicts.push({
        client: clientTask,
        server: serverTask
      });
      continue;
    }

    if (!serverTask) {
      const created = await Task.create(clientTask, userId);
      serverUpdates.push({ 
          ...created, 
          tempId: clientTask.id
      });
      continue;
    }

    await Task.update(serverTask.id, clientTask, userId);
  }

  const lastSync = req.body.lastSync ?? 0;
  const updatedOnServer = await Task.getUpdatedAfter(userId, lastSync);

  serverUpdates.push(...updatedOnServer);

  res.json({ serverUpdates, conflicts });
};
