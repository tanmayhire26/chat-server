import { WsJwtGuard } from "./ws-jwt/ws-jwt.guard";
import {Socket} from 'socket.io';

export type SocketIOMiddleware = {
    (client: Socket, next: (err? :Error)=> void);
}

export const SocketAuthMiddleware = ():SocketIOMiddleware => {
    return (client, next) => {
        try {
            WsJwtGuard.validateToken(client);
            next();
        } catch (error) {
            next(error);
        }
    }
}