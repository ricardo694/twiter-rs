import React,{useEffect,useState} from "react";
import Encabezado_perfil from "../Componentes/Encabezado_perfil";
import '../Paginas/css/Perfil.css'
import Formu_crear_publicacion from "../Componentes/Formu_crear_publicacion";
import Publicaciones_perfil from "../Componentes/Publicaciones_perfil";
import { useNavigate } from "react-router-dom";

const Perfil = () => {

    const navigate = useNavigate();

    //========ESTADOS NECESARIOS===========
    const [formData, setFormData] = useState({ titulo:"", imagen:"", contenido:"" });
    const [usuario, setUsuario] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [reacciones, setReacciones] = useState({});
    const [comentariosVisibles, setComentariosVisibles] = useState({});
    const [nuevoComentario, setNuevoComentario] = useState({});
    const [crearComentarioVisible, setCrearComentarioVisible] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [editForm, setEditForm] = useState({titulo: "", contenido: "", imagen: ""});
    
    /* -------------------------
        FUNCIONES DE EDICIÓN
    -------------------------- */
    const handleEditar = (postId, titulo, contenido, imagen) => {
    setEditingPostId(postId);
    setEditForm({ titulo, contenido, imagen });
};

    const handleChangeTitulo = (postId, value) => {
        if (editingPostId === postId) {
        setEditForm((prev) => ({ ...prev, titulo: value }));
        }
    };

    const handleChangeContenido = (postId, value) => {
        if (editingPostId === postId) {
        setEditForm((prev) => ({ ...prev, contenido: value }));
        }
    };

    const handleChangeImagen = (postId, value) => {
    if (editingPostId === postId) {
        setEditForm(prev => ({ ...prev, imagen: value }));
    }
};

//---- Cerrar Sesion ----
const handleCerrarSesion = async () => {
    if(window.confirm('¿Seguro que quieres cerrar tu sesion?')){
        try{
            const res = await fetch('http://localhost:3001/cerrar_sesion', {
                method:'POST',
                credentials:'include'
            })

            const result = await res.json()

            if(result.success){
                alert('¡Acabas de Cerrar tu Sesion')

                localStorage.removeItem("usuario")
                navigate('/Inicio_Sesion')

                window.onpageshow = function (evt){
                    if(evt.persisted){
                        window.location.reload()
                    }
                }
            }
            else{
                alert('No se pudo cerrar sesion')
            }
        }
        catch(error){
            console.error('Error: ' + error.message)
        }
    }
}

    const handleSave = async (postId) => {
    try {
        const res = await fetch(`http://localhost:3001/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
            credentials: "include"
        });
        if (!res.ok) throw new Error("Error al actualizar la publicación");

        // Actualizar en estado local
        setUserPosts(prev =>
            prev.map(p =>
                p.Id_post === postId
                    ? { ...p, Titulo: editForm.titulo, Contenido: editForm.contenido, Imagen: editForm.imagen }
                    : p
            )
        );

        alert('¡Publicacion actualizada correactamente!')

            setEditingPostId(null);
        } catch (err) {
            console.error(err);
        }
        };

    const handleCancel = () => {
        setEditingPostId(null);
        setEditForm({ titulo: "", contenido: "" });
    };

    
    /* ----------------------
    FUNCIONES DE COMENTARIOS
    ------------------------- */
    const fetchComentarios = async (postId) => {
        try {
            const res = await fetch(`http://localhost:3001/comentarios/${postId}`,{
                credentials: "include"
            });
            if (!res.ok) throw new Error("Error al obtener comentarios");
            const data = await res.json();

            setUserPosts(prev =>
                prev.map(p =>
                    p.Id_post === postId
                        ? { ...p, comentarios: data }
                        : p
                )
            );
        } catch (err) {
            console.error("Error cargando comentarios:", err);
        }
    };

    const toggleComentarios = (postId) => {
        setComentariosVisibles(prev => {
            const isVisible = !prev[postId];
            if (isVisible) fetchComentarios(postId); // cargar al abrir
            return { ...prev, [postId]: isVisible };
        });
    };

    const toggleCrearComentario = (postId) => {
        setCrearComentarioVisible(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleChangeComentario = (postId, value) => {
        setNuevoComentario(prev => ({
            ...prev,
            [postId]: value
        }));
    };

    const handleSubmitComentario = (e, postId) => {
        e.preventDefault();
        if (!nuevoComentario[postId] || nuevoComentario[postId].trim() === "") return;

        handleComentar(postId, nuevoComentario[postId]); // mandar al backend

        // limpiar solo ese comentario
        setUserPosts(prev =>
        prev.map(p =>
            p.Id_post === postId
                ? { ...p, comentarios: [...(p.comentarios || []), nuevoComentario] }
                : p
        )
    );

        // cerrar el formulario
        setCrearComentarioVisible(prev => ({
            ...prev,
            [postId]: false
        }));
    };

    const handleComentar = async (postId, contenido) => {
        try {
            const response = await fetch("http://localhost:3001/comentarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contenido,
                    usuarioId: usuario?.Id_usuario,
                    postId
                }),
                credentials: "include"
            });

            if (response.ok) {
                const nuevoComentario = await response.json();

                alert('¡Hiciste un comentario!')

                setPosts(prev =>
                    prev.map(p =>
                        p.Id_post === postId
                            ? { ...p, comentarios: [...(p.comentarios || []), nuevoComentario] }
                            : p
                    )
                );
            }
        } catch (error) {
            console.error("Error al comentar:", error);
        }
    };


    // Cargar usuario desde localStorage
    const fetchUsuario = () => {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        if (storedUser) setUsuario(storedUser);
        return storedUser;
    };

    //================== Cargar posts del usuario y sus reacciones====================
    const fetchUserPosts = async (usuarioActual) => {
        try {
            const res = await fetch(`http://localhost:3001/posts/${usuarioActual.Id_usuario}`, {
                credentials: "include"
            });
            if (!res.ok) throw new Error("Error al obtener posts");
            const data = await res.json();
            setUserPosts(data);

            // Cargar reacciones de cada post
            const reaccionesData = {};
            await Promise.all(
                data.map(async (post) => {
                    const resR = await fetch(`http://localhost:3001/reacciones/${post.Id_post}`, {
                        credentials: "include"
                    });
                    if (!resR.ok) throw new Error(`Error al obtener reacciones del post ${post.Id_post}`);
                    const rData = await resR.json();
                    let likes = 0, dislikes = 0, userReaction = null;
                    rData.forEach(r => {
                        if (r.Tipo === "like") likes++;
                        if (r.Tipo === "dislike") dislikes++;
                        if (r.UsuarioId_usuario === usuarioActual?.Id_usuario) userReaction = r.Tipo;
                    });
                    reaccionesData[post.Id_post] = { likes, dislikes, userReaction };
                })
            );
            setReacciones(reaccionesData);

        } catch (err) {
            console.error("Error cargando publicaciones o reacciones:", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            const storedUser = fetchUsuario();
            if (storedUser) await fetchUserPosts(storedUser);
        };
        init();
    }, []);

    // Manejar reacciones
    const handleReaction = async (postId, tipo) => {
        try {
            await fetch('http://localhost:3001/reacciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, usuarioId: usuario?.Id_usuario, tipo }),
                credentials: "include"
            });

            setReacciones(prev => {
                const postReac = prev[postId] || {};
                let { likes = 0, dislikes = 0, userReaction = null } = postReac;

                if (tipo === 'like') {
                    if (userReaction === 'dislike') dislikes--;
                    if (userReaction !== 'like') likes++;
                } else {
                    if (userReaction === 'like') likes--;
                    if (userReaction !== 'dislike') dislikes++;
                }

                return { ...prev, [postId]: { likes, dislikes, userReaction: tipo } };
            });

        } catch (err) {
            console.error("Error al reaccionar:", err);
        }
    };

    // Manejar inputs
    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Eliminar publicación
    const handleEliminar = async (postId) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;

        try {
            const res = await fetch(`http://localhost:3001/posts/${postId}`, { 
                method: "DELETE",
                credentials: "include"
            });
            if (res.ok) setUserPosts(userPosts.filter(post => post.Id_post !== postId));
        } catch (err) {
            console.error(err);
        }
    };

    // Crear publicación
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3001/cposts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Titulo: formData.titulo,
                    Imagen: formData.imagen,
                    Contenido: formData.contenido,
                    UsuarioId_usuario: usuario.Id_usuario
                }),
                credentials: "include"
            });
            if (res.ok) {
                setFormData({ titulo: "", imagen: "", contenido: "" });
                alert('¡Publicaste algo!')
                await fetchUserPosts(usuario); // Refrescar posts y reacciones
            }
        } catch (err) {
            console.error(err);
        }
    };


    return(
        <div className="contenedor_perfil">
            <div className="caja_perfil">
                <Encabezado_perfil 
                    fotoPerfil={usuario?.Foto_perfil}
                    nombre={usuario?.Nombre}
                    correo={usuario?.Correo}
                    handleCerrarSesion = {handleCerrarSesion}
                />
                <Formu_crear_publicacion
                    titulo={formData.titulo}
                    imagen={formData.imagen}
                    contenido={formData.contenido}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>

            <div className="caja_publicaciones_perfil">
                {userPosts.map(post => (
                    <Publicaciones_perfil
                    //PROPS DE PUBLICACIONES
                        key={post.Id_post}
                        id={post.Id_post}
                        nombre={post.Nombre}
                        fotoPerfil={post.Foto_perfil}
                        titulo={post.Titulo}
                        contenido={post.Contenido}
                        imagen={post.Imagen}
                        fecha={new Date(post.Fecha_creacion).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                        //PROPS DE REACCIONES
                        likes={reacciones[post.Id_post]?.likes || 0}
                        dislikes={reacciones[post.Id_post]?.dislikes || 0}
                        userReaction={reacciones[post.Id_post]?.userReaction || null}
                        onLike={() => handleReaction(post.Id_post, 'like')}
                        onDislike={() => handleReaction(post.Id_post, 'dislike')}
                        onEliminar={() => handleEliminar(post.Id_post)}
                        //PROPS DE COMENTARIOS
                        mostrarComentarios={comentariosVisibles[post.Id_post] || false}
                        toggleComentarios={() => toggleComentarios(post.Id_post)}
                        mostrarCrearComentario={crearComentarioVisible[post.Id_post] || false}
                        toggleCrearComentario={() => toggleCrearComentario(post.Id_post)}
                        comentarioContenido={nuevoComentario[post.Id_post] || ""}
                        onComentarioChange={(id, value) => handleChangeComentario(id, value)}
                        onSubmitComentario={(e) => handleSubmitComentario(e, post.Id_post)}
                        comentarios={post.comentarios || []}
                        //  props de edición
                        isEditing={editingPostId === post.Id_post}
                        editForm={editForm}
                        onEditar={() => handleEditar(post.Id_post, post.Titulo, post.Contenido, post.Imagen)}
                        onChangeTitulo={handleChangeTitulo}
                        onChangeContenido={handleChangeContenido}
                        onChangeImagen={handleChangeImagen}
                        onSave={() => handleSave(post.Id_post)}
                        onCancel={handleCancel}
                    />
                ))}
            </div>
        </div>
    )
}

export default Perfil;