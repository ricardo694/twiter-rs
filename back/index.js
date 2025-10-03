const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const session = require('express-session');

const app = express();
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret:'1234',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))


/*==============================conexión a la base de datos=============================*/ 
const db = mysql.createConnection({
    host: 'localhost',   
    user: 'root',   
    password: '', 
    database: 'pato' 
});

/*-------------------
    manejo de errores
---------------------
*/
db.connect(err => {
    if (err) {
    console.error("Error de conexión:", err);
    return;
    }
    console.log("Conectado a la base de datos ");
});



/*=========================================Rutas de registro==================================*/

/*-------------------
    registrar usuario
-------------------*/
app.post("/registrar",(req,res)=>{
    const {Nombre, Correo , Contrasena , Foto_perfil}=req.body;                                      //campos de la base de datos

    const query= "INSERT INTO Usuario (Nombre, Correo, Contrasena, Foto_perfil) VALUES (?, ?, ?, ?)" //consulta a la base de datos

    db.query(query, [Nombre, Correo, Contrasena, Foto_perfil],(err,results)=>{                      //campos que se van a insertar
        if (err){
            console.error("Error al registrar",err);
            return res.status(500).json({error: "No se pudo registrar usuario"});
        }
        res.json({ message: "Usuario registrado "});
    })
    
    
})

/*----------------
    iniciar sesión
----------------*/
app.post("/login",(req,res)=>{
    const {Nombre, Contrasena}=req.body;

    const query="SELECT * FROM Usuario WHERE Nombre = ? AND Contrasena = ?";
    
    db.query(query, [Nombre, Contrasena], (err, results) => {
        if (err) {
            console.error("Error al iniciar sesión:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        if (results.length > 0) {
            req.session.usuario = results[0]
            res.json({ message: "Inicio de sesión exitoso", usuario: results[0] });
        } else {
            res.status(401).json({ error: "Nombre o contraseña incorrectos o usuario no registrado" });
        }
    });
})


/*----------------
    cerrar sesión
----------------*/
app.post('/cerrar_sesion', async(req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.log(err)
            res.status(500).json({
                success:false,
                message:'Error al cerrar sesion'
            })
        }
        else{
            res.status(201).json({
                success:true,
                message:'Sesion cerrada'
            })
        }
    })
})


/*=========================================Rutas de inicio==================================*/

/*-----------------------------------------------------
    obtener publicaciones hechas por todos los usuarios
-----------------------------------------------------*/
app.get("/posts", (req, res) => {
    const query = `
        SELECT 
        Post.Id_post,
        Post.Titulo,
        Post.Imagen,
        Post.Contenido,
        Post.Fecha_creacion,
        Usuario.Nombre,
        Usuario.Foto_perfil
        FROM Post
        INNER JOIN Usuario ON Post.UsuarioId_usuario = Usuario.Id_usuario
        ORDER BY Post.Fecha_creacion DESC
        `;

    db.query(query, (err, results) => {
        if (err) {
        console.error("Error al obtener publicaciones:", err);
        return res.status(500).json({ error: "Error al obtener publicaciones" });
        }
        res.json(results);
    });
});

/*--------------------------------------------
    obtener publicaciones de un usuario por id
--------------------------------------------*/
app.get("/posts/:userId", (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT 
            Post.Id_post,
            Post.Titulo,
            Post.Imagen,
            Post.Contenido,
            Post.Fecha_creacion,
            Usuario.Nombre ,
            Usuario.Foto_perfil
        FROM Post
        INNER JOIN Usuario ON Post.UsuarioId_usuario = Usuario.Id_usuario
        WHERE Usuario.Id_usuario = ?
        ORDER BY Post.Fecha_creacion DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error al obtener publicaciones:", err);
            return res.status(500).json({ error: "Error al obtener publicaciones" });
        }
        res.json(results);
    });
});

/*=========================================crud de usuario==================================*/

/*---------------------
    crear publicaciones
---------------------*/
app.post("/cposts", (req, res) => {
    const { Titulo, Imagen, Contenido, UsuarioId_usuario } = req.body;


    const query = `
        INSERT INTO Post (Titulo, Imagen, Contenido, Fecha_creacion, UsuarioId_usuario)
        VALUES (?, ?, ?, NOW(), ?)
    `;

    db.query(query, [Titulo, Imagen, Contenido, UsuarioId_usuario], (err, result) => {
        if (err) {
            console.error("Error al crear publicación:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        res.json({ message: "Publicación creada exitosamente", postId: result.insertId });
    });
});

/*----------------------
    eliminar publicacion
----------------------*/
app.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
        // Eliminar reacciones
        await new Promise((resolve, reject) => {
            db.query("DELETE FROM Reaccion WHERE PostId_post = ?", [postId], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Eliminar comentarios
        await new Promise((resolve, reject) => {
            db.query("DELETE FROM Comentario WHERE PostId_post = ?", [postId], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        //  eliminar el post
        db.query("DELETE FROM Post WHERE Id_post = ?", [postId], (err, result) => {
            if (err) {
                console.error("Error al eliminar la publicación:", err.sqlMessage);
                return res.status(500).json({ error: err.sqlMessage });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Publicación no encontrada" });
            }
            res.json({ message: "Publicación eliminada exitosamente" });
        });

    } catch (err) {
        console.error("Error eliminando dependencias:", err);
        res.status(500).json({ error: "Error eliminando comentarios o reacciones" });
    }
});

/*--------------------
    editar publicacion
--------------------*/
app.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, imagen } = req.body;

    // Validaciones básicas
    if (!titulo || !contenido) {
        return res.status(400).json({ error: "Titulo y contenido son requeridos" });
    }

    const sql = 'UPDATE Post SET Titulo = ?, Contenido = ?, Imagen = ? WHERE Id_post = ?';
    db.query(sql, [titulo, contenido, imagen, id], (err, result) => {
        if (err) {
            console.error('Error SQL:', err); // <--- esto te dirá la causa exacta
            return res.status(500).json({ error: err.message });
        }

        if(result.affectedRows === 0){
            return res.status(404).json({ error: "Post no encontrado" });
        }

        res.json({ message: "Post actualizado correctamente" });
    });
});

/*=========================================reaciones==================================*/

/*---------------------------
obtener reacciones de un post
----------------------------*/
app.get('/reacciones/:postId', (req, res) => {
    const { postId } = req.params;

    const query = `
        SELECT Tipo, COUNT(*) AS total, UsuarioId_usuario
        FROM Reaccion
        WHERE PostId_post = ?
        GROUP BY Tipo, UsuarioId_usuario
    `;

    db.query(query, [postId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

/*-----------------------------
    crear - actualizar reaccion
-----------------------------*/
app.post('/reacciones', (req, res) => {
    const { postId, usuarioId, tipo } = req.body;

    // Primero verificamos si ya existe una reacción del usuario
    const checkQuery = `
        SELECT * FROM Reaccion
        WHERE PostId_post = ? AND UsuarioId_usuario = ?
    `;

    db.query(checkQuery, [postId, usuarioId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            // Si ya reaccionó, actualizamos
            const updateQuery = `
                UPDATE Reaccion SET Tipo = ? WHERE Id_reaccion = ?
            `;
            db.query(updateQuery, [tipo, results[0].Id_reaccion], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ message: 'Reacción actualizada' });
            });
        } else {
            // Si no ha reaccionado, insertamos
            const insertQuery = `
                INSERT INTO Reaccion (Tipo, PostId_post, UsuarioId_usuario)
                VALUES (?, ?, ?)
            `;
            db.query(insertQuery, [tipo, postId, usuarioId], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ message: 'Reacción creada' });
            });
        }
    });
});

/*=========================================comentarios==================================*/

/*------------------
    CREAR COMENTARIO
-------------------*/
app.post("/comentarios", (req, res) => {
    const { contenido, usuarioId, postId } = req.body;

    if (!contenido || !usuarioId || !postId) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const fecha = new Date(); // Fecha actual

    const query = `
        INSERT INTO Comentario (Contenido, Fecha_creacion, UsuarioId_usuario, PostId_post)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [contenido, fecha, usuarioId, postId], (err, result) => {
        if (err) {
            console.error(" Error al insertar comentario:", err);
            return res.status(500).json({ error: "Error al insertar comentario" });
        }

        res.status(201).json({
            id: result.insertId,
            contenido,
            fecha,
            usuarioId,
            postId
        });
    });
});

/*---------------------
    OBTENER COMENTARIOS
---------------------*/
app.get("/comentarios/:postId", (req, res) => {
    const { postId } = req.params;

    const query = `
        SELECT comentario.*, usuario.Nombre, usuario.Foto_perfil 
        FROM Comentario 
        JOIN Usuario ON comentario.UsuarioId_usuario = usuario.Id_usuario
        WHERE PostId_post = ? 
        ORDER BY Fecha_creacion DESC
    `;

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error(" Error al obtener comentarios:", err);
            return res.status(500).json({ error: "Error al obtener comentarios" });
        }

        res.json(results);
    });
});


/*--------
    puerto
----------
*/

app.listen(3001, () => {
    console.log(`Servidor corriendo en http://localhost:3001`);
});