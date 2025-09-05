import React from 'react';

import '../Componentes/css/Publicacion.css';

const Comentario_publicacion = ({
    fotoPerfil, 
    nombre, 
    fechaCreacion, 
    contenido}) => {
    return(
            <div className="contenedor_publicacion">


                <div>
                    <img src={fotoPerfil } alt="perfil" />
                    <h3>{nombre}</h3>
                    <h5>{fechaCreacion}</h5>
                </div>
    
                <div>
                    <p>{contenido}</p>
                </div>
            </div>
        )
};

export default Comentario_publicacion;
