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

/*peticion de correo electronico*/
export const forgotCheckEmail = async (req, res) => {
  const { correo } = req.body ?? {};
  if (!correo) return res.status(400).json({ message: "Falta el correo" });
  const user = await User.getByEmail(correo);
  if (!user) return res.status(404).json({ message: "El correo no está registrado" });
  res.json({ message: "ok" });
};
/*confirmacion de la boleta*/
export const forgotCheckBoleta = async (req, res) => {
  const { correo, boleta } = req.body ?? {};
  if (!correo || !boleta) return res.status(400).json({ message: "Faltan campos" });
  const user = await User.getByEmail(correo);
  if (!user || user.boleta !== boleta)
    return res.status(401).json({ message: "La boleta no coincide" });
  res.json({ message: "ok" });
};
/*reseteando contrasena*/ 
export const forgotReset = async (req, res) => {
  const { correo, boleta, newPassword } = req.body ?? {};
  if (!correo || !boleta || !newPassword)
    return res.status(400).json({ message: "Faltan campos" });
  const user = await User.getByEmail(correo);
  if (!user || user.boleta !== boleta)
    return res.status(401).json({ message: "Correo o boleta incorrectos" });
  await User.setPassword(user.id, await bcrypt.hash(newPassword, 10));
  res.json({ message: "Contraseña restablecida" });
};