import { Schema, model } from 'mongoose';

const PatientSchema = new Schema({
    id: { type: Number, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: false },//❌
    password: { type: String, required: false },//❌
    phone: { type: String, required: false },//❌
    created: { type: String, required: true },
    last_visit: { type: Date, required: false },//❌
    in_session: { type: Boolean, required: true },
    messsage: { type: String, required: false }
})
const Patient = model('Patient', PatientSchema);

interface PatientInterface {
    id: number;
    firstname: string;
    lastname: string;
    email?: string;
    password?: string;
    phone?: string;
    img?: string;
    created: string;
    last_visit?: string;
    in_session: boolean;
    messsage: string;
}

export type PatientData = Omit<PatientInterface, 'id' | 'created'>;

export { Patient, PatientInterface };