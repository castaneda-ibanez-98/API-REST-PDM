import dotenv from "dotenv";
import express from "express";
import taskRoutes from "./routes/tasks.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/user",userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API Tasks funcionando ✅"));

/*bloque que envia errores*/ 
app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === "ER_DUP_ENTRY")
    return res.status(409).json({ message: "Registro duplicado" });
  if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_NO_REFERENCED_ROW_2")
    return res.status(409).json({ message: "La operación viola una relación entre datos" });
  res.status(500).json({ message: "Error interno del servidor" });
});


/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
*/


/*a continuacion cambios para vercel */
// Condicionamos el puerto para que solo funcione en local (fuera de Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}

// EXPORTACIÓN OBLIGATORIA PARA VERCEL
export default app;