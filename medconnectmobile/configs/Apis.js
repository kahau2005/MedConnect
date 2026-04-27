import axios from "axios";

export const endpoint = {
  specialties: "/specialties/",
  doctors: "/doctors/",
  services: "/services/",
  test: "/api/test-qr/",
};
export default axios.create({
  baseURL: "http://192.168.100.26:8000/",
});
