import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Resumen = sequelize.define('Resumen', {
    Codigo: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    Circuito: DataTypes.STRING(20),
    Elemento: DataTypes.CHAR(4),
    Solucion: DataTypes.STRING(8),
    Valor: DataTypes.DOUBLE,
    Fecha: DataTypes.DATE
});