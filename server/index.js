import { Muestra } from "./models/muestra.model.js";
import  express  from "express";
import 'dotenv/config'

import cors  from "cors";

//Creando el servidor express
const app = express();

//Configuracion de CORS
app.use(cors());

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
//     res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
//     res.header('Access-Control-Allow-Credentials', true);
//     next();
// })

//Lectura y parseo del body
app.use(express.json());


// app.use('/api/persona', require('./routes/persona.route'));

app.get("/test/hello", async (req, res) => {
    return res.json({ message: "Servidor corriendo" })
})

app.post("/lab/muestras", async (req, res) => {

    let muestras = [];

    const data =  req.body;

    const { valores, turno, elemento, estado, labels } = data

    valores.map((fila, i) => {
        fila.map((value, j) => {
            muestras.push({ Codigo: null, Columna: labels[i][j], Turno: turno, Elemento: elemento, Estado: estado, Ley: value })
        })      
    })

     console.log(muestras)

    try {
        const _muestras = await Muestra.bulkCreate(muestras)
        res.json({ message: "Muestras enviadas correctamente" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error en el servidor" })
    }
})


//Para levantar el servidor
app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT)
})