import React from "react";
import '../Componentes/css/Publicacion.css'
import like from "../Componentes/img/like.svg"
import dislike from "../Componentes/img/dislike.png"
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
                <img src={fotoPerfil } alt="perfil" />
                <h3>{nombre}</h3>
                <h5>{fecha}</h5>
            </div>

            {/*CUERPO DE LA PUBLICACION*/}
            <div>
                <h4>{titulo}</h4>
                <p>{contenido}</p>
                <img src={imagen} alt="post" />
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
                    <img src={like} alt="like" onClick={onLike} 
                    style={{ filter: userReaction === 'like' ? 'invert(39%) sepia(96%) saturate(437%) hue-rotate(88deg) brightness(93%) contrast(92%)' : 'none' }}/>
                    {likes}

                    <img src={dislike} alt="like" onClick={onDislike}
                    style={{ filter: userReaction === 'dislike' ? 'invert(39%) sepia(96%) saturate(437%) hue-rotate(358deg) brightness(93%) contrast(92%)' : 'none' }} />
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
            <div>
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