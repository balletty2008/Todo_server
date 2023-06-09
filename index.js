"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
// Start new instance of express
const app = (0, express_1.default)();
// Packages use by app
app.use((0, cors_1.default)());
app.use(express_1.default.json()); //allows reading posted values from client as json
app.use(express_1.default.urlencoded({ extended: false }));
// Create connection with Database
const openDb = () => {
    const pool = new pg_1.Pool({
        /*user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'hahaha',
        port: 5432*/
        user: 'root',
        host: 'dpg-cgijga6bb6mnfcqrk52g-a.oregon-postgres.render.com',
        database: 'todo_03rn',
        password: '4SBACbNNlonBy51erxe4HBvTN3DUswGJ',
        port: 5432,
        ssl: true
    });
    return pool;
};
// Port number declarition
const port = 3001;
app.get('/', (req, res) => {
    const pool = openDb();
    pool.query('select * from task', (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json(result.rows);
    });
});
app.post('/new', (req, res) => {
    const pool = openDb();
    pool.query('insert into task (description) values ($1) returning *', [req.body.description], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: result.rows[0].id });
    });
});
app.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = openDb();
    const id = parseInt(req.params.id);
    pool.query('delete from task where id = $1', [id], (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        res.status(200).json({ id: id });
    });
}));
app.listen(port);
