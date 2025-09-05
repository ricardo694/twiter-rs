import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
//css
import '../Paginas/css/Inicio_Sesion.css'
//componentes
import Formu_registro from "../Componentes/Formu_registro";

const Registro = () => {

        /*------------------
        DATOS DEL FORMULARIO
        ------------------*/ 
    const [formData, setFormData]=useState({
            nombre:"",
            correo:"",
            contrasena:"",
            fotoPerfil:""
        });

        /*-----------------------------------------
        NAVEGAR A OTRO APARTADO DESPUES DE REGISTRO
        ------------------------------------------*/ 
    const navigate =useNavigate();

        /*---------------------------
        MANEJAR CAMBIOS EN LOS INPUTS
        ---------------------------*/
    const handleChange = (e) => {
        const { name, value }=e.target;
        setFormData({...formData, [name]: value});
    }

        /*------------------------------
        MAENAJAR EL ENVIO DEL FORMULARIO
        ------------------------------*/
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:3001/registrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Nombre: formData.nombre,
                Correo: formData.correo,
                Contrasena: formData.contrasena,
                Foto_perfil: formData.fotoPerfil
                })
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert("Usuario registrado ");
                setFormData({ nombre: "", correo: "",  contrasena: "", fotoPerfil: "" });
                navigate('/Inicio_Sesion')
                
            } else {
                alert(data.error || "Error en el registro ");
            }
            } catch (error) {
            console.error("Error en la petición:", error);
            alert("No se pudo conectar con el servidor ");
            }
    }

    return(
        <div className="contenedor_inicio_sesion">
            <Formu_registro
            nombre={formData.nombre}
            correo={formData.correo}
            contrasena={formData.contrasena}
            fotoPerfil={formData.fotoPerfil}
            onChange={handleChange}
            onSubmit={handleSubmit}
            />
        </div>
    )
}

export default Registro