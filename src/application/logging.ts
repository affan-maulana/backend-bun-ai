import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";

// Pastikan folder logs ada
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Konfigurasi Winston
export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" })
    ]
});
