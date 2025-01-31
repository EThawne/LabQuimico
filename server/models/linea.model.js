import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Lineas = sequelize.define('Lineas', {
    Codigo: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    Linea: DataTypes.CHAR(6),
    Turno: DataTypes.CHAR(1),
    Elemento: DataTypes.CHAR(2),
    Valor: DataTypes.DOUBLE,
    Fecha: DataTypes.DATE
});