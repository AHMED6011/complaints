<template>
  <main class="main-bg">
    <div class="d-flex justify-content-center align-items-center my-5">
      <form class="form_main">
        <p class="heading">Üye ol</p>
        <div class="row">
          <div class="col-6">
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
              <input
                placeholder="Kullanıcı adı"
                id="username"
                v-model="name"
                class="inputField"
                type="text"
                required
              />
            </div>
          </div>
          <div class="col-6">
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
                  d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"
                ></path>
              </svg>
              <input
                placeholder="e-posta"
                v-model="email"
                class="inputField"
                type="email"
                required
              />
            </div>
          </div>
          <div class="col-6">
            <div class="inputContainer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                fill="#2e2e2e"
                height="16"
                width="16"
                class="inputIcon"
              >
                <path
                  d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                />
              </svg>
              <input
                placeholder="Kimlik numarası"
                v-model="tc"
                class="inputField"
                type="text"
                required
              />
            </div>
          </div>
          <div class="col-6">
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
              <input
                placeholder="Şifre"
                v-model="password"
                id="password"
                class="inputField"
                type="password"
                required
              />
            </div>
          </div>
          <div class="col-6">
            <div class="inputContainer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height="16"
                width="16"
                class="inputIcon"
              >
                <path
                  d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                />
              </svg>
              <input
                placeholder="Telefon numarası"
                v-model="phoneNumber"
                id="phoneNumber"
                class="inputField"
                type="text"
                required
              />
            </div>
          </div>

          <button id="button" @click.prevent="createUser">Üye ol</button>
          <div class="signupContainer">
            <p>bir hesabım var</p>
            <RouterLink to="/">Giriş yap</RouterLink>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "vue3-cookies";

export default {
  data() {
    return {
      name: "",
      phoneNumber: "",
      password: "",
      tc: "",
      email: "",
      isStaff: "",
      cookies: useCookies().cookies,
    };
  },
  methods: {
    async createUser() {
      try {
        const register = {
          name: this.name.trim(),
          phoneNumber: this.phoneNumber.trim(),
          password: this.password.trim(),
          tc: this.tc.trim(),
          email: this.email.trim(),
        };
        const response = await axios.post(
          `${this.API}/api/Users/SignUp`,
          register,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          this.cookies.set("myCookie", response.data.token);
          this.cookies.set("isStaff", response.data.isStaff);
          Swal.fire({
            icon: "success",
            title: "Başarılı bir şekilde kaydoldunuz",
            showConfirmButton: false,
            timer: 1100,
          });
          setTimeout(() => {
            location.replace("/complaints");
          }, 1300);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Başka bir kullanıcı adı seçmelisiniz",
          });
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Bir şeyler yanlış gitti",
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.form_main {
  width: 500px;
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

input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
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
