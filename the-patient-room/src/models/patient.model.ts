export interface Patient {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  password?: string;
  phone?: string;
  img?: string;
  created?: string;
  last_visit: string;
  in_session: boolean;
  messsage?: string;
}

export type PatientData = Omit<Patient, 'id' | 'created'>;
