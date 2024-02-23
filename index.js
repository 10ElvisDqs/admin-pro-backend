require('dotenv').config();

const express = require('express');
const cors=require('cors');

const { dbConnection }= require('./database/config');
//crear el servidor 
const app=express();

//base de datos
dbConnection();
const PORT=process.env.PORT;
// configurar Cors
app.use(cors());

//ruta
app.get('/',(req,res)=>{
    res.json({
        ok:true,
        msg:'Hola mundo'
    });
})


app.listen(PORT ,()=>{
    console.log("Servidor corriendo en el puerto "+ PORT);
});