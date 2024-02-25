const {response}=require('express');
const bcrypt = require('bcryptjs')

const Usuario=require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req,res=response)=>{
    
    const { email,password } = req.body;
    console.log(req.body.email)
    try {
        //verificar email
        console.log( Usuario );
         const usuarioBD = await Usuario.findOne({email})
         console.log( usuarioBD );
         if (!usuarioBD) {
             return res.status(404).json({
                 ok: false,
                 msg: 'email no encontrado'
             });
         }
         //verificar contrasenia
         const validPassword = bcrypt.compareSync( password, usuarioBD.password );
         if ( !validPassword ) {
             return res.status(400).json({
                 ok: false,
                 msg: 'Contrasenia no valida'    
             });
         }

        //Generar el token - jwt
         const token = await generarJWT(usuarioBD.id);
        
        res.json({
            ok:true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el Administrador'
        })
    }
}

module.exports={
    login
}