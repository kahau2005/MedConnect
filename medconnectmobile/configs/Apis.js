import axios from "axios";

export const endpoint = {
  specialties: "/specialties/",
  doctors: "/doctors/",
  services: "/services/",
};
export default axios.create({
  baseURL: "http://192.168.10.110:8000/",
});
