//* HERE IS THE MONGOOSE SETUP PERTAINING THE PATIENT TABLE AND IT'S COMPONENTS
// SEPARATE FOR BETTER READABILITY

import { Schema, model } from 'mongoose';

const PatientSchema = new Schema({
    id: { type: Number, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    created: { type: String, required: true },
    in_session: { type: Boolean, required: true },
    message: { type: String, required: false },
    room: { type: String, required: false }
});

export const PatientModel = model('Patient', PatientSchema);

//! ATTENTION:
//? must be same as frontend's 'Patient' interface!
export interface PatientInterface {
    id: number;
    firstname: string;
    lastname: string;
    created: string;
    in_session: boolean;
    message: string;
    room: string;
};
