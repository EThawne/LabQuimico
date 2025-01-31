import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Puntuales = sequelize.define('Puntuales', {
    Codigo: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    Hora: DataTypes.CHAR(8),
    Solucion: DataTypes.STRING(12),
    Valor: DataTypes.DOUBLE,
    Fecha: DataTypes.DATE
});