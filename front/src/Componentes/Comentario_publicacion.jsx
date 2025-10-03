import React from "react";
import '../Componentes/css/Comentario_publicacion.css'

const Comentario_publicacion = ({
    fotoPerfil, 
    nombre, 
    fechaCreacion, 
    contenido}) => {
    return(
            <div className="contenedor_comentario">
                <div>
                    <div>
                        <img src={fotoPerfil } alt="perfil" />
                        <h3>{nombre}</h3>
                    </div>
                    <p>{fechaCreacion}</p>
                </div>
    
                <div>
                    <p>{contenido}</p>
                </div>
            </div>
        )
};

export default Comentario_publicacion;