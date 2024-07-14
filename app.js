import express from 'express';
import bodyParser from 'body-parser';
import path, {dirname} from 'path';

import { itemRoutes } from './routes/item-routes.js';
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();
app.use(express.static(path.resolve('public/html')));
app.use(express.static(path.resolve('public')));

app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile("/html/index.html", {root: __dirname + '/public/'});
});

app.use("/items", itemRoutes);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('No token / Invalid token provided');
    } else {
        next(err);
    }
});