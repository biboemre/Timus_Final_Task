<script>
import Navbar from "../components/Navbar.vue";
export default {
  name: "HomeView",
  props: [],
  components: {
    "Navbar-field": Navbar,
  },
};
</script>

<template>
  <main>
    <Navbar-field name="Emre Şerafettin Bibo" />
  </main>
</template>
