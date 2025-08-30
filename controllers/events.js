const { response } = require("express");
const Evento = require('../models/Evento');




const getEventos = async (req, res = response) => {

    try {
        const eventos = await Evento.find()
                                   .populate('user', 'name');
        
        return res.status(200).json({
            ok: true,
            eventos
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor en getEventos'
        });
    }
}

const crearEvento = async (req, res = response) => {
    
    try {
        const evento = new Evento(req.body);
        
        // Asignar el usuario que está autenticado (viene del JWT)
        evento.user = req.uid;
        
        const eventoGuardado = await evento.save();
        console.log(eventoGuardado)

        return res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor al crear evento'
        });
    }
}

const actualizarEvento = async(req, res = response) => {
    
    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById(eventoId)
        const uid = req.uid
        
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado con ese id'
            })
        }

        if(evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para modificar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( evento, nuevoEvento, {new: true} );

        return res.status(200).json({
        ok: true,
        msg: 'Evento Actualizado',
        evento: eventoActualizado
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }


}

const eliminarEvento = async (req, res = response) => {
    
    const eventoId = await req.params.id;
    const uid = req.uid;

    try{

        const evento = await Evento.findById(eventoId);

        if (!evento){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el evento que desea eliminar'
            })
        }

        if (evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

        const eventoEliminado = await Evento.findByIdAndDelete(eventoId);
        
        res.status(200).json({
        ok: true,
        eventoEliminado,
        msg: 'Evento eliminado'
    })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        })
    }


}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}