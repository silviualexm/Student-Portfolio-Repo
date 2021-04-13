import express from 'express'
import cors from 'cors'
import studentsRoutes from './students/index.js'
import listEndpoints from 'express-list-endpoints'

const server = express()
const port = 3001

server.use(cors())
server.use(express.json())
server.use("/students", studentsRoutes)

console.log(listEndpoints(server))
server.listen(port, () => {
    console.log("Server is running on port", port)
})