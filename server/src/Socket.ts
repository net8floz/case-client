import socketio from 'socket.io';
import { WebServer } from './WebServer';
import { singleton } from 'tsyringe';

@singleton()
export class Socket {
  private _io: SocketIO.Server;

  public get io() {
    return this._io;
  }
  constructor(private webServer: WebServer) {
    this._io = socketio(this.webServer.http);

    this._io.on('error', () => {
      console.log('Error');
    });
  }
}
