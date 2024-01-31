<template>
  <main>
    <HeaderView />

    <RouterView />
  </main>
</template>

<script>
import HeaderView from "./components/HeaderView.vue";
import { RouterView } from "vue-router";

export default {
  components: { HeaderView, RouterView },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
