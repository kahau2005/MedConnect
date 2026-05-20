import axios from "axios";

export const endpoint = {
  specialties: "/specialties/",
  doctors: "/doctors/",
  popular_dotor: "/doctors/popular/",
  services: "/services/",
  test: "/tests/payment/?amount=1000",
  login: "/o/token/",
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
  zalopay: (paymentId) => `/payments/${paymentId}/zalopay/`,
};

export const authApis = (token) => {
  return axios.create({
    baseURL: "http://192.168.1.239:8000/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: "http://192.168.1.239:8000/",
});
