import express from 'express'
import cors from 'cors'
import studentsRoutes from './students/index.js'
import projectsRoutes from './projects/index.js'
import listEndpoints from 'express-list-endpoints'
import { notFoundErrorHandler } from './errorHandlers.js'

const server = express()
const port = process.env.PORT || 3002

server.use(cors())
server.use(express.json())

server.use("/students", studentsRoutes)
server.use("/projects", projectsRoutes)

console.log(listEndpoints(server))

server.use(notFoundErrorHandler)

server.listen(port, () => {
    console.log("Server is running on port", port)
})