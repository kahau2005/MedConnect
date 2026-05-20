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
  appointment_status: (appointmentId) =>
    `/appointments/${appointmentId}/status/`,
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
  registerDevice: "/users/register-device/",
};

export const authApis = (token) => {
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
