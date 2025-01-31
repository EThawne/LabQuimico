import { Muestra } from "./models/muestra.model.js";
import express from "express";
import XLSX from "xlsx";
import 'dotenv/config'

import cors from "cors";
import { sequelize } from "./config/db.js";
import { Resumen } from "./models/resumen.model.js";
import { constants, puntuales } from "./constants/constans.js";
import multer from "multer";
import { Puntuales } from "./models/puntual.model.js";

const app = express();

app.use(cors());

//Lectura y parseo del body
app.use(express.json());

app.get("/test/hello", async (req, res) => {
    return res.json({ message: "Servidor corriendo" })
})

app.post("/lab/muestras", async (req, res) => {

    let muestras = [];

    const data = req.body;

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

const upload = multer({ storage: multer.memoryStorage() })

app.post("/files/leer-excel", upload.array("files"), async (req, res) => {

    if (!req.files) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const workbookA = XLSX.read(req.files[0].buffer, { type: "buffer" })
        const workbookB = XLSX.read(req.files[1].buffer, { type: "buffer" })
        // Obtener la primera hoja de trabajo
        const sheetA = workbookA.Sheets[workbookA.SheetNames[0]];
        const sheetB = workbookB.Sheets[workbookB.SheetNames[0]];

        const muestrasA = getMuestrasDB(constants.celdas, constants.elementos, constants.estados, sheetA, "A")
        const muestrasB = getMuestrasDB(constants.celdas, constants.elementos, constants.estados, sheetB, "B")
        const muestrasFA = getMuestrasDB(constants.celdas2, constants.elementos2, constants.nulls, sheetA, "A")
        const muestrasFB = getMuestrasDB(constants.celdas2, constants.elementos2, constants.nulls, sheetB, "B")

        console.log(muestrasA)
        console.log(muestrasB)

        // let resumen = []

        // const matriz = getResumenes(constants.columnas, sheet) 

        // matriz.map((fila, i) => {
        //     fila.map((value, j) => {
        //         resumen.push({Codigo: null, Circuito: constants.circuitos[i], Elemento: constants.elements[j], Solucion: constants.soluciones[j], Valor: value})
        //     })    
        // })

        // const punt = getPuntuales(puntuales.celdas, sheet)
        // const _punt = []

        // punt.map((fila, i) => {
        //     fila.map((value, j) => {
        //         _punt.push({Codigo: null, Hora: puntuales.horas[i], Solucion: puntuales.soluciones[j], Valor: value})
        //     })    
        // })

        // await sequelize.transaction(async t => {

        //     for (let index = 0; index < 4; index++) {
        //         await Muestra.bulkCreate(muestrasA[index], t)
        //         await Muestra.bulkCreate(muestrasB[index], t)

        //     }

        //     await Resumen.bulkCreate(resumen, t)

        //     await Puntuales.bulkCreate(_punt, t)
        // })

        return res.json({ message: "Muestras enviadas correctamente" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Error en el servidor" })
    }
})

const getMuestrasDB = (celdas, elemento, estados, sheet, turno) => {
    const muestrasDB = [[], [], [], []]
    celdas.map((celda, index) => {
        const muestra = getMuestra(celda, sheet)
        muestra.map((fila, i) => {
            fila.map((value, j) => {
                muestrasDB[index].push({ Codigo: null, Columna: constants.pregnants[i][j], Turno: turno, Elemento: elemento[index], Estado: estados[index], Ley: value })
            })
        })
    })
    for (let index = 0; index < 4; index++) {

    }
    return muestrasDB
}

const getMuestra = (celda, sheet) => {

    const values = Array.from({ length: 6 }, () => Array(5).fill(null))

    values.map((fila, i) => {
        let suma = 19
        fila.map((columna, j) => {
            const cellAddress = `${celda}${j + i + suma}`; // Dirección de la celda (E8, E9, ..., E37)
            const cell = sheet[cellAddress];
            values[i][j] = cell ? cell.v : 0; // Agregar el valor de la celda a la columna
            suma += 5
        })
    })
    return values
}

// const getResumenes = (celda, sheet) => {

//     const values = Array.from({ length: 5 }, () => Array(10).fill(null))

//     values.map((fila, i) => {      
//         fila.map((columna, j) => {
//             const cellAddress = `${celda[j]}${i + 8}`; // Dirección de la celda (E8, E9, ..., E37)
//             const cell = sheet[cellAddress];
//             values[i][j] = cell ? Number(cell.v.toFixed(3)) : 0; // Agregar el valor de la celda a la columna
//         })
//     })
//     return values
// }

// const getPuntuales = (celda, sheet) => {
//     const values = Array.from({ length: 6 }, () => Array(10).fill(null))

//     values.map((fila, i) => {      
//         fila.map((columna, j) => {
//             const cellAddress = `${celda[j]}${i + 49}`; // Dirección de la celda (E8, E9, ..., E37)
//             const cell = sheet[cellAddress];
//             values[i][j] = cell ? cell.v : 0; // Agregar el valor de la celda a la columna
//         })
//     })
//     return values
// }

app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT)
})