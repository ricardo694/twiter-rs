import React from "react";
import '../Componentes/css/Publicacion.css'
import like from "../Componentes/img/like.svg"
import dislike from "../Componentes/img/dislike.svg"
import Comentario_publicacion from "./Comentario_publicacion";
import Crear_comentario from "./Crear_comentario";


const Publicacion = ({
    //props para publicaciones
    id,
    nombre, 
    fotoPerfil, 
    titulo, 
    contenido, 
    imagen, 
    fecha,
    //props para reacciones
    likes, 
    dislikes, 
    userReaction, 
    onLike, 
    onDislike, 
    //props para comentarios
    mostrarComentarios, 
    toggleComentarios, 
    mostrarCrearComentario, 
    toggleCrearComentario,  
    comentarioContenido, 
    onComentarioChange, 
    onSubmitComentario, 
    comentarios = []}) => {

    return(
        <div className="contenedor_publicacion">
            {/*ENCABEZADO DE LA PUBLICACION*/}
            <div>
                <div>
                    <img src={fotoPerfil } alt="perfil" />
                    <h3>{nombre}</h3>
                </div>
                <p>{fecha}</p>
            </div>

            {/*CUERPO DE LA PUBLICACION*/}
            <div>
                <h4>{titulo}</h4>
                <p>{contenido}</p>
                {imagen && imagen.trim() !== "" && (
                    <img src={imagen} alt="" />
                )}
            </div>
            {/*FOOTER DE PUBLICACION*/}
            <div>
                {/*BOTON PARA VER - OCULTAR COMENTARIOS*/}
                <button onClick={() => toggleComentarios(id)}>
                    {mostrarComentarios ? "Ocultar comentarios" : "Ver comentarios"}
                </button>

                {/*BOTON PARA COMENTAR*/}
                <button onClick={() => toggleCrearComentario(id)}>
                    {mostrarCrearComentario ? "Cancelar" : "Comentar"}
                </button>

                {/*IMAGENS PARA DAR LIKE O DISLIKE*/}
                <div>
                    <img src={like} alt="like" onClick={onLike}/>
                    {likes}

                    <img src={dislike} alt="like" onClick={onDislike}/>
                    {dislikes}
                </div>

            </div>
            {/*RENDERIZAR COMPONENTE PARA CREAR COMENTARIO*/}
            {mostrarCrearComentario && (
                <Crear_comentario 
                    contenido={comentarioContenido}
                    onChange={(e) => onComentarioChange(id, e.target.value)}
                    onSubmit={(e) => onSubmitComentario(e, id)}
                />
            )}
            {/*RENDERIZAR COMPONENTE PARA VER COMENTARIOS*/}
            {mostrarComentarios && (
            <div className="caja_comentario">
                {comentarios.length > 0 ? (
                    comentarios.map((c) => (
                    <Comentario_publicacion
                        key={c.Id_comentario}
                        fotoPerfil={c.Foto_perfil}
                        nombre={c.Nombre}
                        fechaCreacion={new Date(c.Fecha_creacion).toLocaleString("es-CO")}
                        contenido={c.Contenido}
                    />
                    ))
                ) : (
                    <p>No hay comentarios aún</p>
                )}
            </div>
                )}
        </div>
    )
}

export default Publicacion