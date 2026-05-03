import axios from "axios";

export const endpoint = {
  specialties: "/specialties/",
  doctors: "/doctors/",
  services: "/services/",
  test: "/tests/payment/?amount=1000",
};
export default axios.create({
  baseURL: "http://192.168.1.6:8000/",
});
