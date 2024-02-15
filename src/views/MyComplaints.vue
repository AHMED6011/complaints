<template>
  <main>
    <div class="container-fluid">
      <div class="row d-flex justify-content-evenly py-3">
        <div
          class="col-md-7 col-12 offset-0 offset-md-2 mb-3 d-flex d-md-none justify-sm-content-start justify-content-center p-0"
        >
          <h1
            class="header-title text-center text-primary fw-bold"
            v-if="complaints.length > 0"
          >
            <span v-if="isStaff == 'true'" style="padding: 0 5px">Admin</span>
            Tüm Şikayetler
          </h1>
        </div>
        <div
          class="col-md-3 col-12 d-flex justify-sm-content-start justify-content-center p-0"
        >
          <label class="select">
            <select
              class="rounded"
              @change="filterBy()"
              v-model="selectedValue"
            >
              <option value="" selected>Tüm</option>
              <option value="0">onay bekleniyor</option>
              <option value="1">Kabul edilmiş</option>
              <option value="2">Reddedilmiş</option>
              <option value="3">Devam etmekte</option>
              <option value="4">Tamamlandı</option>
            </select>
          </label>
        </div>
        <div
          class="col-md-7 d-none col-12 offset-0 offset-md-2 d-md-flex justify-sm-content-start justify-content-center p-0"
        >
          <h1
            class="header-title text-center text-primary fw-bold"
            v-if="complaints.length > 0"
          >
            <span v-if="isStaff == 'true'">Admin</span>
            Tüm Şikayetler
          </h1>
        </div>
      </div>

      <h1
        class="text-center py-5 text-primary fw-bold"
        v-if="complaints.length == 0 && isErr == false"
      >
        Henüz Şikayet Yok
      </h1>
      <div class="container spinner-container" v-if="isLoading">
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

      <h1 class="text-center py-5 text-danger fw-bold" v-if="isErr">
        {{ msgError }}
      </h1>
    </div>
    <div class="scroll">
      <table class="responstable" v-if="complaints.length > 0">
        <tr>
          <th>Başlık</th>
          <th class="d-none d-sm-table-cell">Kategori</th>
          <th class="d-none d-md-table-cell">Tarih</th>
          <th class="d-none d-md-table-cell">Durum</th>
          <th class="d-table-cell">Daha fazla detay</th>
        </tr>

        <tr v-for="(complaint, index) in displayedComplaints" :key="index">
          <td class="text-break">
            {{ complaint.title }}
          </td>
          <td class="text-break d-none d-sm-table-cell">
            {{ complaint.category }}
          </td>
          <td class="text-break d-none d-md-table-cell">
            {{ formatDate(complaint.createdDate) }}
          </td>
          <td class="text-break d-none d-md-table-cell">
            <span
              class="state"
              :style="{ color: getStatusColor(complaint.status) }"
            >
              {{ getStatusMessage(complaint.status) }}
            </span>
          </td>
          <td class="text-break">
            <RouterLink
              :to="{ name: 'ComplaintDetails', params: { id: complaint.id } }"
              class="btn btn-info text-dark"
              >Daha fazla detay</RouterLink
            >
          </td>
        </tr>
      </table>
    </div>

    <div class="pagination py-4 d-flex justify-content-center">
      <vue-awesome-paginate
        v-model="currentPage"
        :total-items="totalComplaints"
        :items-per-page="itemsPerPage"
        :max-pages-shown="5"
        @page-clicked="
          filterBy();
          handlePageChange();
        "
        :container-class="'pagination-container'"
      />
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "PagingComplaints",
  data() {
    return {
      complaints: [],
      currentPage: 1,
      itemsPerPage: 5,
      totalComplaints: 0,
      isLoading: true,
      isStaff: useCookies().cookies.get("isStaff"),
      isErr: false,
      cookies: useCookies().cookies,
      selectedValue: "",
    };
  },
  methods: {
    async filterBy() {
      try {
        this.currentPage = 1;
        if (this.selectedValue === 0) {
          this.selectedValue = 0;
        } else if (this.selectedValue === 1) {
          this.selectedValue = 1;
        } else if (this.selectedValue === 2) {
          this.selectedValue = 2;
        } else if (this.selectedValue === 3) {
          this.selectedValue = 3;
        } else if (this.selectedValue === "") {
          this.selectedValue = "";
        }
        const response = await axios.get(
          `${this.API}/api/Complaints/Paging?skip=${this.currentPage}&status=${this.selectedValue}`,
          {
            headers: {
              Authorization: `Bearer ${this.isAllow}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.data.total == 0) {
          this.complaints = response.data.items;
          this.totalComplaints = response.data.total;
          this.pagesShown = Math.ceil(this.totalComplaints / this.itemsPerPage);
        } else if (response.data.total == 0) {
          toast.warning("Şikayet Bulunamadı", {
            autoClose: 2500,
          });
          this.isErr = false;
        }

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.isErr = true;
        this.msgError = "İşlem sırasında bir hata oluştu";
      }
    },
    handlePageChange(data) {
      this.currentPage = data.currentPage;
    },
    getStatusMessage(status) {
      if (status === 0) {
        return "onay bekleniyor";
      } else if (status === 1) {
        return "Kabul edilmiş";
      } else if (status === 2) {
        return "Reddedilmiş";
      } else if (status === 3) {
        return "Devam etmekte";
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
  },
  computed: {
    displayedComplaints() {
      const startIndex =
        this.currentPage * this.itemsPerPage - this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.complaints.slice(startIndex, endIndex);
    },
  },

  created() {
    this.filterBy();
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
    margin-bottom: 80px;
    width: 100%;
    overflow: hidden;
    background: $background-color;
    color: $text-color;
    border-radius: $border-radius;
    border: $outer-border;

    tr {
      border: $cell-border;
      &:nth-child(odd) {
        background-color: $highlight-color;
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
  height: 90vh;
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

select {
  appearance: none;
  background-color: #4285f4;
  border: 0;
  outline: 0;
  color: inherit;
  box-shadow: none;
}
select::-ms-expand {
  display: none;
}
.select {
  position: relative;
  display: flex;
  width: 200px;
  background-color: #fff;
  border-radius: 0.25rem;
  overflow: hidden;
  select {
    flex: 1;
    padding: 1em;
    cursor: pointer;
    font-weight: bold;

    option {
      background-color: #fff;
    }
  }
  &::after {
    content: "\25BC";
    position: absolute;
    right: 15px;
    top: 16px;
    transition: 0.25s all ease;
    pointer-events: none;
  }
  &:hover::after {
    color: #fff;
    animation: bounce 0.5s infinite;
  }
}
@keyframes bounce {
  25% {
    transform: translatey(5px);
  }
  75% {
    transform: translatey(-5px);
  }
}

.page-link {
  box-shadow: none;
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

@media (max-width: 567px) {
  .header-title {
    font-size: 25px;
    display: flex;
    align-items: center;
  }
  .select {
    height: 60px;
  }

  .responstable {
    tr {
      td {
        margin: auto;

        a {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
