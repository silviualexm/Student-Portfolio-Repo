import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'


const router = express.Router()

const filename = fileURLToPath(import.meta.url)

const studentsJSONPath = join(dirname(filename), 'students.json')

router.post('/', (req, res) => {
    const fileAsBuffer = fs.readFileSync(studentsJSONPath)
    const fileAsString = fileAsBuffer.toString()
    const students = JSON.parse(fileAsString)

    const newStudent = req.body
    newStudent.ID = uniqid()

    students.push(newStudent)

    fs.writeFileSync(studentsJSONPath, JSON.stringify(students))

    res.status(201).send('created')
})

router.post('/checkEmail', (req, res) => {
    const fileAsBuffer = fs.readFileSync(studentsJSONPath)
    const fileAsString = fileAsBuffer.toString()
    const students = JSON.parse(fileAsString)

    const email = req.body.email
    const findEmail = students.find(student => student.email === email)
    if (findEmail) {
        res.status(200).send(true)
    } else {
        res.status(200).send(false)
    }
})

router.get('/', (req, res) => {
    console.log('GET route')
    const fileAsBuffer = fs.readFileSync(studentsJSONPath)
    const fileAsString = fileAsBuffer.toString()
    const students = JSON.parse(fileAsString)


    res.status(200).send(students)
})

router.get('/:id', (req, res) => {
    console.log("uniq identifier", req.params.id)

    const fileAsBuffer = fs.readFileSync(studentsJSONPath)
    const fileAsString = fileAsBuffer.toString()
    const students = JSON.parse(fileAsString)
    const student = students.find(s => s.ID === parseInt(req.params.id))
    res.status(200).send(student)
})

router.delete('/:id', (req, res) => {
    const fileAsBuffer = fs.readFileSync(studentsJSONPath)
    const fileAsString = fileAsBuffer.toString()
    const students = JSON.parse(fileAsString)

    const newStudentsArray = students.filter(student => student.ID !== req.params.id)

    fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

    res.status(204).send()
})


router.put('/:id', (req, res) => {
    const fileAsBuffer = fs.readFileSync(studentsJSONPath)
    const fileAsString = fileAsBuffer.toString()
    const students = JSON.parse(fileAsString)

    const newStudentsArray = students.filter(student => student.ID !== req.params.id)
    const modifiedUser = req.body
    modifiedUser.ID = req.params.id
    newStudentsArray.push(modifiedUser)

    fs.writeFileSync(studentsJSONPath, JSON.stringify(newStudentsArray))

    res.status(200).send(modifiedUser)
})


export default router