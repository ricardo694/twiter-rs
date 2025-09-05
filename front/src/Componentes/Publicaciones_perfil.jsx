import React from "react";
//CSS
import '../Componentes/css/Publicaciones_perfil.css';
//COMPONENTES
import Crear_comentario from "./Crear_comentario";
import Comentario_publicacion from "./Comentario_publicacion";
//IMAGENES
import like from "../Componentes/img/like.svg";
import dislike from "../Componentes/img/dislike.png";


const Publicaciones_perfil = ({
    //PROPS DE PUBLICACIONES
    id, 
    nombre, 
    fotoPerfil, 
    titulo, 
    contenido, 
    imagen, 
    fecha, 
    onEliminar, 
    //PROPS PARA REACCIONES
    likes, 
    dislikes, 
    userReaction, 
    onLike, 
    onDislike,
    //PROPS PARA COMENTARIOS
    mostrarComentarios, 
    toggleComentarios, 
    mostrarCrearComentario, 
    toggleCrearComentario,  
    comentarioContenido,
    onComentarioChange, 
    onSubmitComentario, 
    comentarios, 
    //PROPS PARA EDITAR PUBLICACION
    isEditing, 
    editForm, 
    onEditar,
    onChangeTitulo, 
    onChangeContenido, 
    onChangeImagen, 
    onSave, 
    onCancel = []}) => {
    return(
        <div className="contenedor_publicacion_perfil">
            {/*ENCABEAZADO DE PUBLICACION*/}
            <div>
                <img src={fotoPerfil} alt="" />
                <h3>{nombre}</h3>
                <h5>{fecha}</h5>
            </div>

            {/*INPUTS SI SELECCIONA EDITAR*/}
            <div>
                {isEditing ? (
                <>
                <input
                    type="text"
                    value={editForm.titulo}
                    onChange={(e) => onChangeTitulo(id, e.target.value)}
                />
                <textarea
                    value={editForm.contenido}
                    onChange={(e) => onChangeContenido(id, e.target.value)}
                />

                <input
                    type="text"
                    value={editForm.imagen}
                    onChange={(e) => onChangeImagen(id, e.target.value)}
                    placeholder="URL de la imagen"
                />

                <div>
                    <button onClick={() => onSave(id)}>Guardar</button>
                    <button onClick={() => onCancel(id)}>Cancelar</button>
                </div>
                </>
                ) : (
                <>
                {/*CUERPO DE LA PUBLICACION*/}
                    <h4>{titulo}</h4>
                    <p>{contenido}</p>
                    <img src={imagen} alt="post" />
                </>
                )}
            </div>


            <div>
                {/*BOTON PARA VER O OCULTAR COMENTARIOS*/}
                <button onClick={() => toggleComentarios(id)}>
                    {mostrarComentarios ? "Ocultar comentarios" : "Ver comentarios"}
                </button>

                {/*BOTON PARA COMENTAR*/}
                <button onClick={() => toggleCrearComentario(id)}>
                    {mostrarCrearComentario ? "Cancelar" : "Comentar"}
                </button>

                <div>
                    {/*IMAGENES PARA REACCIONAR*/}
                    <img src={like} alt="like" onClick={onLike} 
                    style={{ filter: userReaction === 'like' ? 'invert(39%) sepia(96%) saturate(437%) hue-rotate(88deg) brightness(93%) contrast(92%)' : 'none' }}/>
                    
                    {likes}

                    <img src={dislike} alt="like" onClick={onDislike}
                    style={{ filter: userReaction === 'dislike' ? 'invert(39%) sepia(96%) saturate(437%) hue-rotate(358deg) brightness(93%) contrast(92%)' : 'none' }} />
                    {dislikes}
                    
                </div>
            </div>
            <div>
                {/*BOTONES PARA ELIMINAR O EDITAR*/}
                {!isEditing && <button onClick={() => onEditar(id)}>Editar</button>}
                <button onClick={onEliminar}>Eliminar</button>
            </div>
            {/*RENDERIZAR COMPONENTE PARA CREAR COMENTARIO*/}
            {mostrarCrearComentario && (
                <Crear_comentario 
                    contenido={comentarioContenido}
                    onChange={(e) => onComentarioChange(id, e.target.value)}
                    onSubmit={(e) => onSubmitComentario(e, id)}
                />
            )}
            {/*RENDERIZAR COMPONENTE PARA VER PUBLICACIONES*/}
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

export default Publicaciones_perfil