<template>
  <main>
    <h1
      class="text-center py-5 text-primary fw-bold"
      v-if="complaints.length == 0 && isErr == false"
    >
      Henüz Şikayet Yok
    </h1>
    <h1
      class="text-center py-3 text-primary fw-bold"
      v-if="complaints.length > 0"
    >
      Şikayetlerim
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

    <label class="select">
      <select @change="filterBy()" v-model="selectedValue">
        <option value="" selected>Tüm</option>
        <option value="0">onay bekleniyor</option>
        <option value="1">Kabul edilmiş</option>
        <option value="2">Reddedilmiş</option>
        <option value="3">Devam etmekte</option>
        <option value="4">Tamamlandı</option>
      </select>
    </label>

    <table
      data-aos-duration="1500"
      data-aos="fade-up"
      class="responstable"
      v-if="complaints.length > 0"
    >
      <tr>
        <th>Başlık</th>
        <th>Kategori</th>
        <th>Tarih</th>
        <th>Durum</th>
        <th>Daha fazla detay</th>
      </tr>

      <tr
        data-aos-duration="1000"
        data-aos="fade-up"
        v-for="complaint in complaints"
        :key="complaint.id"
      >
        <td class="text-break">{{ complaint.title }}</td>
        <td class="text-break">{{ complaint.category }}</td>
        <td class="text-break">{{ formatDate(complaint.createdDate) }}</td>
        <td class="text-break">
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
    <div class="w-100 text-center">
      <nav class="d-flex justify-content-center">
        <ul class="pagination">
          <!-- <li
            :class="{ disabled: paging == 0, 'page-item': paging > 0 }"
            class="page-item"
          >
            <button
              @click.prevent="
                desincreasePage();
                skipComplaints();
              "
              class="page-link"
            >
              Previous
            </button>
          </li> -->
          <li
            class="page-item"
            aria-current="page"
            v-for="(item, index) in arrayNumbers"
            :key="index"
          >
            <button
              :class="{ 'page-link active': x }"
              @click.prevent="skipComplaints(index)"
              class="page-link"
            >
              {{ index + 1 }}
            </button>
          </li>

          <!-- <li
            :class="{ disabled: !noMoreData, 'page-item': noMoreData == true }"
            class="page-item"
          >
            <button
              @click.prevent="
                increasePage();
                skipComplaints();
                checkForMoreData();
              "
              class="page-link"
            >
              Next
            </button>
          </li> -->
        </ul>
      </nav>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { useCookies } from "vue3-cookies";

export default {
  data() {
    return {
      complaints: [],
      cookies: useCookies().cookies,
      isLoading: false,
      isErr: false,
      msgError: "",
      selectedValue: "",
      paging: 0,
      noMoreData: true,
      pageNumbers: 0,
      currentPage: 0,
      arrayNumbers: [],
      x: false,
    };
  },
  methods: {
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
    increasePage() {
      this.paging++;
    },
    desincreasePage() {
      this.paging--;
      this.noMoreData = true;
    },

    async skipComplaints(index) {
      try {
        const response = await axios.get(
          `${this.API}/api/Complaints/Paging?skip=${index || 0}&take=5`,
          {
            headers: {
              Authorization: `Bearer ${this.isAllow}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(index);
        // console.log(this.currentPage);

        // if (index == this.currentPage) {
        //   this.x = true;
        // } else {
        //   this.x = false;
        // }
        this.isLoading = false;
        this.complaints = response.data.items;
        this.pageNumbers = response.data.total / 5;
        const arrayLength = Math.ceil(this.pageNumbers);
        const number = "item";
        this.arrayNumbers = [...Array(arrayLength)].fill(number);
        window.scrollTo(0, 150);
      } catch (error) {
        this.isLoading = false;
        this.isErr = true;
        this.msgError = "İşlem sırasında bir hata oluştu";
      }
    },

    async filterBy() {
      try {
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
          `${this.API}/api/Complaints/Paging?skip=0&status=${this.selectedValue}&take=5`,
          {
            headers: {
              Authorization: `Bearer ${this.isAllow}`,
              "Content-Type": "application/json",
            },
          }
        );
        this.complaints = response.data.items;

        console.log(this.complaints);
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.skipComplaints();
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
</style>
