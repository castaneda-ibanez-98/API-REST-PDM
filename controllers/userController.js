import {User} from "../model/User.js";
import bcrypt from "bcryptjs";

export const getUsers = async(req,res)=>{
    const users = await User.getAll();
    res.json(users);
}
export const getUser = async(req,res)=>{
const user = await User.getById(req.params.id);
if(!user) return res.status(404).json({message:"usuario no encontrado"});
res.json(user);
};


export const getUserByEmail = async(req,res)=>{
    const user = await User.getByEmail(req.params.correo)
if(!user) return res.status(404).json({message:"usuario no encontrado"});
res.json(user);
}




export const createUser = async (req, res) => {
  const { nombre, correo, boleta, carrera, contrasena } = req.body ?? {};
  if (!nombre || !correo || !boleta || !carrera || !contrasena)
    return res.status(400).json({ message: "Faltan campos obligatorios" });

  try {
    const { id } = await User.create({ nombre, correo, boleta, carrera, contrasena });
    res.status(201).json({ id, nombre, correo, boleta, carrera });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "El correo ya está registrado" });
    throw err;
  }
};





export const updateUser = async(req,res)=>{
    await User.update(req.params.id,req.body);
    res.json({message:"usuario actualizado"});
};

export const deleteUser=async(req,res)=>{
    await User.delete(req.params.id);
    res.json({message: "usuario eliminado"});
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (Number(req.params.id) !== req.user.id)
    return res.status(403).json({ message: "No autorizado" });
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "Faltan campos" });

  const user = await User.getById(req.params.id);
  if (!user) return res.status(404).json({ message: "usuario no encontrado" });
  if (!(await bcrypt.compare(currentPassword, user.contrasena)))
    return res.status(401).json({ message: "Contraseña actual incorrecta" });

  await User.setPassword(user.id, await bcrypt.hash(newPassword, 10));
  res.json({ message: "Contraseña actualizada" });
};

export const forgotPassword = async (req, res) => {
  const { boleta, newPassword } = req.body ?? {};
  if (Number(req.params.id) !== req.user.id)
    return res.status(403).json({ message: "No autorizado" });
  if (!boleta || !newPassword)
    return res.status(400).json({ message: "Faltan campos" });

  const user = await User.getById(req.params.id);
  if (!user) return res.status(404).json({ message: "usuario no encontrado" });
  if (user.boleta !== boleta)
    return res.status(401).json({ message: "La boleta no coincide" });

  await User.setPassword(user.id, await bcrypt.hash(newPassword, 10));
  res.json({ message: "Contraseña restablecida" });
};