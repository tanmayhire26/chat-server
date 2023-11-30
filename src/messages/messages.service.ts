import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = [{name: "Glenn", text: "Hey"}];
  clientToUser = {};
  connectedClients: {userid: string, username: string, socketId: string}[] = [];






  create(createMessageDto: CreateMessageDto) {
    const newMessage = {...createMessageDto};
     this.messages.push(newMessage);
     return this.messages;
  }

  findAll() {
    return this.messages;
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId]
  }

  handleConnection(connectedUserDetails: {userid:string, username: string}, clientId: string) {
    this.connectedClients.push({...connectedUserDetails, socketId: clientId});
    return this.connectedClients
  }

  getSocketIdFromUsername(username){
    const filteredUsers = this.connectedClients.filter((cc) => cc.username == username);
    const connectedUser = filteredUsers[0];
    return connectedUser.socketId;
  }

  getSocketIdsFromUsername(usernames) {
    const filteredUsers = this.connectedClients.filter((cc) => usernames.includes(cc.username));
    const socketIds = filteredUsers.map((fu)=> fu.socketId);
    return socketIds;
  }



  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
