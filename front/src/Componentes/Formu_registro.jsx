import React from "react";
import { Typewriter } from 'react-simple-typewriter'
import '../Componentes/css/Formu_registro.css'
import logo_2 from "../Componentes/img/logo_2.png"
import { Link } from "react-router-dom";


const Formu_registro = ({nombre, correo, contrasena, fotoPerfil, onChange, onSubmit}) => {
    return(

        <div className="contenedor_formu_registro">
            <div>
                <img src={logo_2} alt="logo_2" />
            </div>
            <div>
                <p>
                                    <Typewriter
                                    words={['Formulario','Registro']}
                                    loop={Infinity}
                                    cursor
                                    cursorStyle='|'
                                    typeSpeed={30}
                                    deleteSpeed={50}
                                    delaySpeed={2000}
                                    />
                                </p>
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