import React from "react";
import { Link } from "react-router-dom";
import '../Componentes/css/Encabezado_inicio.css'
import Palabra from '../Componentes/Palabra_stilo'
const Encabezado_inicio = ({fotoPerfil}) => {
    return(
        <div className="contenedor_encabezado_inicio">
            <div>
                <Palabra/>
                <Link to={'/Perfil'}><img src={fotoPerfil} alt="fotoPerfil"/></Link>
            </div>
        </div>
    )
}

export default Encabezado_inicio