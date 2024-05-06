import {config} from 'dotenv'

config();

const envConfig = {
    PORT : process.env.PORT,
    DB_uri :process.env.MONGO_CONNECTION_STRING,
    JWT_token :process.env.JWT_TOKEN
}

export default envConfig;