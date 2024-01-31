import { createRouter, createWebHistory } from "vue-router";
import { isAllowed } from "../main";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/AddComplaint",
      name: "AddComplaint",
      beforeEnter: (to, from, next) => {
        if (isAllowed) {
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
      component: () => import("../views/ComplaintDetails.vue"),
      props: true,
    },
    {
      path: "/",
      name: "Login",
      component: () => import("../views/LogIn.vue"),
    },
    {
      path: "/createUser",
      name: "createUser",
      component: () => import("../views/CreateUser.vue"),
    },
    {
      path: "/complaints",
      name: "complaints",
      component: () => import("../views/MyComplaints.vue"),
    },

    {
      path: "/admin",
      name: "admin",
      beforeEnter: (to, from, next) => {
        if (isAllowed) {
          next();
        } else {
          next("/");
        }
      },
      component: () => import("../views/AdminComplaints.vue"),
    },
  ],
});

export default router;
