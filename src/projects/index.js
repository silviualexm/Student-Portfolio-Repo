import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";
import { check, validationResult, body } from "express-validator";
import checkProjectParams from "../middlewares/checkParams.js";

const router = express.Router()

const currentPath = fileURLToPath(import.meta.url)
const projectsDirname = dirname(currentPath)
const projectsJSONpath = join(projectsDirname, 'projects.json')

const srcPath = dirname(projectsDirname);
const projectsPath = join(srcPath, "students");
const studentsJSONpath = join(projectsPath, "students.json");

const getStudents = () => JSON.parse(fs.readFileSync(studentsJSONpath.toString()))

const getProjects = () => JSON.parse(fs.readFileSync(projectsJSONpath.toString()))

const writeProjects = (projectsArr) => fs.writeFileSync(projectsJSONpath, JSON.stringify(projectsArr))

const writeStudents = (studentsArr) => fs.writeFileSync(studentsJSONpath, JSON.stringify(studentsArr))

router.get('/', (req, res, next) => {
    const projects = getProjects()

    res.status(200).send(projects)
})

router.get('/:id', (req, res, next) => {
    const projects = getProjects()
    try {
        const project = projects.find(proj => proj.id === req.params.id)
        if (project) {
            res.status(200).send(project)
        } else {
            const err = new Error()
            err.httpStatusCode = 404
            next(err)
        }
    } catch (error) {
        console.log(error)
        next(error)

    }
})

router.post(
    '/',
    body('name').exists().isString(),
    body('description').exists().isString(),
    body('liveUrl').exists().isString(),
    body('repoUrl').exists().isString(),
    body('studentID').exists().isString(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            try {
                const projects = getProjects()
                const students = getStudents()
                const { studentID } = req.body
                const student = students.find(s => s.id === studentID)
                if (student) {
                    let numberOfProjects = projects.filter(p => p.studentID === studentID).length
                    const newProject = {
                        ...req.body,
                        id: uniqid(),
                        creationDate: new Date()
                    }
                    projects.push(newProject)
                    writeProjects(projects)
                    numberOfProjects++
                    let newStudentsArray = students.filter(s => s.id !== studentID)
                    student.numbersOfProjects = numberOfProjects
                    newStudentsArray.push(student)
                    writeStudents(newStudentsArray)

                    res.status(201).send({ id: newProject.id })
                } else {
                    res.status(404).send({ message: 'Student is not found in db' })
                }
            } catch (error) {
                r4es.status(500).send({ message: error.message })
            }
        } else {
            res.status(400).send({ message: 'Body parameters are not sufficient', errors })
        }
    }
)

router.post('/v2', checkProjectParams, (req, res, next) => {
    try {
        const projects = getProjects()
        const students = getStudents()
        const { studentID } = req.body
        const student = students.find(s => s.id === studentID)
        if (student) {
            // find numberOfProjects of sudent
            let numberOfProjects = projects.filter(p => p.studentID === studentID).length
            // create new student object with uniq id
            const newProject = {
                ...req.body,
                id: uniqid(),
                creationDate: new Date()

            }
            // add new project to projects array
            projects.push(newProject)
            // save changes in project array to disk
            writeProjects(projects)
            // increase number of the projects
            numberOfProjects++
            // remove student from db
            let newStudentsArray = students.filter(s => s.id !== studentID)
            // overwrite numbersOfProjects field on student
            student.numberOfProjects = numberOfProjects
            // add student to db back
            newStudentsArray.push(student)
            // write changes to disk
            writeStudents(newStudentsArray)

            res.status(201).send({ id: newProject.id })
        } else {
            // student is not found
            res.status(404).send({ message: 'Student is not found in db' })
        }

    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

export default router;
