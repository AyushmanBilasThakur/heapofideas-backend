"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = void 0;
var nodemailer_1 = require("nodemailer");
exports.transport = (0, nodemailer_1.createTransport)({
    host: "smtp.ayushmanbthakur.com",
    port: 587,
    secure: false,
    ignoreTLS: true,
    auth: {
        user: "test@ayushmanbthakur.com",
        pass: String(process.env.NODEMAILER_PASSWORD)
    },
    tls: {
        rejectUnauthorized: false
    }
});
