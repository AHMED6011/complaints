import { defineStore } from "pinia";

export const useComplaintsStore = defineStore("complaints", {
  state: () => ({
    complaints: null,
    searchInput: "",
    API: "https://complaintapi.kodunya.com",
  }),

  actions: {},
});
