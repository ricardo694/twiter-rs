import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
//COMPONENTE
import Formu_inicio_sesion from "../Componentes/Formu_inicio_sesion";
//CSS
import '../Paginas/css/Inicio_Sesion.css';

const Inicio_Sesion = () => {

        /*------------------
        DATOS DEL FORMULARIO
        ------------------*/ 
    const [formData,setFormData] = useState({
        nombre:"",
        contrasena:""
    });

        /*-----------------------------------------
        NAVEGAR A OTRO APARTADO DESPUES DE REGISTRO
        ------------------------------------------*/ 
    const navigate=useNavigate();
    
        /*---------------------------
        MANEJAR CAMBIOS EN LOS INPUTS
        ---------------------------*/
    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormData ({...formData, [name]: value });
    };

        /*------------------------------
        MAENAJAR EL ENVIO DEL FORMULARIO
        ------------------------------*/
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Nombre: formData.nombre,
                Contrasena: formData.contrasena
            })
        });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                localStorage.setItem("usuario", JSON.stringify(data.usuario));
                alert("Inicio de sesión exitoso ");
                navigate("/Inicio");
            } else {
                alert(data.error || "Error en las credenciales ");
            }
    }catch (error) {
            console.error("Error en la petición:", error);
            alert("No se pudo conectar con el servidor ");
        }
    }
    return(
        <div className="contenedor_inicio_sesion">
            <Formu_inicio_sesion
            nombre={formData.nombre}
            contrasena={formData.contrasena}
            onChange={handleChange}
            onSubmit={handleSubmit}
            />
        </div>
    )
}

export default Inicio_Sesion