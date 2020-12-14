import { Patient, PatientInterface } from './patient';
export function addPatient(patientData: any) {
    return new Patient(patientData).save();
}
export function getPatients() {
    return Patient.find();
}
export function removePatients(patientID: number) {
    return Patient.deleteOne({ id: patientID });
}
export function editPatient(editedPatient: PatientInterface) {
    const updatedPatient = new Patient(editedPatient)
    return Patient.updateOne({ id: editedPatient.id }, updatedPatient);
}