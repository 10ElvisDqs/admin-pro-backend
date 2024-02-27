const {response}=require('express');
const bcrypt = require('bcryptjs')

const Usuario=require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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
const googleSignIn = async (req,res=response)=>{

    
    try {
        const { email, name, picture } = await googleVerify(req.body.token);
        const usuarioDB = await Usuario.findOne({ email});
        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre:name,
                email,
                password:'@@@',
                img:picture,
                google:true

            });
        } else {
            usuario = usuarioDB;
            usuario.google=true;
        }
        //Guardar usuario
        await usuario.save();
        // generar el token - jwt 
        const token = await generarJWT(usuario.id);
        res.json({
            ok:true,
            email, name, picture,token
        })
        
    } catch (error) {
        console.log( error);
        res.status(400).json({
            ok:false,
            msg:'Token de Google no es correcto'
        })
    }
}

const renerToken = async(req,res=response)=>{
    const uid = req.uid;
    // generar el token - jwt 
    const token = await generarJWT( uid );
    res.json({
        ok:true,
        uid,
        token
    })
}

module.exports={
    login,
    googleSignIn,
    renerToken
}