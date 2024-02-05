import { createRouter, createWebHistory } from "vue-router";
import { isAllowed } from "../main";
import { useCookies } from "vue3-cookies";

const isStaff = useCookies().cookies.get("isStaff");
const mangeAdmins = useCookies().cookies.get("manageAdmins");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/AddComplaint",
      name: "AddComplaint",
      beforeEnter: (to, from, next) => {
        if (isStaff == "false") {
          next();
        } else {
          next("/");
          9;
        }
      },
      component: () => import("../views/AddComplaint.vue"),
    },
    {
      path: "/ComplaintDetails/:id",
      name: "ComplaintDetails",
      beforeEnter: (to, from, next) => {
        if (!isAllowed) {
          next("/");
        } else {
          next();
        }
      },
      component: () => import("../views/ComplaintDetails.vue"),
      props: true,
    },
    {
      path: "/",
      name: "Login",
      beforeEnter: (to, from, next) => {
        if (isStaff === "true") {
          next("/admin");
        } else if (isAllowed) {
          next("/complaints");
        } else {
          next();
        }
      },
      component: () => import("../views/LogIn.vue"),
    },
    {
      path: "/createUser",
      name: "createUser",
      beforeEnter: (to, from, next) => {
        if (isStaff === "true") {
          next("/admin");
        } else if (isAllowed) {
          next("/complaints");
        } else {
          next();
        }
      },
      component: () => import("../views/CreateUser.vue"),
    },
    {
      path: "/complaints",
      name: "complaints",
      beforeEnter: (to, from, next) => {
        if (isAllowed) {
          next();
        } else {
          next("/");
        }
      },
      component: () => import("../views/MyComplaints.vue"),
    },

    {
      path: "/admin",
      name: "admin",
      beforeEnter: (to, from, next) => {
        if (isAllowed && isStaff == "true") {
          next();
        } else {
          next("/");
        }
      },
      component: () => import("../views/AdminComplaints.vue"),
    },
    {
      path: "/manageAdmins",
      name: "manageAdmins",
      beforeEnter: (to, from, next) => {
        if (mangeAdmins === "true") {
          next();
        } else if (mangeAdmins == "true" || isStaff == "true") {
          next("/admin");
        } else {
          next("/complaints");
        }
      },
      component: () => import("../views/ManageAdmins.vue"),
      props: true,
    },
  ],
});

export default router;
