import axios from "axios";

export const endpoint = {
  specialties: "/specialties/",
  doctors: "/doctors/",
  popular_dotor: "/doctors/popular/",
  services: "/services/",
  test: "/tests/payment/?amount=1000",
  login: "/o/token/",
  register: "/users/",
  current_user: "/users/current-user/",
  patient_profile: "/users/current-user/patient-profile/",
  appointment: "/appointments/",
  update_appointment: (appointmentId) => `/appointments/${appointmentId}/`,
  streamToken: "/stream/token/",
  chat_room: (appointmentId) => `/appointments/${appointmentId}/chat-rooms/`,
  medicines: "/medicines/",
  medicine_categories: "/medicine-categories/",
  add_medicine: (prescriptionId) => `/prescriptions/${prescriptionId}/details/`,
  update_medicine: (prescriptionId) =>
    `/prescription-details/${prescriptionId}/`,
  prescription: (appointmentId) =>
    `/appointments/${appointmentId}/prescriptions/`,
  service: (appointmentId) => `/appointments/${appointmentId}/services/`,
  disease: "/diseases/",
  checkout: (appointmentId) => `/appointments/${appointmentId}/checkout/`,
  appointmentDetails: (appointmentId) => `/appointments/${appointmentId}/`,
  zalopay: (paymentId) => `/payments/${paymentId}/zalopay/`,
  registerDevice: "/users/register-device/",
};

export const STREAM_API = process.env.EXPO_PUBLIC_STREAM_API_KEY;

export const authApis = (token) => {
  //https://medconnect-aca.icydesert-d50d1a9e.southeastasia.azurecontainerapps.io/
  return axios.create({
    baseURL:
      "https://medconnect-aca.icydesert-d50d1a9e.southeastasia.azurecontainerapps.io/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL:
    "https://medconnect-aca.icydesert-d50d1a9e.southeastasia.azurecontainerapps.io/",
});
