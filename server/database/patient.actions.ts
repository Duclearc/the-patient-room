//* HERE ARE ALL POSSIBLE ACTION WITH THE PATIENTS noSQL TABLE ITEMS
// SEPARATE FOR BETTER READABILITY - ALPHABETICALLY SORTED

import { PatientModel, PatientInterface } from './patient';

//? adds patient to db
export function addPatient(patientData: PatientInterface) {
    return new PatientModel(patientData).save();
}
//? updates a single patient from db
export function editPatient(editedPatient: PatientInterface) {
    const updatedPatient = new PatientModel(editedPatient)
    return PatientModel.updateOne({ id: editedPatient.id }, updatedPatient);
}
//? returns all patients stored in db
export function getPatients() {
    return PatientModel.find();
}
//? updates the 'message' attribute of all patients in db
export function messageAllPatients(msg: PatientInterface['message']) {
    return PatientModel.updateMany({}, { $set: { message: msg } });
}
//? removes single patient from db
export function removePatient(patientID: PatientInterface['id']) {
    return PatientModel.deleteOne({ id: patientID });
}
