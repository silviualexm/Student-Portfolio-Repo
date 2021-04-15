import { check, validationResult, body } from "express-validator";

const schema = {
    name: "2",
    description: "sahifaishfgasiofhaso",
    repoUrl: "fjsjfiasjfsifja.it",
    liveUrl: "safjsalfjasilfja.it",
    studentID: "fe31d70f-e7ef-40a2-be88-116c4434c029",
    id: "f5de9f65-fa3a-4729-bc92-929f1045dcff",
    creationDate: "2021-04-14T16:39:16.435Z",
};

const checkProjectParams = (req, res, next) => {

    const keys = Object.keys(req.body);
    const schemaKeys = Object.keys(schema)
    const exist = keys.filter(
        (key) => typeof req.body[key] === typeof schema[key] && schema.hasOwnProperty(key)
    );
    if (exist.length !== schemaKeys.length) {
        console.log(exist);
        res.status(400).send("Problem");
    } else {
        next();
    }
};

export default checkProjectParams;
