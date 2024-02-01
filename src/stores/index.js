import { defineStore } from "pinia";
import axios from "axios";
import { isAllowed } from "@/main";

export const useComplaintsStore = defineStore("complaints", {
  state: () => ({
    complaints: null,
    searchInput: "",
    API: "https://complaintapi.kodunya.com",
  }),

  actions: {
    async fetchData() {
      try {
        const response = await axios.get(`${this.API}/api/Complaints`, {
          headers: {
            Authorization: `Bearer ${isAllowed}`,
            "Content-Type": "application/json",
          },
        });
        this.complaints = response.data;
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    },
  },
});
