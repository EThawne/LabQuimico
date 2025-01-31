import { Muestra } from "./models/muestra.model.js";
import express from "express";
import XLSX from "xlsx";
import 'dotenv/config'

import cors from "cors";
import { sequelize } from "./config/db.js";
import { muestras, puntuales } from "./constants/constans.js";
import multer from "multer";
import { Puntuales } from "./models/puntual.model.js";

const app = express();

app.use(cors());

app.use(express.json());

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

        const muestrasA = getMuestrasDB(muestras.celdas, sheetA, "A")
        const muestrasB = getMuestrasDB(muestras.celdas, sheetB, "B")

        const punt = getPuntuales(puntuales.celdas, sheetB)
        const _punt = []

        punt.map((puntual, i) => {
            _punt.push({ Codigo: null, Hora: "05:00:00", Solucion: puntuales.soluciones[i], Valor: puntual })
        })

        console.log(_punt)

        await sequelize.transaction(async t => {

            await Muestra.bulkCreate(muestrasA, t)
            await Muestra.bulkCreate(muestrasB, t)
            await Puntuales.bulkCreate(_punt, t)
        })

        return res.json({ message: "Muestras enviadas correctamente" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Error en el servidor" })
    }
})

const getMuestrasDB = (celdas, sheet, turno) => {
    const muestrasDB = []
    const muestra = getMuestra(celdas, sheet)
    muestra.map((fila, i) => {
        fila.map((value, j) => {
            muestrasDB.push({ Codigo: null, Columna: muestras.pregnants[i], Turno: turno, Elemento: muestras.elementos[j], Estado: muestras.estados[j], Ley: value })
        })
    })

    return muestrasDB
}

const getMuestra = (celdas, sheet) => {

    const values = Array.from({ length: 32 }, () => Array(8).fill(null))

    values.map((fila, i) => {
        let suma = 19
        fila.map((value, j) => {
            const cellAddress = `${celdas[j]}${i + suma}`; // Dirección de la celda (E8, E9, ..., E37)
            const cell = sheet[cellAddress];
            values[i][j] = cell ? cell.v : 0; // Agregar el valor de la celda a la columna
        })
    })
    return values
}

const getPuntuales = (celdas, sheet) => {
    const values = []
    celdas.map(celda => {
        const cellAddress = `${celda}${56}`; // Dirección de la celda (E8, E9, ..., E37)
        const cell = sheet[cellAddress];
        values.push(cell ? cell.v : 0); // Agregar el valor de la celda a la columna
    })
    return values
}

app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT)
})