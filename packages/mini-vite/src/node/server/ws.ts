import { WebSocketServer as WebSocketServerRaw } from 'ws'
import { HMR_PORT } from '../constant';

export function createWebSocketServer() {
    const wss = new WebSocketServerRaw({
        port: HMR_PORT
    })

    return {
        send(...args: any[]) {

            const payload = args[0]
            const stringified = JSON.stringify(payload)
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(stringified)
                }
            })
        }
    }
}