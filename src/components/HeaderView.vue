<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-dark">
      <div class="container">
        <RouterLink class="navbar-brand pe-5" to="/complaints">
          <i class="fa-solid fa-phone fa-2xl"></i>
        </RouterLink>
        <button
          class="navbar-toggler text-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="fa-solid fa-bars fa-xl py-3"></i>
        </button>
        <div
          class="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav mb-2 mb-lg-0 text-light">
            <li v-if="this.isAllow" class="nav-item">
              <RouterLink class="nav-link text-center" to="/complaints"
                >Tüm Şikayetler
              </RouterLink>
            </li>
            <li v-if="!isStaff == true && this.isAllow" class="nav-item">
              <RouterLink class="nav-link text-center" to="/AddComplaint"
                >Şikayet Ekle</RouterLink
              >
            </li>
            <li class="nav-item" v-if="isManageAdmins">
              <RouterLink class="nav-link text-center" to="/manageAdmins"
                >Tüm Yöneticiler</RouterLink
              >
            </li>
            <li v-if="this.isAllow" class="nav-item text-end">
              <button
                class="btn text-light fs-5 ms-3"
                @click.prevent="deleteAccount"
              >
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";

export default {
  name: "HeaderView",

  data() {
    return {
      cookies: useCookies().cookies,
      isStaff: false,
      isManageAdmins: false,
    };
  },
  methods: {
    deleteAccount() {
      swal(
        {
          title: "Emin misin?",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "evet",
          cancelButtonText: "iptal",
          closeOnConfirm: false,
          closeOnCancel: true,
        },
        function (isConfirm) {
          if (isConfirm) {
            useCookies().cookies.set("token", "");
            useCookies().cookies.set("isStaff", "");
            useCookies().cookies.set("manageAdmins", "");
            useCookies().cookies.set("canAccept", "");
            useCookies().cookies.set("canReject", "");
            useCookies().cookies.set("canClose", "");
            useCookies().cookies.set("canInProgress", "");
            useCookies().cookies.set("userID", "");
            location.replace("/");
          }
        }
      );
    },

    isAdmin() {
      if (this.cookies.get("isStaff") == "true") {
        this.isStaff = true;
      } else {
        this.isStaff = false;
      }
    },
    isSuperAdmin() {
      if (this.cookies.get("manageAdmins") == "true") {
        this.isManageAdmins = true;
      } else {
        this.isManageAdmins = false;
      }
    },
  },
  created() {
    this.isAdmin();
    this.isSuperAdmin();
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  padding: 15px 15px;

  .navbar-brand {
    color: #167f92;
  }
  .navbar-nav {
    & .nav-item {
      a {
        color: white;
        transition: 0.1s;
        &.router-link-exact-active {
          color: #167f92;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
