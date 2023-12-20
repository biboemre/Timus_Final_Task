<script>
import Navbar from "../components/Navbar.vue";

export default {
  name: "Login",
  props: [],
  components: {
    "Navbar-field": Navbar,
  },
  data() {
    return {
      userName: "",
      password: "",
    };
  },
  async mounted() {},
  methods: {
    validateUsername() {
      // Kullanıcı adı 8 karakterden az ise veya numerik karakter içeriyorsa alert göster
      if (this.userName.length < 8 || /\d/.test(this.userName)) {
        alert("Kullanıcı adı en az 8 karakter olmalıdır");
        return;
      } else {
        return true;
      }
    },
    validatePassword() {
      // Şifre en az 8 karakter içermeli, en az bir rakam ve bir büyük harf içermeli
      const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (regex.test(this.password)) {
        return true;
      } else {
        alert(
          "Şifre geçersiz! En az 8 karakter, bir rakam ve bir büyük harf içermelidir."
        );
        return;
      }
    },

    Login() {
      if (!this.validateUsername()) return;
      if (!this.validatePassword()) return;
      this.$router.push("/home");
    },
  },
};
</script>

<template>
  <Navbar-field name="" />
  <main class="container">
    <section class="vh-100">
      <div class="container-fluid h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              class="img-fluid"
              alt="Sample image"
            />
          </div>
          <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <h1 class="text-start mb-5">Login</h1>

            <form>
              <!-- Email input -->
              <div class="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  class="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  v-model="userName"
                />
              </div>

              <!-- Password input -->
              <div class="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example4"
                  class="form-control form-control-lg"
                  placeholder="Enter password"
                  v-model="password"
                />
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <!-- Checkbox -->
                <div class="form-check mb-0">
                  <input
                    class="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                  />
                  <label class="form-check-label" for="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="/register" class="text-body">Register!</a>
              </div>

              <div class="text-center text-lg-start mt-4 pt-2">
                <button
                  type="button"
                  class="btn btn-primary btn-lg"
                  style="padding-left: 2.5rem; padding-right: 2.5rem"
                  @click="Login"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
