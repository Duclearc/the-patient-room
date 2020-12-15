import { Patient, PatientInterface } from './patient';
export function addPatient(patientData: PatientInterface) {
    return new Patient(patientData).save();
}
export function getPatients() {
    return Patient.find();
}
export function removePatient(patientID: PatientInterface['id']) {
    return Patient.deleteOne({ id: patientID });
}
export function editPatient(editedPatient: PatientInterface) {
    const updatedPatient = new Patient(editedPatient)
    return Patient.updateOne({ id: editedPatient.id }, updatedPatient);
}
export function messageAllPatients(msg: PatientInterface['messsage']) {
    return Patient.updateMany({}, { $set: { message: msg } });
}