import React from "react";
import '../Componentes/css/Formu_crear_publicacion.css'

const Formu_crear_publicacion = ( {
    //PROPIEDADES DE PUBLICACION
    titulo, 
    imagen, 
    contenido, 
    onChange,
    onSubmit }) => {
    return(
        <div className="contenedor_formu_crear_publicacion">
            <form onSubmit={onSubmit}>
                <div>
                    <h1>Crear Publicacion</h1>
                    <button type="submit">Subir</button>
                </div>

                <div>
                    <input type="text" name="titulo" id="titulo" placeholder="Titulo" value={titulo} onChange={onChange} required/>
                    <input type="text" name="imagen" id="imagen" placeholder="Imagen" value={imagen} onChange={onChange}/>
                    <textarea name="contenido" id="contenido" placeholder="Contenido" value={contenido} onChange={onChange} required></textarea>
                </div>
            </form>
        </div>
    )
}

export default Formu_crear_publicacion