import React from "react";
import { Typewriter } from 'react-simple-typewriter'
import '../Componentes/css/Formu_inicio_sesion.css'
import Imagen_logo from '../Componentes/Imagen_logo';
import { Link } from "react-router-dom";

const Formu_inicio_sesion = ({nombre, contrasena, onChange, onSubmit}) => {
    return(

        <div className="contenedor_formu_IS">
            <div>
                <p>
                    <Typewriter
                    words={['Inicio','Sesión']}
                    loop={Infinity}
                    cursor
                    cursorStyle='|'
                    typeSpeed={30}
                    deleteSpeed={50}
                    delaySpeed={2000}
                    />
                </p>

                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Nombre" name="nombre" value={nombre} onChange={onChange} required/>
                    <input type="password" placeholder="Contraseña" name="contrasena" value={contrasena} onChange={onChange} required/>

                    <button type="submit">¡Entra!</button>
                    <Link to={"/Registro"}><p>Registrarse</p></Link>
                </form>

            </div>

            <div>
                <Imagen_logo/>
            </div>
        </div>
        
    )
}

export default Formu_inicio_sesion