import express from 'express';
import https from 'https';
import http from 'http';
import cors from 'cors';
import { singleton } from 'tsyringe';
import fs from 'fs';

const key = fs.readFileSync('./key.pem');

const cert = fs.readFileSync('./cert.pem');

@singleton()
export class WebServer {
  private _expressApp = express();
  private _http: http.Server;

  constructor() {
    this._expressApp.use(cors());

    const useHttps = true;
    if (useHttps) {
      this._http = https.createServer(
        {
          key,
          cert
        },
        this._expressApp
      );
    } else {
      this._http = http.createServer(this._expressApp);
    }

    this._expressApp.get('/', (_, res) => {
      res.json('success');
    });
  }

  public get express() {
    return this._expressApp;
  }

  public get http() {
    return this._http;
  }

  public serve(port: number) {
    this._http.listen(port, () => {
      console.log('Serving on ' + port);
    });
  }
}
