<template>
  <div class="container-fluid">
    <div class="parent-loader" v-if="loading && isLoaded === false">
      <div class="custom-loader"></div>
    </div>

    <div class="p-fluid">
      <div class="row d-flex justify-content-evenly py-3">
        <div
          class="col-md-7 col-12 offset-0 offset-md-2 mb-3 d-flex d-md-none justify-sm-content-start justify-content-center p-0"
        >
          <h1
            class="header-title text-center fw-bold"
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
            class="header-title text-center fw-bold"
            v-if="complaints.length > 0"
          >
            <span v-if="isStaff == 'true'">Admin</span>
            Tüm Şikayetler
          </h1>
        </div>
      </div>
      <h2 class="text-center py-5 text-danger fw-bold" v-if="complaintsNoFound">
        Şikayet Bulunamadı
      </h2>

      <h1 class="text-center py-5 noComplaints fw-bold" v-if="noComplaints">
        Henüz Şikayet Yok
      </h1>

      <h1 class="text-center py-5 text-danger fw-bold" v-if="isLoaded">
        {{ msg }}
      </h1>
      <div class="text-center" v-if="isLoaded && loading">
        <div class="parent-loader">
          <div class="custom-loader"></div>
        </div>
      </div>
      <div v-if="!isErr && complaints.length > 0">
        <DataTable
          @sort="onSort($event)"
          @page="onPage($event)"
          :totalRecords="totalRecords"
          :rows="itemsPerPage"
          :value="complaints"
          paginator
          lazy
          tableStyle="min-width: 50rem"
        >
          <Column
            style="width: 20%"
            field="title"
            header="Başlık"
            sortable
          ></Column>
          <Column
            style="width: 20%"
            field="category"
            header="Kategori"
            sortable
          ></Column>
          <Column
            style="width: 20%"
            field="createdDate"
            header="Tarih"
            sortable
          >
            <template #body="createdDate">
              {{ formatDate(createdDate) }}
            </template></Column
          >

          <Column style="width: 20%" field="status" header="Durum" sortable>
            <template #body="status">
              {{ getStatusMessage(status) }}
            </template>
          </Column>
          <Column
            class="p-sortable-column"
            style="width: 20%; cursor: default"
            header="Daha fazla detay
            "
          >
            <template #body="id">
              <RouterLink
                :to="{ name: 'ComplaintDetails', params: { id: id.data.id } }"
              >
                <Button icon="pi pi-eye" class="eye-icon" aria-label="eye" />
              </RouterLink>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import { defineComponent } from "vue";
import { useCookies } from "vue3-cookies";
import axios from "axios";
import Swal from "sweetalert2";

export default defineComponent({
  components: { DataTable, Column, Dialog },
  data() {
    return {
      isStaff: useCookies().cookies.get("isStaff"),
      cookies: useCookies().cookies,
      complaints: [],
      loading: false,
      complaintsNoFound: false,
      noComplaints: false,
      isErr: true,
      isLoaded: true,
      sortedDataType: null,
      selectedValue: null,
      itemsPerPage: 20,
      totalRecords: 0,
      msg: "",
      statusMessage: "",
    };
  },

  methods: {
    getComplaints(param = "") {
      this.loading = true;
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `${this.API}/api/Complaints/Paging?skip=1&status=${param}`,
            {
              headers: {
                Authorization: `Bearer ${this.isAllow}`,
              },
            }
          );
          this.isLoaded = false;

          this.complaints = response.data.items;
          this.totalRecords = response.data.total;
          if (!response.data.total == 0) {
            this.isErr = false;
          } else if (
            response.data.total == 0 &&
            response.status &&
            this.selectedValue != ""
          ) {
            this.complaintsNoFound = true;
            this.noComplaints = false;
            this.isErr = false;
          } else if (
            response.data.total == 0 &&
            response.status &&
            this.selectedValue == ""
          ) {
            this.noComplaints = true;
          }
          this.loading = false;
        } catch (error) {
          this.isErr = true;
          this.loading = false;
          this.isLoaded = true;
          this.msg = "İşlem sırasında bir hata oluştu";
        }
      }, 400);
    },
    onSort(event) {
      this.loading = true;

      try {
        setTimeout(async () => {
          if (event.sortOrder === -1) {
            this.sortedDataType = "ZA";
          } else if (event.sortOrder === 1) {
            this.sortedDataType = "AZ";
          }
          const response = await axios.get(
            `${this.API}/api/Complaints/Paging?SortField=${event.sortField}&SortType=${this.sortedDataType}&take=${this.itemsPerPage}`,
            {
              headers: {
                Authorization: `Bearer ${this.isAllow}`,
              },
            }
          );

          this.complaints = response.data.items;
          this.totalRecords = response.data.total;
          this.loading = false;
        }, Math.random() * 200 + 150);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      }
    },
    onPage(event) {
      this.loading = true;
      window.scrollTo(0, 0);

      setTimeout(async () => {
        try {
          const response = await axios.get(
            `${this.API}/api/Complaints/Paging?skip=${event.page + 1}&take=${
              this.itemsPerPage
            }&status=${this.selectedValue}`,
            {
              headers: {
                Authorization: `Bearer ${this.isAllow}`,
              },
            }
          );
          this.loading = false;
          this.complaints = response.data.items;
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error.message}`,
          });
        }
      }, 250);
    },
    filterBy() {
      this.loading = true;

      if (this.selectedValue === 0) {
        this.selectedValue = 0;
      } else if (this.selectedValue === 1) {
        this.selectedValue = 1;
      } else if (this.selectedValue === 2) {
        this.selectedValue = 2;
      } else if (this.selectedValue === 3) {
        this.selectedValue = 3;
      } else if (this.selectedValue === null) {
        this.selectedValue = "";
      }

      this.getComplaints(this.selectedValue);
    },
    getStatusMessage(status) {
      if (status.data.status === 0) {
        return "onay bekleniyor";
      } else if (status.data.status === 1) {
        return "Kabul edilmiş";
      } else if (status.data.status === 2) {
        return "Reddedilmiş";
      } else if (status.data.status === 3) {
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
      const date = new Date(dateString.data.createdDate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
  mounted() {
    this.filterBy();
  },
});
</script>

<style lang="scss">
select {
  appearance: none;
  background-color: #167f92;
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
.p-datatable-table {
  border-radius: 10px;
}

.p-datatable-thead {
  tr {
    .p-sortable-column {
      background-color: #167f92 !important;
      margin-left: 5px !important;

      &:first-child {
        border-top-left-radius: 5px !important;
      }
      &:last-child {
        border-top-right-radius: 5px !important;
      }
    }
  }
}

.header-title,
.noComplaints {
  color: #167f92;
}
.eye-icon {
  background-color: #167f92;
  border-color: #167f92;
  transition: 0.3s;
  &:hover {
    box-shadow: 0px 0px 10px 0px #167f92;
    transform: scale(1.05);
  }
}

.p-datatable-tbody {
  .p-row-even {
    background: #eaf3f3;
  }
  .p-row-even,
  .p-row-odd {
    td {
      border-right: 1.5px solid #959a98;
      text-align: center;

      &:last-child {
        border: 0;
      }
    }
  }
}

.p-datatable .p-column-header-content {
  justify-content: center;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 5px;
}

.p-column-title {
  color: white;
}

.p-column-header-content {
  svg {
    color: white;
  }
}

.p-datatable .p-sortable-column.p-highlight .p-sortable-column-icon,
.p-sortable-column.p-highlight .p-column-title {
  color: #161616;
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

.p-button {
  border-radius: 20px !important;
}

.scroll {
  max-height: 70vh;
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

.p-datatable .p-sortable-column:not(.p-highlight):hover {
  background: transparent;
  color: #1e293b;
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

@keyframes s3 {
  100% {
    transform: rotate(1turn);
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
</style>
