import { createServer } from "./server/index";

async function start() {
    const server = await createServer()
    server.listen()
}

start()


