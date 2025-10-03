import React from "react";
import '../Componentes/css/Encabezado_perfil.css'
import flecha from '../Componentes/img/flecha.png'
// import perfil from "../Componentes/img/perfil.png"
import { Link } from "react-router-dom";

const Encabezado_perfil = ({
    //PROPS DE ENCABEZADO DE PUBLICACION
    fotoPerfil, 
    nombre, 
    correo,
    handleCerrarSesion}) => {
    return(
        <div className="contenedor_encabezado_perfil"> 
            <div>
                <Link to={'/Inicio'}><img src={flecha} alt="" /></Link>
            </div>

            <div>
                <div>
                    <img src={fotoPerfil} alt="fotoPerfil" />
                    <div>
                        <h3>{nombre}</h3>
                        <p>{correo}</p>
                    </div>
                </div>

                <button onClick={handleCerrarSesion}>Salir</button>
            </div>
        </div>
    )
}

export default Encabezado_perfil