<script setup>
import { RouterLink, RouterView } from "vue-router";
// import Navbar from "./components/Navbar.vue";
import Login from "./views/LoginView.vue";

</script>

<template>
  <!-- <Navbar /> -->
<!-- <Login/> -->
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <RouterView />
</template>

<style scoped></style>
