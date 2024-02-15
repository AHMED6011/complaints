<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center align-items-center">
        <div class="col-12 pt-3 pt-md-0 col-md-3 justify-content-end">
          <div class="d-flex justify-content-start">
            <input
              type="search"
              v-model="searchedValue"
              @input="debounceFilterAdmins"
              class="form-control me-2"
              placeholder="Yönetici Ara"
              aria-label="Search"
            />
          </div>
        </div>
        <div class="col-6 col-md-4 offset-0 offset-md-1">
          <h1 class="header-title text-primary text-center fw-bold py-4">
            Yöneticileri Sayfasi
          </h1>
        </div>
        <div class="col-6 col-md-4 text-end">
          <CreateAdmins />
        </div>
      </div>
    </div>

    <h4 class="text-center">{{ emptyArray }}</h4>

    <div
      class="container spinner-container"
      v-if="admins.length == 0 && spinner"
    >
      <div class="row justify-content-center align-items-center">
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

    <div class="scroll" v-else>
      <table class="responstable">
        <tr>
          <th>Kullanıcı adı</th>
          <th class="d-none d-md-table-cell">e-posta</th>
          <th class="d-none d-sm-table-cell">Kategori</th>
          <th class="d-none d-md-table-cell">Telefon numarası</th>
          <th class="d-table-cell">Süreci kaydet</th>
        </tr>

        <tr v-for="(admin, index) in displayedAdmins" :key="index">
          <td>
            <p v-if="admin.name">{{ admin.name }}</p>
            <p v-else>Veri yok</p>
          </td>
          <td class="text-break d-none d-md-table-cell">
            <p v-if="admin.email">{{ admin.email }}</p>
            <p v-else>Veri yok</p>
          </td>
          <td class="text-break d-none d-sm-table-cell">
            <p v-if="admin.category">{{ admin.category }}</p>
            <p v-else>Veri yok</p>
          </td>
          <td class="text-break d-none d-md-table-cell">
            <p v-if="admin.phoneNumber">{{ admin.phoneNumber }}</p>
            <p v-else>Veri yok</p>
          </td>

          <td>
            <div
              class="d-flex ms-3 ms-sm-0 justify-content-lg-center justify-content-start"
            >
              <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                @click="getAdminData(admin)"
              >
                Düzenleme
              </button>
              <button
                class="btn mx-2 btn-danger"
                @click="deleteAcount(admin.id, this.API, this.isAllow)"
              >
                Sil
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
                            autocomplete="new-password"
                            class="form-control"
                          />
                        </div>
                        <div class="row mb-3">
                          <input
                            type="email"
                            v-model="selectedAdmin.email"
                            autocomplete="new-password"
                            placeholder="e-posta"
                            class="form-control"
                          />
                        </div>
                        <div class="row mb-3">
                          <input
                            type="text"
                            autocomplete="new-password"
                            v-model="selectedAdmin.phoneNumber"
                            :placeholder="selectedAdmin.phoneNumber"
                            class="form-control"
                          />
                        </div>
                        <div
                          class="row mb-3"
                          :style="{ display: checkAdminID(selectedAdmin.id) }"
                        >
                          <select
                            id="validationCustom0"
                            class="form-select mb-3"
                            aria-label="Default select example"
                            v-model="selectedAdmin.category"
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
                        <div
                          class="row mb-3 justify-content-center"
                          :style="{ display: checkAdminID(selectedAdmin.id) }"
                        >
                          <h3 class="mb-4">İzin ver</h3>
                          <div class="col-3 col-md-2 mx-2 p-0">
                            <input
                              type="checkbox"
                              class="btn-check"
                              :id="`1${selectedAdmin.id}1`"
                              autocomplete="new-password"
                              v-model="selectedAdmin.canReject"
                            />
                            <label
                              class="btn btn-outline-primary"
                              :for="`1${selectedAdmin.id}1`"
                              >Reddedildi
                            </label>
                          </div>
                          <div class="col-3 col-md-2 mx-2 p-0">
                            <input
                              type="checkbox"
                              class="btn-check"
                              :id="`2${selectedAdmin.id}2`"
                              autocomplete="new-password"
                              v-model="selectedAdmin.canAccept"
                            />
                            <label
                              class="btn btn-outline-primary"
                              :for="`2${selectedAdmin.id}2`"
                              >Kabul edildi</label
                            >
                          </div>
                          <div class="col-3 col-md-2 mx-2 p-0">
                            <input
                              type="checkbox"
                              class="btn-check"
                              :id="`3${selectedAdmin.id}3`"
                              autocomplete="new-password"
                              v-model="selectedAdmin.canInProgress"
                            />
                            <label
                              class="btn btn-outline-primary"
                              :for="`3${selectedAdmin.id}3`"
                              >Devam ediyor</label
                            >
                          </div>
                          <div class="col-3 col-md-2 mx-2 p-0">
                            <input
                              type="checkbox"
                              class="btn-check"
                              :id="`4${selectedAdmin.id}4`"
                              autocomplete="new-password"
                              v-model="selectedAdmin.canClose"
                            />
                            <label
                              class="btn btn-outline-primary"
                              :for="`4${selectedAdmin.id}4`"
                              >Tamamlandı</label
                            >
                          </div>
                          <div class="col-3 col-md-2 mx-2 p-0">
                            <input
                              type="checkbox"
                              class="btn-check"
                              :id="`5${selectedAdmin.id}5`"
                              autocomplete="new-password"
                              v-model="selectedAdmin.manageAdmins"
                            />
                            <label
                              class="btn btn-outline-primary"
                              :for="`5${selectedAdmin.id}5`"
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
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        Güncelle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="pagination pt-3 d-flex justify-content-center">
      <vue-awesome-paginate
        v-model="currentPage"
        :total-items="totalAdmins"
        :items-per-page="itemsPerPage"
        :max-pages-shown="5"
        @page-clicked="handlePageChange"
        :container-class="'pagination-container'"
      />
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";
import CreateAdmins from "@/components/CreateAdmins.vue";
import Swal from "sweetalert2";

export default {
  components: { CreateAdmins },
  data() {
    return {
      admins: [],
      selectedAdmin: {},
      category: "",
      name: "",
      currentPage: 1,
      itemsPerPage: 5,
      totalAdmins: 0,
      email: "",
      phoneNumber: "",
      searchedValue: "",
      cookies: useCookies().cookies,
      userID: "",
      id: "",
      spinner: false,
      emptyArray: "",
      debounceTimeout: null,
      status: [
        { state: false, text: "Reddedildi" },
        { state: false, text: "Kabul edildi" },
        { state: false, text: "Devam ediyor" },
        { state: false, text: "Tamamlandı" },
        { state: false, text: "Yönetici Yöneticileri" },
      ],
    };
  },
  methods: {
    debounceFilterAdmins() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(async () => {
        await this.filterAdmins();
      }, 500);
    },
    async getAdmins() {
      try {
        const response = await axios.get(`${this.API}/api/Users`, {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
            "Content-Type": "application/json",
          },
        });

        this.admins = response.data;
        this.totalAdmins = response.data.length;
        this.pagesShown = Math.ceil(this.totalAdmins / this.itemsPerPage);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response}`,
        });
      }
    },

    async filterAdmins() {
      this.currentPage = 1;
      try {
        const result = await axios.get(
          `${this.API}/api/Users/Paging?search=${this.searchedValue}`,
          {
            headers: {
              Authorization: `Bearer ${this.isAllow}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!result.data.items.length == 0) {
          this.admins = result.data.items;
          this.emptyArray = "";
        } else if (result.data.total === 0) {
          this.spinner = false;
          return (this.emptyArray = `Yönetici bulunamadı '${this.searchedValue}' !!`);
        }

        this.spinner = true;

        this.totalAdmins = result.data.total;
        this.pagesShown = Math.ceil(this.totalAdmins / this.itemsPerPage);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.result}`,
        });
      }
    },

    handlePageChange(data) {
      this.currentPage = data.currentPage;
    },

    getStatus(index) {
      if (index == 0) {
        this.canAccept = !this.canAccept;
      } else if (index == 1) {
        this.canReject = !this.canReject;
      } else if (index == 2) {
        this.canClose = !this.canClose;
      } else if (index == 3) {
        this.canInProgress = !this.canInProgress;
      } else if (index == 4) {
        this.manageAdmins = !this.manageAdmins;
      }
    },

    getAdminData(adminData) {
      this.selectedAdmin = adminData;
      this.id = adminData.id;
    },

    checkAdminID(adminid) {
      if (adminid === this.userID) {
        return "none";
      } else {
        return "flex";
      }
    },

    deleteAcount(id, API, token) {
      try {
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
            API: this.API,
          },
          async function (isConfirm) {
            if (isConfirm) {
              const response = await axios.delete(`${API}/api/Users/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });

              if (useCookies().cookies.get("userID") === id) {
                useCookies().cookies.set("myCookie", "");
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
            location.reload();
          }
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data}`,
        });
      }
    },

    async updateData() {
      try {
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
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data}`,
        });
      }
    },
  },

  computed: {
    displayedAdmins() {
      const startIndex =
        this.currentPage * this.itemsPerPage - this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.admins.slice(startIndex, endIndex);
    },
  },

  mounted() {
    this.getAdmins();
    this.userID = this.cookies.get("userID");
  },
};
</script>

<style lang="scss">
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

.scroll {
  max-height: 400px;
  overflow-y: overlay;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
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

.pagination-container {
  display: flex;
  column-gap: 10px;
}

.next-button,
.back-button {
  font-size: 20px;
}

.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.paginate-buttons:hover {
  background-color: #d8d8d8;
}
.active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
  font-weight: bold;
}
.active-page:hover {
  background-color: #2988c8;
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

@media (max-width: 992px) {
  .header-title {
    font-size: 25px;
  }
}
</style>
