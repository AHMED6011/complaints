<template>
  <main>
    <div class="container-fluid">
      <div class="row text-center">
        <div class="col-12 main-bg">
          <h1>Şehrimizi Güzelleştir</h1>
        </div>
        <div class="col-12 my-md-5 add-box">
          <div
            class="container position-relative d-flex justify-content-center"
          >
            <form
              class="row g-3 needs-validation"
              novalidate
              @submit.prevent="submitForm"
            >
              <div class="col-12 col-md-8">
                <textarea
                  cols="30"
                  rows="10"
                  type="text"
                  placeholder=" Adres"
                  class="form-control adres-input"
                  id="validationCustom1"
                  v-model="address"
                  required
                ></textarea>

                <input
                  type="text"
                  placeholder="Başlık"
                  class="form-control my-3"
                  id="validationCustom2"
                  autocomplete="off"
                  v-model="title"
                  required
                />

                <select
                  id="validationCustom0"
                  class="form-select mb-3"
                  aria-label="Default select example"
                  title="Kategori seç"
                  v-model="category"
                >
                  <option value="" disabled selected>Kategori seç</option>
                  <option value="Yol ve çevre düzeni">
                    Yol ve çevre düzeni
                  </option>
                  <option value="Kaski">Kaski</option>
                  <option value="Armadaş">Armadaş</option>
                  <option value="Akedaş">Akedaş</option>
                  <option value="Sokak hayvanı">Sokak hayvanı</option>
                  <option value="Çöp birikmesi">Çöp birikmesi</option>
                  <option value="Ulaşım ihbarı">Ulaşım ihbarı</option>
                  <option value="Zabıta">Zabıta</option>
                  <option value="Diğer">Diğer</option>
                </select>

                <label class="custum-file-upload" for="file">
                  <div class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill=""
                      viewBox="0 0 24 24"
                    >
                      <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                      <g
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        id="SVGRepo_tracerCarrier"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          fill=""
                          d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div class="text">
                    <span>Fotoğraf yükle</span>
                  </div>
                  <input
                    type="file"
                    id="file"
                    @change="selectedImg"
                    accept="image/*"
                    required
                  />
                  <p>
                    Seçilen Dosya: <strong>{{ imageName }}</strong>
                  </p>
                </label>
              </div>
              <div class="col-12 col-md-8">
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Şikayetiniz"
                  id="validationCustom3"
                  v-model="desc"
                  autocomplete="new-password"
                  required
                ></textarea>
              </div>
              <div class="col-12 col-md-8">
                <button class="btn btn-primary" @click.prevent="addComplaint">
                  Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      category: "",
      desc: "",
      address: "",
      title: "",
      imageFile: null,
      imageName: "",
    };
  },
  methods: {
    selectedImg(event) {
      this.imageFile = event.target.files[0];
      this.imageName = event.target.files[0].name;
    },
    async addComplaint() {
      try {
        if (
          !this.category ||
          !this.desc ||
          !this.title ||
          !this.address ||
          !this.imageFile
        ) {
          sweetAlert("Oops...", "Sanırım alanı doldurmayı unuttun", "error");
        } else {
          const formData = new FormData();
          formData.append("files", this.imageFile, this.imageFile.name);

          const responseImg = await axios.post(
            `${this.API}/api/Files`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${this.isAllow}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const sendData = {
            userId: "",
            category: this.category,
            description: this.desc,
            address: this.address,
            title: this.title,
            image: responseImg.data,
          };

          const response = await axios.post(
            `${this.API}/api/Complaints`,
            sendData,
            {
              headers: {
                Authorization: `Bearer ${this.isAllow}`,
                "Content-Type": "application/json",
              },
            }
          );

          swal(
            {
              title: "",
              text: "Şehrimizi daha iyi bir yer haline getirmemize katkı sağladığınız için teşekkür ederiz. En kısa sürede size yanıt vereceğiz",
              type: "success",
              confirmButtonColor: "#a5dc86",
              confirmButtonText: "TAMAM",
              closeOnConfirm: false,
            },
            function (isConfirm) {
              if (isConfirm) {
                location.replace("/complaints");
              }
            }
          );

          this.category = "";
          this.desc = "";
          this.address = "";
          this.title = "";
          this.imageFile = "";
          this.imageName = "";
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message.data}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-bg {
  background-image: url(../assets/images/1.jpg);
  background-size: cover;
  position: relative;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  h1 {
    z-index: 3;
    color: #f8f8f8;
    text-shadow: 4px 4px 6px black;
    font-size: 45px;
    margin-bottom: 150px;
    padding-bottom: 50px;
  }

  i {
    z-index: 3;
    color: #f8f8f8;
    text-shadow: 0px 4px 6px black;
    font-size: 45px;
  }

  &::before {
    content: "";
    background-color: #5a5a5a5c;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
}

form {
  width: 90%;
  justify-content: center;
  background-color: white;
  align-items: center;
  box-shadow: 0px 0px 45px 2px #898989;
  border-radius: 10px;
  padding: 30px 0;
  position: absolute;
  top: -230px;
  .form-label {
    font-size: bold;
  }

  textarea {
    height: 100px;
  }
  .adres-input {
    resize: none;
    height: 75px;
  }

  .custum-file-upload {
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border: 2px dashed #cacaca;
    background-color: rgba(255, 255, 255, 1);
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0px 48px 35px -48px rgba(0, 0, 0, 0.1);
  }

  .custum-file-upload .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .icon svg {
    height: 40px;
    fill: rgba(75, 85, 99, 1);
  }

  .custum-file-upload .text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .text span {
    font-weight: 400;
    color: rgba(75, 85, 99, 1);
  }

  .custum-file-upload input {
    display: none;
  }
}

@media (max-width: 767px) {
  .main-bg {
    h1 {
      font-size: 30px;
    }
  }
}
</style>
