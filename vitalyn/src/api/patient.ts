import api from "./api";

export const createPatient = async (patientData: {
  patient_name: string;
  age: number;
  ward_room: string;
}) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};
