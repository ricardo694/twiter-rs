import { BrowserRouter, Route, Routes } from "react-router-dom"
import Inicio_Sesion from "./Paginas/Inicio_Sesion"
import Registro from "./Paginas/Registro"
import Inicio from "./Paginas/Inicio"
import Perfil from "./Paginas/Perfil"

const App = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path='/Inicio_Sesion' element={<Inicio_Sesion/>}/>
                <Route exact path='/Registro' element={<Registro/>}/>
                <Route exact path='/Inicio' element={<Inicio/>}/>
                <Route exact path='/Perfil' element={<Perfil/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App