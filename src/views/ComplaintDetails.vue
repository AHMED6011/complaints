<template>
  <main>
    <div class="container spinner-container" v-if="!complaint">
      <div class="row border-0 justify-content-center align-items-centers">
        <div class="col-12 mt-5 pt-5 text-center">
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

    <div class="container" v-else>
      <div class="header-title row pt-5 pb-3">
        <h3
          class="text-center col-md-6 col-12 mb-4 mb-md-0 custom-text-primary fw-bold"
        >
          Şikayet Detayları
        </h3>

        <div
          class="actions col-12 offset-0 offset-lg-2 col-md-6 col-lg-4 justify-content-around justify-md-content-end"
          :class="IsStaff()"
          v-if="isStaff"
        >
          <button
            @click.prevent="accepted()"
            v-if="complaint.status === 0 && canAccept == 'true'"
            class="btn mx-1 mx-lg-0 text-light fw-bold bg-success"
          >
            Kabul et
          </button>
          <button
            @click.prevent="rejected()"
            v-if="complaint.status === 0 && canReject == 'true'"
            class="btn mx-1 mx-lg-0 text-light fw-bold bg-danger"
          >
            Reddet
          </button>
          <button
            @click.prevent="inProgress()"
            v-if="complaint.status === 1 && canInProgress == 'true'"
            class="btn mx-1 mx-lg-0 text-light fw-bold bg-warning"
          >
            Devam ediyor
          </button>
          <button
            @click.prevent="closed()"
            v-if="complaint.status === 3 && canClose == 'true'"
            class="btn mx-1 mx-lg-0 text-light fw-bold bg-dark"
          >
            Tamamlandı
          </button>
          <button
            @click.prevent="deleteComplaint()"
            v-if="
              complaint.status === 0 &&
              canAccept == 'true' &&
              canReject == 'true' &&
              canInProgress == 'true' &&
              canClose == 'true'
            "
            class="btn mx-1 mx-lg-0 text-light fw-bold bg-danger"
          >
            Şikayet Sil
          </button>
        </div>
      </div>
      <div class="row details justify-content-between">
        <div
          class="col-lg-12 mb-4 d-flex d-lg-none img-parent offset-lg-1"
          v-if="complaint.image"
        >
          <img
            class="img-fluid"
            :src="`${this.API}/api/Files/${complaint.image}`"
            alt=""
          />
        </div>

        <div class="col-12 col-lg-6">
          <ul class="list-group list-group-horizontal">
            <li class="list-group-item border-0">
              <h6 class="fw-bold p-1">Başlık</h6>
              <p class="text-secondary text-break">
                {{ complaint.title }}
              </p>
            </li>
            <li class="list-group-item border-0">
              <h6 class="fw-bold p-1">Durum</h6>
              <p :style="{ color: getStatusColor(complaint.status) }">
                {{ getStatusMessage(complaint.status) }}
              </p>
            </li>
            <li class="list-group-item border-0">
              <h6 class="fw-bold p-1">Kategori</h6>
              <p class="text-secondary text-break">
                {{ complaint.category }}
              </p>
            </li>

            <li class="list-group-item border-0">
              <h6 class="fw-bold p-1">Tarih</h6>
              <p class="text-secondary text-break">
                {{ formatDate(complaint.createdDate) }}
              </p>
            </li>

            <li class="list-group-item border-0">
              <h6 class="fw-bold p-1">Adres</h6>
              <p class="text-secondary text-break">{{ complaint.address }}</p>
            </li>

            <li class="list-group-item border-0" v-if="isStaff === 'true'">
              <h6 class="fw-bold p-1">Kullanıcı adı</h6>
              <p class="text-secondary text-break">{{ complaint.user.name }}</p>
            </li>
            <li class="list-group-item border-0" v-if="isStaff === 'true'">
              <h6 class="fw-bold p-1">E-posta</h6>
              <p class="text-secondary text-break">
                {{ complaint.user.email }}
              </p>
            </li>

            <li class="list-group-item border-0" v-if="isStaff === 'true'">
              <h6 class="fw-bold p-1">Telefon numarası</h6>
              <p class="text-secondary text-break">
                {{ complaint.user.phoneNumber }}
              </p>
            </li>
            <li class="list-group-item border-0" v-if="isStaff === 'true'">
              <h6 class="fw-bold p-1">Kimlik numarası</h6>
              <p class="text-secondary text-break">
                {{ complaint.user.tc }}
              </p>
            </li>
          </ul>
        </div>

        <div
          class="col-lg-5 d-none d-lg-flex img-parent"
          v-if="complaint.image"
        >
          <img
            class="img-fluid"
            :src="`${this.API}/api/Files/${complaint.image}`"
            alt=""
          />
        </div>

        <hr class="mt-2" />

        <div class="col-12 col-lg-6 text-center bg-color">
          <h6 class="fw-bold">Açıklama</h6>
          <p class="text-secondary text-break">
            {{ complaint.description }}
          </p>
        </div>

        <div class="col-12 col-lg-6 user-details bg-color pb-5">
          <h5 class="text-center fw-bold">Geçimiş</h5>
          <ul class="rounded list-group">
            <li
              v-for="log in complaint.logs"
              :key="log.id"
              class="list-group-item text-secondary text-break d-flex justify-content-around border-0 text-start"
            >
              <span class="p-1"> {{ log.logText }} </span>
              <span class="p-1 d-none"> {{ formatDate(log.logDate) }} </span>
              <span class="p-1"> {{ formatDate(log.logDate) }} </span>
            </li>
          </ul>
        </div>
      </div>
      <button
        class="btn btn-messages"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        <i class="fa-regular fa-comment-dots fa-2xl"></i>
      </button>
      <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasExampleLabel">Mesajler</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body ps-0">
          <SendMessages
            :complaint="complaint"
            :id="complaint.id"
            opend="opend"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import SendMessages from "@/components/SendMessages.vue";
import { useDateFormat } from "@vueuse/core";
import { useCookies } from "vue3-cookies";

export default {
  props: ["id"],
  components: { SendMessages },
  data() {
    return {
      complaint: null,
      Kategori: "",
      desc: "",
      address: "",
      title: "",
      imageFile: null,
      msg: "",
      isStaff: useCookies().cookies.get("isStaff"),
      canAccept: useCookies().cookies.get("canAccept"),
      canReject: useCookies().cookies.get("canReject"),
      canInProgress: useCookies().cookies.get("canInProgress"),
      canClose: useCookies().cookies.get("canClose"),
    };
  },
  methods: {
    selectedImg(event) {
      this.imageFile = event.target.files[0].name;
    },
    async getComplaint() {
      try {
        const response = await axios.get(
          `${this.API}/api/Complaints/${this.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.isAllow}`,
              "Content-Type": "application/json",
            },
          }
        );
        this.complaint = response.data;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message.data}`,
        });
      }
    },
    async deleteComplaint() {
      try {
        await axios.delete(`${this.API}/api/Complaints/${this.id}`, {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
          },
        });
        this.$router.push("/complaints");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message.data}`,
        });
      }
    },
    async accepted() {
      await axios.post(`${this.API}/api/Complaints/Accept/${this.id}`, null, {
        headers: {
          Authorization: `Bearer ${this.isAllow}`,
        },
      });
      location.reload();
    },
    async rejected() {
      await axios.post(`${this.API}/api/Complaints/Reject/${this.id}`, null, {
        headers: {
          Authorization: `Bearer ${this.isAllow}`,
        },
      });
      location.reload();
    },
    async inProgress() {
      await axios.post(
        `${this.API}/api/Complaints/InProgress/${this.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
          },
        }
      );
      location.reload();
    },
    async closed() {
      await axios.post(`${this.API}/api/Complaints/Close/${this.id}`, null, {
        headers: {
          Authorization: `Bearer ${this.isAllow}`,
        },
      });
      location.reload();
    },
    getStatusMessage(status) {
      if (status === 0) {
        return "Onay bekleniyor";
      } else if (status === 1) {
        return "Kabul edildi";
      } else if (status === 2) {
        return "Reddedildi";
      } else if (status === 3) {
        return "Devam ediyor";
      } else {
        return "Tamamlandı";
      }
    },
    getStatusColor(status) {
      if (status === 0) {
        return "#6c757d";
      } else if (status === 1) {
        return "#198754";
      } else if (status === 2) {
        return "#dc3545";
      } else if (status === 3) {
        return "#ffc107";
      } else if (status === 4) {
        return "#000000";
      }
    },
    formatDate(dateString) {
      return useDateFormat(dateString, "YYYY-MM-DD HH:mm").value.replace(
        /["']/g,
        ""
      );
    },

    IsStaff() {
      if (
        this.isStaff == "true" &&
        this.canAccept == "true" &&
        this.canReject == "true" &&
        this.canInProgress == "true" &&
        this.canClose == "true"
      ) {
        return "d-flex";
      }
      return "d-none";
    },
  },
  created() {
    this.isAdmin = this.isStaff;
    this.getComplaint();
    this.isAllow;
  },
};
</script>

<style lang="scss" scoped>
.row {
  font-weight: bold;
}

.desc {
  border-right: 2px solid #bbbbbb;
}

.btn-messages {
  position: fixed;
  bottom: 50px;
  right: 50px;
  background-color: #167f92;
  padding: 18px 15px;
  border-radius: 50%;
  color: white;

  transition: 0.3s;

  &:hover,
  &:active {
    background-color: #167f92;
    box-shadow: 0px 0px 10px 6px #9f9f9f;
    transform: scale(1.1);
  }
}
p {
  margin: 0;
}

.status {
  .state {
    padding: 15px;
    margin: 15px;
    border-radius: 10px;
  }
}

.offcanvas.offcanvas-bottom {
  height: auto !important;
}

.details {
  ul {
    display: block;
    li {
      width: 100%;
      display: flex;
      padding: 0 !important;
      border-radius: 10px !important;

      &:nth-child(odd) {
        background-color: #0091ff1a;
      }
      h6 {
        display: block;
        width: 50%;
        text-align: right;
        margin-right: 35px;
      }

      p {
        display: block;
        width: 50%;
      }
    }
  }
}

.img-parent {
  padding: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;

  & img {
    max-width: 100%;
    min-width: 350px;
    max-height: 400px;
    min-height: 300px;
    border-radius: 10px;
    box-shadow: 0px 0px 30px 5px #7d7d7d;
  }
}

.bg-color {
  background-color: #f0fcff;
  border-radius: 10px;
  padding: 30px;
}

$offset: 187;
$duration: 1.4s;

.spinner-container {
  height: 1000px;
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
</style>
