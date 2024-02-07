<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#addAdmin"
    >
      Yeni Yönetici Ekle
    </button>

    <div
      class="modal fade"
      id="addAdmin"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Yeni Yönetici Ekle
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
              <div class="mb-3 row">
                <input
                  type="text"
                  autocomplete="new-password"
                  v-model="name"
                  placeholder="Kullanıcı adı"
                  class="form-control"
                />
              </div>
              <div class="mb-3 row">
                <input
                  type="email"
                  autocomplete="new-password"
                  v-model="email"
                  placeholder="e-posta"
                  class="form-control"
                />
              </div>
              <div class="mb-3 row">
                <input
                  type="text"
                  autocomplete="new-password"
                  v-model="phoneNumber"
                  placeholder="Telefon numarası"
                  class="form-control"
                />
              </div>
              <div class="row">
                <select
                  id="validationCustom0"
                  class="form-select mb-3"
                  v-model="category"
                  aria-label="Default select example"
                  title="Kategori seç"
                >
                  <option value="" disabled selected>Kategori seç</option>
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
              <div class="mb-3 row">
                <input
                  type="password"
                  autocomplete="new-passwor"
                  v-model="password"
                  placeholder="Şifre"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3 row justify-content-center">
                <h3 class="mb-4">İzin ver</h3>

                <div
                  class="col-2 mx-2 p-0"
                  v-for="(state, index) in status"
                  :key="index"
                >
                  <input
                    type="checkbox"
                    class="btn-check"
                    :id="`${index}`"
                    autocomplete="new-password"
                    @click="getStatus(index)"
                  />
                  <label class="btn btn-outline-primary" :for="`${index}`">{{
                    state.text
                  }}</label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="cancelButton()"
            >
              İptal et
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="addNewAdmin()"
            >
              Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  props: {
    id: String,
    admin: Object,
  },
  name: "CreateAdmins",
  data() {
    return {
      adminData: [],
      category: "",
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      status: [
        { state: false, text: "Reddedildi" },
        { state: false, text: "Kabul edildi" },
        { state: false, text: "Devam ediyor" },
        { state: false, text: "Tamamlandı" },
        { state: false, text: "Yönetici" },
      ],
      canAccept: false,
      canReject: false,
      canClose: false,
      canInProgress: false,
      manageAdmins: false,
    };
  },
  methods: {
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
    async addNewAdmin() {
      if (
        !this.name.trim() ||
        !this.phoneNumber.trim() ||
        !this.password.trim() ||
        !this.email.trim()
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Lütfen tüm alanları doldurun",
        });
        return;
      }

      if (!this.email.includes("@")) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Geçerli bir e-posta adresi giriniz",
        });
        return;
      }

      if (!/^\d+$/.test(this.phoneNumber.trim())) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Telefon numarası yalnızca rakamlar içermelidir",
        });
        return;
      }

      if (
        this.name.trim().length < 1 ||
        this.phoneNumber.trim().length < 6 ||
        this.password.trim().length < 6 ||
        this.email.trim().length < 6
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Her alan en az 6 karakter içermelidir",
        });
        return;
      }
      try {
        const createAdmin = {
          name: this.name,
          phoneNumber: this.phoneNumber,
          password: this.password,
          category: this.category,
          canAccept: this.canAccept,
          canReject: this.canReject,
          canClose: this.canClose,
          canInProgress: this.canInProgress,
          email: this.email,
          manageAdmins: this.manageAdmins,
        };

        const response = await axios.post(
          `${this.API}/api/Users`,
          createAdmin,
          {
            headers: {
              Authorization: `Bearer ${this.isAllow}`,
              "Content-Type": "application/json",
            },
          }
        );

        location.reload();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data}`,
        });
      }
    },
    cancelButton() {
      location.reload();
    },
  },

  created() {},
};
</script>

<style lang="scss" scoped>
label {
  padding: 5px !important;
  margin: 5px 0;
}

.modal-content {
  width: 700px !important;
  top: 0;
}

.modal {
  width: 130%;
  left: 47% !important;
  transform: translate(-53%, 0%) !important;
}

.modal-dialog {
  max-width: var(--bs-modal-width) !important;
  margin-right: auto !important;
  margin-left: auto !important;
}
</style>
