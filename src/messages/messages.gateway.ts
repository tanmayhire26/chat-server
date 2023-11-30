import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server } from 'socket.io'
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server
  constructor(private readonly messagesService: MessagesService) { }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {

    const newMessage = await this.messagesService.create(createMessageDto);
    console.log("New messagecreated..........", newMessage)
    this.server.emit('message', newMessage);
    return newMessage;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }


  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
    this.server.emit('join', name);
    return this.messagesService.identify(name, client.id)
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket
  ) {
    const clientName = await this.messagesService.getClientName(client.id);
    console.log("Client Name in typing.....", clientName)
    client.broadcast.emit('typing', { clientName, isTyping })
  }


  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log("Handshake from client query.... ", client.handshake.query);
    let { username, userid } = client.handshake.query
    username = username + "";
    userid = userid + "";
    console.log("Username in query", typeof username);
    const connectedClients = await this.messagesService.handleConnection({ userid: userid, username: username }, client.id);
    console.log("Connectedclients============= lidst ", connectedClients);
    return connectedClients;
  }

  @SubscribeMessage('createPrivateMessage')
  async createPrivateMessage(@MessageBody() newPvtMessage: { usernames: string[], text: string }) {
    const receiverIds = await this.messagesService.getSocketIdsFromUsername(newPvtMessage.usernames);

    for (let receiverId of receiverIds) {
      this.server.to(receiverId).emit('receivePvtMsg', newPvtMessage);
    }
    return newPvtMessage;
  }



  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }

  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }

  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messagesService.remove(id);
  // }
}
