import React,{useEffect, useState} from "react";
//COMPONENTES
import Encabezado_inicio from "../Componentes/Encabezado_inicio";
import Publicacion from "../Componentes/Publicacion";
//CSS
import '../Paginas/css/Inicio.css'

const Inicio = () => {
    /*--------------------
        ESTADOS NECESARIOS
    --------------------*/
    const [usuario, setUsuario] = useState(null);
    const [posts, setPosts] = useState([]);
    const [reacciones, setReacciones] = useState({});
    const [comentariosVisibles, setComentariosVisibles] = useState({});
    const [nuevoComentario, setNuevoComentario] = useState({});
    const [crearComentarioVisible, setCrearComentarioVisible] = useState({});
    
    /*=======================FUNCIONES DE COMENTARIOS==========================*/
    const fetchComentarios = async (postId) => {
        try {
            const res = await fetch(`http://localhost:3001/comentarios/${postId}`);
            if (!res.ok) throw new Error("Error al obtener comentarios");
            const data = await res.json();

            setPosts(prev =>
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

        handleComentar(postId, nuevoComentario[postId]); 

        // limpiar solo ese comentario
        setNuevoComentario(prev => ({
            ...prev,
            [postId]: ""
        }));

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
                })
            });

            if (response.ok) {
                const nuevoComentario = await response.json();

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



    /*-------------------------------
    Cargar usuario desde localStorage
    -------------------------------*/
    const fetchUsuario = () => {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        if (storedUser) setUsuario(storedUser);
        return storedUser; // Retornar para usar en fetchReacciones
    };

    /*-----------------------
    Cargar posts y reacciones
    -----------------------*/
    const fetchPosts = async (usuarioActual) => {
    try {
        const res = await fetch("http://localhost:3001/posts");
        if (!res.ok) throw new Error("Error al obtener posts");
        const data = await res.json();
        setPosts(data);

        /*----------------------------------
        Cargar reacciones de todos los posts
        ----------------------------------*/ 
        const reaccionesData = {};
        await Promise.all(
            data.map(async (post) => {
                const resR = await fetch(`http://localhost:3001/reacciones/${post.Id_post}`);
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

    // Inicializar datos al montar
    useEffect(() => {
        const init = async () => {
            const storedUser = fetchUsuario();
            await fetchPosts(storedUser);
        };
        init();
    }, []);

    /*---------------------------
    Manejar reacciones de usuario
    ---------------------------*/
    const handleReaction = async (postId, tipo) => {
        try {
            await fetch('http://localhost:3001/reacciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, usuarioId: usuario?.Id_usuario, tipo })
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


    return(
        <div className="contenedor_inicio">
            <Encabezado_inicio fotoPerfil={usuario?.Foto_perfil}/>
            <div className="conenedor_publicaciones_inicio">
                {posts.map((post) => (
    <Publicacion
        //PROPS DE PUBLICACIONES
        key={post.Id_post}
        id={post.Id_post}
        nombre={post.Nombre}
        fotoPerfil={post.Foto_perfil}
        titulo={post.Titulo}
        contenido={post.Contenido}
        imagen={post.Imagen}
        fecha={new Date(post.Fecha_creacion).toLocaleString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })}
        //PROPS DE REACCIONES
        likes={reacciones[post.Id_post]?.likes || 0}
        dislikes={reacciones[post.Id_post]?.dislikes || 0}
        userReaction={reacciones[post.Id_post]?.userReaction || null}
        onLike={() => handleReaction(post.Id_post, 'like')}
        onDislike={() => handleReaction(post.Id_post, 'dislike')}
        //PROPS DE COMENTARIOS
        mostrarComentarios={comentariosVisibles[post.Id_post] || false}
        toggleComentarios={() => toggleComentarios(post.Id_post)}
        mostrarCrearComentario={crearComentarioVisible[post.Id_post] || false}
        toggleCrearComentario={() => toggleCrearComentario(post.Id_post)}
        comentarioContenido={nuevoComentario[post.Id_post] || ""}
        onComentarioChange={(id, value) => handleChangeComentario(id, value)}
        onSubmitComentario={(e) => handleSubmitComentario(e, post.Id_post)}
        comentarios={post.comentarios || []}
    />
))}
                
            </div>
            
        </div>
    )
}

export default Inicio



