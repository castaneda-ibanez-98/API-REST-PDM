import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {User} from "../model/User.js";
dotenv.config();


export const login = async (req, res) => {
 const { correo, contrasena } = req.body ?? {};
if (!correo || !contrasena)
  return res.status(400).json({ message: "correo y contrasena son requeridos" });

  const user  = await User.getByEmail(correo);
  
  
  // 1. PRIMERO verificamos si el usuario existe
  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }
 // 2. DESPUÉS podemos hacer logs o comparar la contraseña
  console.log("Validando usuario:", user.correo);

  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  const valid = await bcrypt.compare(contrasena, user.contrasena);
  if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign({ id:user.id,correo:user.correo }, process.env.JWT_SECRET, { expiresIn: "1y" });
  res.json({ token,user:
    {id:user.id,
      nombre:user.nombre,
      correo:user.correo,
      boleta:user.boleta,
      carrera:user.carrera,
    } });
};
