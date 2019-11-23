import { Request, Response } from "express-serve-static-core";
import { Express } from "express";

const express = require('express')
const app: Express = express()
var admin = require('firebase-admin');
const port = 3000;

app.get('/', (req: Request, res: Response) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))