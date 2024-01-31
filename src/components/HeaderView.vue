<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-dark">
      <div class="container-fluid">
        <RouterLink class="navbar-brand pe-5" to="/complaints">
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
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 text-light">
            <li v-if="this.isAllow" class="nav-item">
              <RouterLink class="nav-link" to="/complaints"
                >All Complaints</RouterLink
              >
            </li>
            <li v-if="this.isAllow" class="nav-item">
              <RouterLink class="nav-link" to="/AddComplaint"
                >Add Complaints</RouterLink
              >
            </li>
            <li v-if="!this.isAllow" class="nav-item">
              <RouterLink class="nav-link" to="/">Login</RouterLink>
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
          <form class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              v-model="searchInput"
            />
            <button
              class="btn btn-outline-primary"
              type="button"
              @click="searchComplaint"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
import { useComplaintsStore } from "@/stores/index";
import { mapActions, mapState } from "pinia";

export default {
  name: "HeaderView",

  data() {
    return {
      cookies: useCookies().cookies,
    };
  },
  methods: {
    deleteAccount() {
      this.cookies.set("myCookie", "", { expires: new Date(0) });
      this.cookies.set("isStaff", "");
      location.replace("/");
    },
    ...mapActions(useComplaintsStore, ["searchComplaint"]),
  },
  computed: {
    ...mapState(useComplaintsStore, ["searchInput"]),
  },
  created() {
    setTimeout(() => {
      console.log(this.searchInput.valueOf);
    }, 6000);
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
