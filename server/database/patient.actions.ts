import Patient from './patient.model';
export function addPatient(patientData: any) {
    return new Patient(patientData).save();
}
export function getPatients() {
    return Patient.find();
}