import { Patient } from './models/patient.model';

const patient: Patient = {
  id: 1,
  firstname: 'paul',
  lastname: 'smith',
  email: 'p.smith@email.com',
  // password: '1234',
  phone: '00000000000',
  // img?: string,
  created: 'Mon Dec 07 2020 12:38:08 GMT+0100 (Central European Standard Time)',
  last_visit: 'Tue Dec 08 2020 20:38:08 GMT+0100 (Central European Standard Time)',
  in_session: false,
};

export default {
  patient,
};
