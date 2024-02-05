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
    <div v-if="complaint">
      <div class="container">
        <div class="header-title">
          <h1 class="text-center py-5 text-primary fw-bold">
            Şikayet Detayları
          </h1>
          <div :class="IsStaff()">
            <button
              @click.prevent="accepted"
              v-if="complaint.status === 0 && canAccept == true"
              class="btn m-2 text-light fw-bold bg-success"
            >
              Kabul et
            </button>
            <button
              @click.prevent="rejected"
              v-if="complaint.status === 0 && canReject == true"
              class="btn m-2 text-light fw-bold bg-danger"
            >
              Reddet
            </button>
            <button
              @click.prevent="inProgress"
              v-if="complaint.status === 1 && canInProgress == true"
              class="btn m-2 text-light fw-bold bg-warning"
            >
              Devam ediyor
            </button>
            <button
              @click.prevent="closed"
              v-if="complaint.status === 3 && canClose == true"
              class="btn m-2 text-light fw-bold bg-dark"
            >
              Kapalı
            </button>
            <button
              @click.prevent="deleteComplaint"
              v-if="
                complaint.status === 0 &&
                canAccept == true &&
                canReject == true &&
                canInProgress == true &&
                canClose == true
              "
              class="btn m-2 text-light fw-bold bg-danger"
            >
              Şikayet Sil
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-3 col-sm-6 text-center">
            <h4 class="my-4 fw-bold">Başlık</h4>
            <p class="text-secondary text-break">{{ complaint.title }}</p>
          </div>
          <div class="col-12 col-md-3 col-sm-6 text-center">
            <h4 class="my-4 fw-bold">Tarih</h4>
            <p class="text-secondary text-break">
              {{ formatDate(complaint.createdDate) }}
            </p>
          </div>
          <div class="col-12 col-md-3 col-sm-6 text-center">
            <h4 class="my-4 fw-bold">Adres</h4>
            <p class="text-secondary text-break">{{ complaint.address }}</p>
          </div>
          <div class="col-12 col-md-3 col-sm-6 text-center">
            <h4 class="my-4 fw-bold">Kategori</h4>
            <p class="text-secondary text-break">{{ complaint.category }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-8 text-center desc">
            <h4 class="my-4 fw-bold">Açıklama</h4>
            <p class="text-secondary text-break">{{ complaint.description }}</p>
          </div>

          <div class="col-12 col-md-4 text-center">
            <h4 class="my-4 fw-bold">Durum</h4>
            <p class="text-secondary text-break">
              {{ getStatusMessage(complaint.status) }}
            </p>
          </div>
        </div>
        <div class="row border-0 mt-4 justify-content-center">
          <div class="col-6 text-center">
            <h3 class="my-4 fw-bold">Geçimiş</h3>
            <ul class="list-group" v-for="log in complaint.logs" :key="log.id">
              <li
                class="list-group-item text-secondary text-break d-flex justify-content-around border-0 text-start"
              >
                <span> {{ log.logText }} </span>
                <span> {{ formatDate(log.logDate) }} </span>
              </li>
            </ul>
          </div>
          <div class="col-12 col-md-6" v-if="complaint.image">
            <h2 class="my-4 fw-bold text-center">Resim</h2>
            <img
              class="img-fluid"
              :src="`${this.API}/api/Files/${complaint.image}`"
              alt=""
            />
          </div>
        </div>
      </div>
      <button
        class="btn btn-messages"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
        @click="openChatBox"
      >
        <i class="fa-regular fa-comment-dots"></i>
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
          <SendMessages :complaint="complaint" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import SendMessages from "@/components/SendMessages.vue";
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
      cookies: useCookies().cookies,
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
      } catch (err) {
        console.log(err);
      }
    },
    async deleteComplaint() {
      try {
        await axios.delete(`${this.API}/api/Complaints/${this.id}`, {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
          },
        });
        location.replace("/complaints");
      } catch (error) {
        console.error("An error occurred while deleting the complaint:", error);
      }
    },
    async accepted() {
      const result = await axios.post(
        `${this.API}/api/Complaints/Accept/${this.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
          },
        }
      );
      location.reload();
      console.log(result.data);
    },
    async rejected() {
      const result = await axios.post(
        `${this.API}/api/Complaints/Reject/${this.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
          },
        }
      );
      location.reload();

      console.log(result.data);
    },
    async inProgress() {
      const result = await axios.post(
        `${this.API}/api/Complaints/InProgress/${this.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
          },
        }
      );
      location.reload();

      console.log(result.data);
    },
    async closed() {
      const result = await axios.post(
        `${this.API}/api/Complaints/Close/${this.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.isAllow}`,
          },
        }
      );
      location.reload();
      console.log(result.data);
    },
    getStatusMessage(status) {
      if (status === 0) {
        return "Şikayet alındı";
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
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    IsStaff() {
      if (
        this.cookies.get("isStaff") == "true" &&
        this.canAccept == true &&
        this.canReject == true &&
        this.canInProgress == true &&
        this.canClose == true
      ) {
        return "d-flex";
      }
      return "d-none";
    },
  },
  created() {
    this.isAdmin = this.cookies.get("isStaff");
    console.log(this.isAdmin);
    this.getComplaint();
    this.isAllow;
  },
};
</script>

<style lang="scss" scoped>
.row {
  border-bottom: 2px solid #bbbbbb;
  font-weight: bold;
}

.desc {
  border-right: 2px solid #bbbbbb;
}

.btn-messages {
  position: fixed;
  bottom: 50px;
  right: 50px;
  background-color: #0d6efd;
  padding: 10px 15px;
  border-radius: 50%;
  color: white;

  transition: 0.3s;

  &:hover,
  &:active {
    background-color: #0254ce;
    box-shadow: 0px 0px 10px 6px #9f9f9f;
    transform: scale(1.1);
  }
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

.header-title {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
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
