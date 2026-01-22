import {User} from "../model/User.js";

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

export const createUser = async(req,res)=>{
    const newUser=await User.create(req.body);
    res.status(201).json(newUser);
};

export const updateUser = async(req,res)=>{
    await User.update(req.params.id,req.body);
    res.json({message:"usuario actualizado"});
};

export const deleteUser=async(req,res)=>{
    await User.delete(req.params.id);
    res.json({message: "usuario eliminado"});
};