import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Muestra = sequelize.define('Muestra', {
    Codigo: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    Columna: DataTypes.STRING(45),
    Turno: DataTypes.CHAR(1),
    Elemento: DataTypes.STRING(45),
    Estado: DataTypes.CHAR(1),
    Ley: DataTypes.DOUBLE,
    Fecha: DataTypes.DATE
});