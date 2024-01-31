<template>
  <main>
    <div class="container-fluid">
      <div class="row text-center">
        <div class="col-12 main-bg">
          <h1>We receive complaints around the clock</h1>
          <i class="fa-solid fa-chevron-down fa-bounce fa-2xl"></i>
        </div>
        <div class="col-12 my-5">
          <div class="container d-flex justify-content-center">
            <form
              class="row g-3 needs-validation"
              novalidate
              @submit.prevent="submitForm"
            >
              <div class="col-8">
                <input
                  type="text"
                  placeholder=" Country & City"
                  class="form-control"
                  id="validationCustom1"
                  autocomplete="off"
                  v-model="address"
                  required
                />

                <input
                  type="text"
                  placeholder="Title"
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
                  title="Select A Category"
                  v-model="category"
                >
                  <option value="" disabled selected>Select A Category</option>
                  <option value="Water">Water</option>
                  <option value="Internet">Internet</option>
                  <option value="Gas">Gas</option>
                  <option value="Electricity">Electricity</option>
                </select>
                <div class="invalid-feedback">
                  Please enter a valid category.
                </div>

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
                    <span>upload image</span>
                  </div>
                  <input type="file" id="file" @change="selectedImg" required />
                  <p>Selected File: {{ imageFile }}</p>
                </label>
                <div class="invalid-feedback">
                  Please enter a valid Address.
                </div>
              </div>
              <div class="col-8">
                <textarea
                  type="text"
                  class="form-control"
                  placeholder="Your Complaint"
                  id="validationCustom3"
                  v-model="desc"
                  autocomplete="off"
                  required
                ></textarea>
                <div class="invalid-feedback">
                  Please enter a valid Complaint.
                </div>
              </div>
              <div class="col-8">
                <button class="btn btn-primary" @click.prevent="addComplaint">
                  Send Complaint
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
    };
  },
  methods: {
    selectedImg(event) {
      this.imageFile = event.target.files[0];
    },
    async addComplaint() {
      if (
        !this.category ||
        !this.desc ||
        !this.title ||
        !this.address ||
        !this.imageFile
      ) {
        alert("Please fill in all the required fields");
        return;
      }

      const formData = new FormData();
      formData.append("files", this.imageFile, this.imageFile.name);
      console.log(this.imageFile.name);

      const responseImg = await axios.post(`${this.API}/api/Files`, formData, {
        headers: {
          Authorization: `Bearer ${this.isAllow}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(responseImg);

      const sendData = {
        userId: "",
        category: this.category,
        description: this.desc,
        address: this.address,
        title: this.title,
        image: responseImg.data,
      };

      try {
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

        console.log("Complaint added successfully:", response.data);

        this.category = "";
        this.desc = "";
        this.address = "";
        this.title = "";
        this.imageFile = null;
      } catch (error) {
        console.error(
          "An error occurred during the complaint addition:",
          error
        );
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

  .slide-top {
    -webkit-animation: slide-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
      infinite alternate forwards;
    animation: slide-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite
      alternate forwards;
  }
}

form {
  width: 90%;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 45px 2px #898989;
  border-radius: 10px;
  padding: 30px 0;
  .form-label {
    font-size: bold;
  }

  textarea {
    height: 200px;
  }

  .custum-file-upload {
    display: flex;
    flex-direction: column;
    align-items: space-between;
    gap: 20px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border: 2px dashed #cacaca;
    background-color: rgba(255, 255, 255, 1);
    padding: 1.5rem;
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 0px 48px 35px -48px rgba(0, 0, 0, 0.1);
  }

  .custum-file-upload .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .icon svg {
    height: 50px;
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
</style>
