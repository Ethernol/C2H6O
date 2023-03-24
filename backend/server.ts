
import express from "npm:express";
// import router from "./routes.ts";

const APP = express();

APP.get("/", (req: any, res: { send: (arg0: string) => void; }) => {
    res.send("Server started.");
})

const PORT = 3000;

APP.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})
