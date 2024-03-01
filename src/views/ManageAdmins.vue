<template>
  <main>
    <div class="parent-loader" v-if="loading">
      <div class="custom-loader"></div>
    </div>
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
          <h1 class="header-title custom-text-primary text-center fw-bold py-4">
            Yöneticileri Sayfasi
          </h1>
        </div>
        <div class="col-6 col-md-4 text-end">
          <CreateAdmins />
        </div>
      </div>
    </div>

    <h4 class="text-center text-danger">{{ emptyArray }}</h4>

    <div class="container spinner-container" v-if="spinner">
      <div class="parent-loader">
        <div class="custom-loader"></div>
      </div>
    </div>

    <table class="responstable">
      <tr>
        <th>Kullanıcı adı</th>
        <th class="d-none d-md-table-cell">e-posta</th>
        <th class="d-none d-sm-table-cell">Kategori</th>
        <th class="d-none d-md-table-cell">Telefon numarası</th>
        <th class="d-table-cell">Süreci kaydet</th>
      </tr>

      <tr v-for="(admin, index) in admins" :key="index">
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
              class="btn custom-bg-primary"
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
                      @click.prevent="cancelButton()"
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
                            class="btn custom-bg-primary"
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
                            class="btn custom-bg-primary"
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
                            class="btn custom-bg-primary"
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
                            class="btn custom-bg-primary"
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
                            class="btn custom-bg-primary"
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
                      @click.prevent="cancelButton()"
                    >
                      İptal et
                    </button>
                    <button
                      type="button"
                      class="btn custom-bg-primary"
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

    <div class="pagination pt-3 d-flex justify-content-center">
      <Paginator
        @page="onPage($event)"
        :rows="itemsPerPage"
        :totalRecords="totalAdmins"
      ></Paginator>
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
      itemsPerPage: 5,
      totalAdmins: 0,
      email: "",
      phoneNumber: "",
      loading: true,
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
    getAdmins(param = "") {
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `${this.API}/api/Users/Paging?search=${param}&skip=1&take=${this.itemsPerPage}`,
            {
              headers: {
                Authorization: `Bearer ${this.isAllow}`,
                "Content-Type": "application/json",
              },
            }
          );

          this.admins = response.data.items;
          this.totalAdmins = response.data.total;

          this.spinner = false;
          this.loading = false;

          this.admins = response.data.items;
          this.totalAdmins = response.data.total;
          if (!response.data.total == 0) {
            this.emptyArray = "";
          } else if (response.data.total === 0 && this.searchedValue !== "") {
            return (this.emptyArray = `Yönetici bulunamadı '${this.searchedValue}' !!`);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error.message}`,
          });
        }
      }, Math.random() * 100 + 150);
    },

    filterAdmins() {
      this.spinner = true;
      this.getAdmins(this.searchedValue);
    },

    onPage(event) {
      this.spinner = true;
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `${this.API}/api/Users/Paging?skip=${event.page + 1}&take=${
              this.itemsPerPage
            }&search=${this.searchedValue}`,
            {
              headers: {
                Authorization: `Bearer ${this.isAllow}`,
              },
            }
          );
          this.spinner = false;

          this.admins = response.data.items;
          this.totalAdmins = response.data.total;
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error.message}`,
          });
        }
      }, Math.random() * 200 + 150);
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
              await axios.delete(`${API}/api/Users/${id}`, {
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
          text: `${error.message.data}`,
        });
      }
    },

    cancelButton() {
      this.getAdmins();
    },

    async updateData() {
      try {
        this.selectedAdmin.password = "";

        await axios.put(
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
          text: `${error.message.data}`,
        });
      }
    },
  },

  mounted() {
    this.filterAdmins();
    this.userID = this.cookies.get("userID");
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

.parent-loader {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  background-color: #1616163b;
  z-index: 990;
  display: flex;
  justify-content: center;
  align-items: center;

  .custom-loader {
    position: absolute;
    z-index: 999;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(farthest-side, #167f92 94%, #0000) top/16px 16px
        no-repeat,
      conic-gradient(#0000 30%, #167f92);
    -webkit-mask: radial-gradient(
      farthest-side,
      #0000 calc(100% - 16px),
      #000 0
    );
    animation: s3 1s infinite linear;
  }
}

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  background: #4285f438;
  border-color: #4285f4;
  color: #4285f4;
}

.p-datatable .p-datatable-tbody > tr:focus-visible {
  outline: 0.15rem solid #4286f4bb;
  outline-offset: -0.15rem;
}

.p-link:focus-visible {
  outline: 1px solid #4286f4bb;
  outline-offset: 2px;
  box-shadow: none;
}

@keyframes s3 {
  100% {
    transform: rotate(1turn);
  }
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
