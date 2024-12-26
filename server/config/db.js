import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('LabQuimico', "labuser", "Dino_123", {
    host: "localhost",
    dialect: 'mssql',
    define: {
        freezeTableName: true,
        timestamps: false
    }
});