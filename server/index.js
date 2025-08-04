const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { google } = require("google-translate-open-api");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("voice-text", async ({ text, targetLang }) => {
        console.log(`Text to Translate: ${text}`);

        try {
            const result = await google(text, {
                tld: "com",
                to: targetLang
            });

            const translated = result.data[0];
            console.log(`Translated (${targetLang}): ${translated}`);

            socket.emit("translated-text", { translated });

        } catch (err) {
            console.error("Translation error:", err);
            socket.emit("error", { message: "Translation failed" });
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
