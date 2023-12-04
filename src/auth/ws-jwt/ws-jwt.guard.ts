import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import {Socket} from 'Socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    if(context.getType() !== 'ws') 
    return true;

    const client: Socket = context.switchToWs().getClient();
    const {authorization} = client.handshake.headers; //client.handshake.auth for general usercase wiht Ui client.handshake.headers for postman testing
console.log({authorization}, " Got the auth !")  
WsJwtGuard.validateToken(client)
return false;
}

static validateToken(client: Socket) {
  const {authorization} = client.handshake.headers;
  console.log({authorization});
  // throw new Error ('some error in ws-jwt');
  const token: string = authorization.split(' ')[1];
  const payload = verify(token, 'secretKey');
  return payload;
}

}
