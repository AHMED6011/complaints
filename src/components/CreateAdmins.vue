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
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3 row">
                <input
                  type="text"
                  autocomplete="off"
                  v-model="name"
                  placeholder="Kullanıcı adı"
                  class="form-control"
                />
              </div>
              <div class="mb-3 row">
                <input
                  type="email"
                  autocomplete="off"
                  v-model="email"
                  placeholder="e-posta"
                  class="form-control"
                />
              </div>
              <div class="mb-3 row">
                <input
                  type="number"
                  autocomplete="off"
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
                  autocomplete="off"
                  v-model="password"
                  placeholder="Şifre"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3 row">
                <input
                  type="number"
                  autocomplete="off"
                  v-model="tc"
                  placeholder="Kimlik numarası"
                  required
                  class="form-control"
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
                    autocomplete="off"
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
      tc: "",
      status: [
        { state: false, text: "Reddedildi" },
        { state: false, text: "Kabul edildi" },
        { state: false, text: "Devam ediyor" },
        { state: false, text: "Tamamlandı" },
        { state: false, text: "Yönetici Yöneticileri" },
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
    async addNewAdmin() {
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
          tc: this.tc,
          email: this.email,
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
      } catch (error) {
        console.log(error);
      }
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
