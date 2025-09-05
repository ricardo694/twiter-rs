import React from 'react'
import './css/Publicacion.css'
const Crear_comentario = ({
    //PROPS DE COMENTARIO
    contenido, 
    onChange, 
    onSubmit}) => {
    return (
        <div className='form-comentario'>
            <form  onSubmit={onSubmit} >
                <input type="text" placeholder="Escribe un comentario..." name="contenido" value={contenido} onChange={onChange} required/>
                <button type="submit">Subir!!</button>
            </form>
        </div>

    )
}

export default Crear_comentario