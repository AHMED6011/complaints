<template>
  <main class="main-bg">
    <div class="d-flex justify-content-center align-items-center my-5">
      <form class="form_main">
        <p class="heading">Giriş yap</p>
        <div class="inputContainer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="#2e2e2e"
            height="16"
            width="16"
            class="inputIcon"
          >
            <path
              d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
            />
          </svg>
          <form autocomplete="off">
            <input
              placeholder="Kullanıcı adı"
              id="username"
              v-model="username"
              autocomplete="new-password"
              class="inputField"
              type="text"
              required
            />
          </form>
        </div>

        <div class="inputContainer">
          <svg
            viewBox="0 0 16 16"
            fill="#2e2e2e"
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            class="inputIcon"
          >
            <path
              d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
            ></path>
          </svg>
          <form autocomplete="off">
            <input
              placeholder="Şifre"
              v-model="password"
              autocomplete="new-password"
              id="password"
              class="inputField"
              type="password"
              required
            />
          </form>
        </div>

        <button id="button" @click.prevent="logIn">Giriş yap</button>
        <div class="signupContainer">
          <p>Hiç hesabınız yok mu?</p>
          <RouterLink to="/createUser">Üye ol</RouterLink>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      username: "",
      password: "",
      cookies: useCookies().cookies,
    };
  },
  methods: {
    async logIn() {
      try {
        const login = {
          userName: this.username.trim(),
          password: this.password.trim(),
        };
        const response = await axios.post(`${this.API}/api/Users/login`, login);
        this.cookies.set("myCookie", response.data.token);
        this.cookies.set("isStaff", response.data.isStaff);
        this.cookies.set("manageAdmins", response.data.manageAdmins);
        this.cookies.set("canAccept", response.data.canAccept);
        this.cookies.set("canReject", response.data.canReject);
        this.cookies.set("canClose", response.data.canClose);
        this.cookies.set("canInProgress", response.data.canInProgress);
        this.cookies.set("userID", response.data.userID);
        Swal.fire({
          icon: "success",
          title: "başarıyla oturum açtınız",
          showConfirmButton: false,
          timer: 1200,
        });
        if (response.data.isStaff == true) {
          setTimeout(() => {
            location.replace("/admin");
          }, 1200);
        } else {
          setTimeout(() => {
            location.replace("/complaints");
          }, 1200);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-bg {
  background-image: url(../assets/images/register.jpg);
  background-size: cover;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.form_main {
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 255, 255);
  padding: 30px 30px 30px 30px;
  border-radius: 30px;
  border: 2px solid #d1d1d1;
  transition: 0.5s;

  &:hover {
    box-shadow: 0px 0px 30px 30px #0505055b;
    border: 2px solid transparent;
    transform: scale(1.05);
  }
}

.heading {
  font-size: 25px;
  color: #2e2e2e;
  font-weight: 700;
  margin: 15px 0 30px 0;
}

.inputContainer {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inputIcon {
  position: absolute;
  left: 10px;
}

.inputField {
  width: 100%;
  height: 40px;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid rgb(173, 173, 173);
  border-radius: 30px;
  margin: 10px 0;
  color: black;
  font-weight: 500;
  box-sizing: border-box;
  padding-left: 30px;
}

.inputField:focus {
  outline: none;
  border-bottom: 2px solid rgb(199, 114, 255);
}

.inputField::placeholder {
  color: rgb(80, 80, 80);
  font-size: 1em;
  font-weight: 500;
}

#button {
  position: relative;
  width: 100%;
  border: 2px solid #0d6efd;
  background-color: #0d6efd;
  height: 40px;
  color: white;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 30px;
  margin: 10px;
  cursor: pointer;
  overflow: hidden;
}

#button::after {
  content: "";
  position: absolute;
  background-color: rgba(255, 255, 255, 0.253);
  height: 100%;
  width: 150px;
  top: 0;
  left: -200px;
  border-bottom-right-radius: 100px;
  border-top-left-radius: 100px;
  filter: blur(10px);
  transition-duration: 0.5s;
}

#button:hover::after {
  transform: translateX(600px);
  transition-duration: 0.5s;
}

.signupContainer {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.signupContainer p {
  font-weight: 500;
  color: black;
}

.signupContainer a {
  font-weight: 500;
  background-color: #2e2e2e;
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 20px;
}
</style>
