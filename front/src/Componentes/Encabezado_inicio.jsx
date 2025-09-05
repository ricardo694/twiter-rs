import React from "react";
import { Link } from "react-router-dom";
import '../Componentes/css/Encabezado_inicio.css'
const Encabezado_inicio = ({fotoPerfil}) => {
    return(
        <div className="contenedor_encabezado_inicio">
            <div>
                <h1>Publicaciones</h1>
                <Link to={'/Perfil'}><img src={fotoPerfil} alt="fotoPerfil"/></Link>
            </div>
        </div>
    )
}

export default Encabezado_inicio