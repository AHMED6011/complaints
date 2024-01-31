<template>
  <main>
    <h1 class="text-center py-5 text-primary">All Complaints</h1>

    <table class="responstable">
      <tr>
        <th>Title</th>
        <th>Category</th>
        <th>Date</th>
        <th>Status</th>
        <th>More Details</th>
      </tr>

      <tr v-for="complaint in complaints" :key="complaint.id">
        <td>{{ complaint.title }}</td>
        <td>{{ complaint.category }}</td>
        <td>{{ formatDate(complaint.createdDate) }}</td>
        <td>
          <span
            class="state"
            :style="{ color: getStatusColor(complaint.status) }"
          >
            {{ getStatusMessage(complaint.status) }}
          </span>
        </td>
        <td>
          <RouterLink
            :to="{ name: 'ComplaintDetails', params: { id: complaint.id } }"
            class="btn btn-info text-dark"
            >Show More Details</RouterLink
          >
        </td>
      </tr>
    </table>
  </main>
</template>

<script>
import { useCookies } from "vue3-cookies";
import { useComplaintsStore } from "@/stores/index";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {
      allComplaints: [],
      Complaints: null,
      cookies: useCookies().cookies,
    };
  },
  methods: {
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
    ...mapActions(useComplaintsStore, ["fetchData", "searchComplaint"]),
  },
  computed: {
    ...mapState(useComplaintsStore, ["complaints", "searchInput"]),
  },

  created() {
    this.fetchData();
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
</style>
