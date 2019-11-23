const express = require('express')
const app = express()
var admin = require('firebase-admin');
const port = 3000;

app.get('/', (req: any, res: any) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))