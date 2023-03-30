import express, {Express, Request, Response} from 'express'
import cors from 'cors'
import {Pool, QueryResult} from 'pg'

// Start new instance of express
const app: Express = express()
// Packages use by app
app.use(cors())
app.use(express.json())     //allows reading posted values from client as json
app.use(express.urlencoded({extended: false}))

// Create connection with Database
const openDb = (): Pool => {
    const pool: Pool = new Pool ({
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
        
    })
    return pool
}

// Port number declarition
const port = 3001

app.get('/', (req: Request,res: Response) => {
    const pool = openDb()
    
    pool.query('select * from task', (error,result) => {
        if (error) {
            res.status(500).json({error: error.message})
        }
        res.status(200).json(result.rows)
    })
})

app.post('/new', (req: Request,res: Response) => {
    const pool = openDb()

    pool.query('insert into task (description) values ($1) returning *',
    [req.body.description],
    (error: Error,result: QueryResult) => {
        if (error) {
            res.status(500).json({error: error.message})
        }

        res.status(200).json({id: result.rows[0].id})
    })
})

app.delete('/delete/:id',async(req: Request,res: Response) => {
    const pool = openDb()

    const id = parseInt(req.params.id)

    pool.query('delete from task where id = $1',
    [id],
    (error: Error,result: QueryResult) => {
        if (error) {
            res.status(500).json({error: error.message})
        }

        res.status(200).json({id: id})
    })
})

app.listen(port)