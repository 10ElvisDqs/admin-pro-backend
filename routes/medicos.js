/*
    Medicos
    ruta: '/api/medicos'
*/

const {check}=require('express-validator');
const {Router}=require('express');
const {validarCampos}=require('../middlewares/validar-campos');
//importando controladores
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    getMedicos,
    crearMedico, 
    actualizarMedico, 
    borrarMedico,
} = require('../controllers/medicos')

const router=Router();

router.get('/',getMedicos);
router.post('/',
  [
    validarJWT,
    check('nombre','el nombre del medico es necesario').not().isEmpty(),
    check('hospital','el hospital id debe ser valido').isMongoId(),
    validarCampos,
  ],
  crearMedico
);
router.put('/:id', 
  [],
  actualizarMedico
);
router.delete('/:id', 
  borrarMedico
);

module.exports = router;