import { Sequelize } from 'sequelize'

export default new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        define: {
            underscored: true
        },
        logging: false,
        timezone: 'Europe/Moscow',
    }
)