import axios from "axios";

export const endpoint = {
  specialties: "/specialties/",
  doctors: "/doctors/",
  popular_dotor: "/doctors/popular/",
  services: "/services/",
  login: "/o/token/",
  register: "/users/",
  currentUser: "/users/current-user/",
  patient_profile: "/users/current-user/patient-profile/",
  appointment: "/appointments/",
  update_appointment: (appointmentId) => `/appointments/${appointmentId}/`,
  streamToken: "/stream/token/",
  chat_room: (appointmentId) => `/appointments/${appointmentId}/chat-rooms/`,
  medicines: "/medicines/",
  medicine_categories: "/medicine-categories/",
  add_medicine: (prescriptionId) => `/prescriptions/${prescriptionId}/details/`,
  delete_medicine: (prescriptionId) =>
    `/prescription-details/${prescriptionId}/`,
  prescription: (appointmentId) =>
    `/appointments/${appointmentId}/prescriptions/`,
  service: (appointmentId) => `/appointments/${appointmentId}/services/`,
  disease: "/diseases/",
  checkout: (appointmentId) => `/appointments/${appointmentId}/checkout/`,
  appointmentDetails: (appointmentId) => `/appointments/${appointmentId}/`,
  zalopay: (paymentId) => `/payments/${paymentId}/zalopay/`,
  registerDevice: "/users/register-device/",
  medicines_in_prescription: (prescriptionId) =>
    `/prescriptions/${prescriptionId}/`,
};

export const STREAM_API = process.env.EXPO_PUBLIC_STREAM_API_KEY;

export const authApis = (token) => {
  //https://medconnect-aca.icydesert-d50d1a9e.southeastasia.azurecontainerapps.io/
  return axios.create({
    baseURL: "http://192.168.100.26:8000/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: "http://192.168.100.26:8000/",
});
