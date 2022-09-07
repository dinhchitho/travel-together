import fs from "fs";
import dotenv from "dotenv";
import {env} from "process";

dotenv.config();

const envFileConfig = fs.readFileSync(__dirname + '/../.env.' + env.environment);

const envConfig = dotenv.parse(envFileConfig);

for(const k in envConfig) { process.env[k] = envConfig[k]; console.log(process.env[k]);
};
