<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-dark">
      <div class="container">
        <RouterLink
          class="navbar-brand pe-5"
          :to="isStaff ? '/admin' : '/complaints'"
        >
          <i class="fa-solid fa-phone fa-2xl text-primary"></i>
        </RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav mb-2 mb-lg-0 text-light">
            <li v-if="this.isAllow" class="nav-item">
              <RouterLink
                class="nav-link"
                :to="isStaff ? '/admin' : '/complaints'"
                >Tüm Şikayetler
              </RouterLink>
            </li>
            <li v-if="!isStaff == true && this.isAllow" class="nav-item">
              <RouterLink class="nav-link" to="/AddComplaint"
                >Şikayet Ekle</RouterLink
              >
            </li>
            <li v-if="!this.isAllow" class="nav-item">
              <RouterLink class="nav-link" to="/">Giriş yapmak</RouterLink>
            </li>
            <li v-if="!this.isAllow" class="nav-item">
              <RouterLink class="nav-link" to="/createUser"
                >Üye olmak</RouterLink
              >
            </li>
            <li v-if="this.isAllow" class="nav-item">
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
    };
  },
  methods: {
    deleteAccount() {
      swal(
        {
          title: "Emin misin?",
          text: "Hesap silinecek",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "evet",
          cancelButtonText: "iptal",
          closeOnConfirm: false,
          closeOnCancel: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            useCookies().cookies.set("myCookie", "", { expires: new Date(0) });
            useCookies().cookies.set("isStaff", "");
            location.replace("/");
          } else {
            swal("İptal edildi", "", "error");
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
  },
  created() {
    this.isAdmin();
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  padding: 15px 15px;
  .navbar-nav {
    & .nav-item {
      a {
        color: white;
        transition: 0.1s;
        &.router-link-exact-active {
          color: #0d6efd;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
