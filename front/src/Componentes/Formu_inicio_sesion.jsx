import React from "react";
import '../Componentes/css/Formu_inicio_sesion.css'
import logo from "../Componentes/img/logo.svg"
import { Link } from "react-router-dom";

const Formu_inicio_sesion = ({nombre, contrasena, onChange, onSubmit}) => {
    return(

        <div className="contenedor_formu_IS">
            <div>
                <p>Inicio de Sesion</p>

                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Nombre" name="nombre" value={nombre} onChange={onChange} required/>
                    <input type="password" placeholder="Contraseña" name="contrasena" value={contrasena} onChange={onChange} required/>

                    <button type="submit">¡Entra!</button>
                    <Link to={"/Registro"}><p>Registrarse</p></Link>
                </form>

            </div>

            <div>
                <img src={logo}/>
            </div>
        </div>
        
    )
}

export default Formu_inicio_sesion