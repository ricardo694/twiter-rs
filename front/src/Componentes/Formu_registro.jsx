import React from "react";
import '../Componentes/css/Formu_registro.css'
import logo from "../Componentes/img/logo.svg"
import { Link } from "react-router-dom";

const Formu_registro = ({nombre, correo, contrasena, fotoPerfil, onChange, onSubmit}) => {
    return(

        <div className="contenedor_formu_registro">
            <div>
                <img src={logo}/>
            </div>
            <div>
                <p>Registrate</p>
                <form onSubmit={onSubmit} >
                    <input type="text" placeholder="Nombre" name="nombre" value={nombre} onChange={onChange} required/>
                    <input type="email" placeholder="Correo" name="correo" value={correo} onChange={onChange} required/>
                    <input type="text" placeholder="Foto de perfil" name="fotoPerfil" value={fotoPerfil} onChange={onChange} required/>
                    <input type="password" placeholder="Contraseña" name="contrasena" value={contrasena} onChange={onChange} required/>
                    <button type="submit">Registrate!</button>
                    <Link to={"/Inicio_Sesion"}><p>Inicar Sesion</p></Link>
                </form>
            </div>
        </div>

    )
}

export default Formu_registro