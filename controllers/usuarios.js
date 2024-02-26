const {response}=require('express');
const bcryptj = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios= async(req,res)=>{

    const desde = Number(req.query.desde) || 0; 
    // const usuarios = await Usuario
    //                             .find({},'nombre email role google')
    //                             .skip(desde)
    //                             .limit(5);
    // //const total = await Usuario.count();    
    // const total = await Usuario.countDocuments();

    

     const [ usuarios, total]= await Promise.all([
         Usuario 
             .find({},'nombre email role google img')
             .skip(desde)
             .limit(5),
        
         Usuario.countDocuments()
     ]);

    res.json({
        ok:true,
        usuarios,
        total
    });
}

const crearUsuario= async(req,res=response)=>{
    const {email,password}=req.body;

    try {

        const existeEmail=await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok:false,
                msg:'El Correo ya esta registrado',
            })
        }
        const usuario=new Usuario(req.body);
        //encriptar password
        const salt = bcryptj.genSaltSync();
        usuario.password=bcryptj.hashSync(password,salt);
        //guardar usuario   
        await usuario.save();
        //generar token - jwt
        const token = await generarJWT(usuario.id);
        res.json({
            ok:true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado..... revisar logs'
        })
    }

}

const actualizarUsuario=async ( req,res=response)=>{
    // TODO: Validar token y comprovar si es el usuario correcto
    const uid= req.params.id;
    try {
        
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario con ese Id ',
            })
        }
        //Actualizaciones
        const {password,google,email, ...campos} = req.body;
        if (usuarioDB.email !== email){
            const existeEmail=await Usuario.findOne({email});
            if (existeEmail) {
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un usuario con ese email'
                })
            }
        }

        campos.email=email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{new:true});

        res.json({
            ok:true,
            usuario:usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }
}

const borrarUsuario=async (req,res=response)=>{
    const uid= req.params.id;
    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario con ese Id ',
            })
        }
        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok:true,
            msg:'Usuario Eliminado'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
}

module.exports={
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}