import { createServer, Server } from "node:http";
import connect from 'connect'

export function resolveHttpServer(app: connect.Server) {
    return createServer(app) as Server
}