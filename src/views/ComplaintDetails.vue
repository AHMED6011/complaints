<template>
  <main>
    <div class="container" v-if="complaint">
      <div class="header-title">
        <h1 class="text-center py-5 text-primary">Complaint Details</h1>
        <div :class="IsStaff()">
          <button
            @click.prevent="accepted"
            v-if="complaint.status === 0"
            class="btn m-2 text-light fw-bold bg-success"
          >
            Accept
          </button>
          <button
            @click.prevent="rejected"
            v-if="complaint.status === 0"
            class="btn m-2 text-light fw-bold bg-danger"
          >
            Reject
          </button>
          <button
            @click.prevent="inProgress"
            v-if="complaint.status === 1"
            class="btn m-2 text-light fw-bold bg-warning"
          >
            In Progress
          </button>
          <button
            @click.prevent="closed"
            v-if="complaint.status === 3"
            class="btn m-2 text-light fw-bold bg-dark"
          >
            Close
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-3 col-sm-6 text-center">
          <h4 class="my-4">Title</h4>
          <p>{{ complaint.title }}</p>
        </div>
        <div class="col-12 col-md-3 col-sm-6 text-center">
          <h4 class="my-4">Date</h4>
          <p>{{ formatDate(complaint.createdDate) }}</p>
        </div>
        <div class="col-12 col-md-3 col-sm-6 text-center">
          <h4 class="my-4">Address</h4>
          <p>{{ complaint.address }}</p>
        </div>
        <div class="col-12 col-md-3 col-sm-6 text-center">
          <h4 class="my-4">Category</h4>
          <p>{{ complaint.category }}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-8 text-center desc">
          <h4 class="my-4">Description</h4>
          <p class="">{{ complaint.description }}</p>
        </div>
        <div class="col-12 col-md-4 text-center status">
          <h4 class="my-4">Status</h4>
          <p>
            <span class="state">
              {{ getStatusMessage(complaint.status) }}
            </span>
          </p>
        </div>
      </div>
      <div class="row mt-4 justify-content-center">
        <div class="col-4 text-center">
          <h3>Logs</h3>
          <ul class="list-group" v-for="log in complaint.logs" :key="log.id">
            <li class="list-group-item border-0">
              {{ log.logText }}
            </li>
            <li class="list-group-item border-0">
              {{ formatDate(log.logDate) }}
            </li>
          </ul>
        </div>
        <div class="col-12 col-md-8" v-if="complaint.image">
          <h2 class="text-center">Image</h2>
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
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Chat Box</h5>
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
      category: "",
      desc: "",
      address: "",
      title: "",
      imageFile: null,
      msg: "",
      cookies: useCookies().cookies,
    };
  },
  methods: {
    selectedImg(event) {
      this.imageFile = event.target.files[0].name;
    },
    async getComplaints() {
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
        return "Pending";
      } else if (status === 1) {
        return "Accepted";
      } else if (status === 2) {
        return "Rejected";
      } else if (status === 3) {
        return "InProgress";
      } else {
        return "Closed";
      }
    },
    getStatusMessage(status) {
      if (status === 0) {
        return "Pending";
      } else if (status === 1) {
        return "Accepted";
      } else if (status === 2) {
        return "Rejected";
      } else if (status === 3) {
        return "InProgress";
      } else if (status === 4) {
        return "Closed";
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
    openChatBox() {
      this.$nextTick(() => {
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
      });
    },
    IsStaff() {
      if (this.cookies.get("isStaff") == "true") {
        return "d-flex";
      }
      return "d-none";
    },
  },
  created() {
    this.isAdmin = this.cookies.get("isStaff");
    console.log(this.isAdmin);
    this.getComplaints();
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
</style>
