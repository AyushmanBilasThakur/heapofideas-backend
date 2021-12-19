import {createTransport} from "nodemailer";

export const transport = createTransport({
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
})