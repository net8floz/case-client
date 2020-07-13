import 'reflect-metadata';
import { container } from 'tsyringe';
import { SystemTemps, CpuTemp } from './SystemTemps';
import { WebServer } from './WebServer';
import { Socket } from './Socket';

const temps = container.resolve<SystemTemps>(SystemTemps);
const webServer = container.resolve<WebServer>(WebServer);
const socketio = container.resolve(Socket);

temps.pollTemperatues(10000);

webServer.serve(6969);

socketio.io.on('connect', socket => {
  function onTempUpdate(temp: CpuTemp) {
    socket.emit('temp', temp);
  }

  temps.get().then(onTempUpdate);

  temps.onUpdate(onTempUpdate);

  socket.on('disconnected', () => {
    temps.offUpdate(onTempUpdate);
  });
});
