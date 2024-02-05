<template>
  <main>
    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-6">
          <h1 class="text-primary text-center fw-bold py-4">
            Yöneticileri Yönet
          </h1>
        </div>
        <div class="col-6 text-center">
          <CreateAdmins />
        </div>
      </div>
    </div>

    <div class="container spinner-container" v-if="admins.length == 0">
      <div class="row justify-content-center align-items-centers">
        <div class="col-12 text-center">
          <svg
            class="spinner"
            width="65px"
            height="65px"
            viewBox="0 0 66 66"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              class="path"
              fill="none"
              stroke-width="6"
              stroke-linecap="round"
              cx="33"
              cy="33"
              r="30"
            ></circle>
          </svg>
        </div>
      </div>
    </div>

    <table class="responstable" v-else>
      <tr>
        <th>Kullanıcı adı</th>
        <th>e-posta</th>
        <th>Kategori</th>
        <th>Telefon numarası</th>
        <th>Süreci kaydet</th>
      </tr>

      <tr v-for="admin in admins" :key="admin.id">
        <td>
          <p v-if="admin.name">{{ admin.name }}</p>
          <p v-else>Veri yok</p>
        </td>
        <td>
          <p v-if="admin.email">{{ admin.email }}</p>
          <p v-else>Veri yok</p>
        </td>
        <td>
          <p v-if="admin.category">{{ admin.category }}</p>
          <p v-else>Veri yok</p>
        </td>
        <td>
          <p v-if="admin.phoneNumber">{{ admin.phoneNumber }}</p>
          <p v-else>Veri yok</p>
        </td>

        <td>
          <div>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              @click="getAdminData(admin)"
            >
              edit
            </button>
            <div
              class="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabindex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog" style="max-width: 700px !important">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Veriler güncelleniyor
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <form>
                      <div class="row mb-3">
                        <input
                          type="text"
                          v-model="selectedAdmin.name"
                          placeholder="Kullanıcı adı"
                          autocomplete="off"
                          class="form-control"
                        />
                      </div>
                      <div class="row mb-3">
                        <input
                          type="email"
                          v-model="selectedAdmin.email"
                          autocomplete="off"
                          placeholder="e-posta"
                          class="form-control"
                        />
                      </div>
                      <div class="row mb-3">
                        <input
                          type="text"
                          autocomplete="off"
                          v-model="selectedAdmin.phoneNumber"
                          :placeholder="selectedAdmin.phoneNumber"
                          class="form-control"
                        />
                      </div>
                      <div class="row mb-3">
                        <select
                          id="validationCustom0"
                          class="form-select mb-3"
                          aria-label="Default select example"
                          v-model="category"
                          title="Kategori seç"
                        >
                          <option value="" disabled selected>
                            Kategori seç
                          </option>
                          <option value="Tüm">Tüm</option>
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
                      </div>
                      <div class="row mb-3 justify-content-center">
                        <h3 class="mb-4">İzin ver</h3>
                        <div class="col-2 mx-2 p-0">
                          <input
                            type="checkbox"
                            class="btn-check"
                            :id="`${selectedAdmin.id}1`"
                            autocomplete="off"
                            v-model="selectedAdmin.canReject"
                          />
                          <label
                            class="btn btn-outline-primary"
                            :for="`${selectedAdmin.id}1`"
                            >Reddedildi
                          </label>
                        </div>
                        <div class="col-2 mx-2 p-0">
                          <input
                            type="checkbox"
                            class="btn-check"
                            :id="`${selectedAdmin.id}2`"
                            autocomplete="off"
                            v-model="selectedAdmin.canAccept"
                          />
                          <label
                            class="btn btn-outline-primary"
                            :for="`${selectedAdmin.id}2`"
                            >Kabul edildi</label
                          >
                        </div>
                        <div class="col-2 mx-2 p-0">
                          <input
                            type="checkbox"
                            class="btn-check"
                            :id="`${selectedAdmin.id}3`"
                            autocomplete="off"
                            v-model="selectedAdmin.canInProgress"
                          />
                          <label
                            class="btn btn-outline-primary"
                            :for="`${selectedAdmin.id}3`"
                            >Devam ediyor</label
                          >
                        </div>
                        <div class="col-2 mx-2 p-0">
                          <input
                            type="checkbox"
                            class="btn-check"
                            :id="`${selectedAdmin.id}4`"
                            autocomplete="off"
                            v-model="selectedAdmin.canClose"
                          />
                          <label
                            class="btn btn-outline-primary"
                            :for="`${selectedAdmin.id}4`"
                            >Tamamlandı</label
                          >
                        </div>
                        <div class="col-2 mx-2 p-0">
                          <input
                            type="checkbox"
                            class="btn-check"
                            :id="`${selectedAdmin.id}5`"
                            autocomplete="off"
                            v-model="selectedAdmin.manageAdmins"
                          />
                          <label
                            class="btn btn-outline-primary"
                            :for="`${selectedAdmin.id}5`"
                            >Yönetici</label
                          >
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      İptal et
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="updateData()"
                    >
                      Veriyi güncelle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </main>
</template>

<script>
import axios from "axios";
import CreateAdmins from "@/components/CreateAdmins.vue";

export default {
  components: { CreateAdmins },
  data() {
    return {
      admins: [],
      selectedAdmin: {},
      category: "",
      name: "",
      email: "",
      phoneNumber: "",
      status: [
        { state: false, text: "Reddedildi" },
        { state: false, text: "Kabul edildi" },
        { state: false, text: "Devam ediyor" },
        { state: false, text: "Tamamlandı" },
        { state: false, text: "Yönetici Yöneticileri" },
      ],
      id: "",
    };
  },
  methods: {
    async getAdmins() {
      try {
        const response = await axios.get(`${this.API}/api/Users`, {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
            "Content-Type": "application/json",
          },
        });

        this.admins = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    getStatus(index) {
      if (index == 0) {
        this.canAccept = !this.canAccept;
        console.log(this.canAccept);
      } else if (index == 1) {
        this.canReject = !this.canReject;
        console.log(this.canReject);
      } else if (index == 2) {
        this.canClose = !this.canClose;
        console.log(this.canClose);
      } else if (index == 3) {
        this.canInProgress = !this.canInProgress;
        console.log(this.canInProgress);
      } else if (index == 4) {
        this.manageAdmins = !this.manageAdmins;
        console.log(this.manageAdmins);
      }
    },

    getAdminData(adminData) {
      this.selectedAdmin = adminData;
      this.id = adminData.id;
      console.log(adminData.phoneNumber);
    },

    async updateData() {
      try {
        const updatedData = {
          password: "",
        };

        // this.category && (updatedData.category = this.category);
        // this.name && (updatedData.name = this.name);
        // this.name && (updatedData.userName = this.name);
        // this.email && (updatedData.email = this.email);
        // this.phoneNumber && (updatedData.phoneNumber = this.phoneNumber);
        // this.canAccept && (updatedData.canAccept = this.canAccept);
        // this.canReject && (updatedData.canReject = this.canReject);
        // this.canClose && (updatedData.canClose = this.canClose);
        // this.canInProgress && (updatedData.canInProgress = this.canInProgress);
        // this.manageAdmins && (updatedData.manageAdmins = this.manageAdmins);

        this.selectedAdmin.password = "";

        const response = await axios.put(
          `${this.API}/api/Users/${this.id}`,

          this.selectedAdmin,
          {
            headers: {
              Authorization: `Bearer ${this.isAllow}`,
              "Content-type": "application/json",
            },
          }
        );

        location.reload();
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },

    cancelButton() {
      location.reload();
    },
  },
  created() {
    this.getAdmins();
  },
};
</script>

<style lang="scss" scoped>
$table-breakpoint: 480px;
$table-background-color: #fff;
$table-text-color: #024457;
$table-outer-border: 1px solid #167f92;
$table-cell-border: 1px solid #d9e4e6;

$table-border-radius: 10px;
$table-highlight-color: #eaf3f3;
$table-header-background-color: #167f92;
$table-header-text-color: #fff;
$table-header-border: 1px solid #fff;

@mixin responstable(
  $breakpoint: $table-breakpoint,
  $background-color: $table-background-color,
  $text-color: $table-text-color,
  $outer-border: $table-outer-border,
  $cell-border: $table-cell-border,
  $border-radius: none,
  $highlight-color: none,
  $header-background-color: $table-background-color,
  $header-text-color: $table-text-color,
  $header-border: $table-cell-border
) {
  .responstable {
    margin: 1em 0;
    width: 100%;
    overflow: hidden;
    background: $background-color;
    color: $text-color;
    border-radius: $border-radius;
    border: $outer-border;

    tr {
      &:nth-child(odd) {
        background-color: $highlight-color;
        input {
          background-color: white;
          border: 0;
          padding: 15px 0px 15px 15px;
        }
      }
    }

    th {
      display: none;
      border: $header-border;
      background-color: $header-background-color;
      color: $header-text-color;
      text-align: center !important;
      &:first-child {
        display: table-cell;
        text-align: center;
      }
      &:nth-child(2) {
        display: table-cell;
        span {
          display: none;
        }
      }
    }

    td {
      display: block;
      font-weight: bold;
      max-width: 7em;
      text-align: center !important;

      a {
        text-decoration: none;
        color: #000;
        font-weight: bold;
      }

      &:first-child {
        display: table-cell;
        text-align: center;
        border-right: $cell-border;
      }
      @media (min-width: $breakpoint) {
        border: $cell-border;
      }
    }

    th,
    td {
      text-align: left;
      margin: 0.5em 1em;
      @media (min-width: $breakpoint) {
        display: table-cell;
        padding: 10px;
      }
    }
  }

  .state {
    padding: 10px 15px;
    border-radius: 10px;
  }
}

@include responstable(
  $border-radius: $table-border-radius,
  $highlight-color: $table-highlight-color,
  $header-background-color: $table-header-background-color,
  $header-text-color: $table-header-text-color,
  $header-border: $table-header-border
);

$offset: 187;
$duration: 1.4s;

.spinner-container {
  padding-top: 100px;
}

.spinner {
  animation: rotator $duration linear infinite;
}

@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

.path {
  stroke-dasharray: $offset;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash $duration ease-in-out infinite,
    colors ($duration * 4) ease-in-out infinite;
}

@keyframes colors {
  0% {
    stroke: #4285f4;
  }
  25% {
    stroke: #de3e35;
  }
  50% {
    stroke: #f7c223;
  }
  75% {
    stroke: #1b9a59;
  }
  100% {
    stroke: #4285f4;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: $offset;
  }
  50% {
    stroke-dashoffset: $offset/4;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: $offset;
    transform: rotate(450deg);
  }
}

label {
  padding: 5px !important;
  margin: 5px 0;
}

.modal-content {
  width: 700px !important;
}
</style>
