<template>
  <div class="login-container">
    <div class="login-box">
      <h2>🔐 Login to TrendETech Hub</h2>
      <form @submit.prevent="login" v-if="!showRegisterForm">
        <div class="form-group">
          <label>Username:</label>
          <input v-model="username" required />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit" class="login-btn">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p class="toggle-text">
          Don't have an account?
          <span class="link" @click="showRegisterForm = true">Sign up here</span>
        </p>
      </form>

      <!-- Wholesaler Registration Form -->
      <form @submit.prevent="register" v-else>
        <h3>📝 Sign Up</h3>
        <div class="form-group">
          <label>Username:</label>
          <input v-model="registerUsername" required />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" v-model="registerEmail" required />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" v-model="registerPassword" required />
        </div>
        <button type="submit" class="login-btn">Register</button>
        <p v-if="registerMsg" class="error">{{ registerMsg }}</p>
        <p class="toggle-text">
          Already have an account?
          <span class="link" @click="showRegisterForm = false">Back to login</span>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../axiosInstance';
import { jwtDecode } from 'jwt-decode';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      showRegisterForm: false,
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      registerMsg: ''
    }
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('/token/', {
          username: this.username,
          password: this.password
        })
        localStorage.setItem('access_token', res.data.access)
        localStorage.setItem('refresh_token', res.data.refresh)
        localStorage.setItem('username', this.username)
        this.$router.push('/')
      } catch (err) {
        this.error = 'Invalid username or password.'
      }
    },
    async register() {
      try {
        await axios.post('/register/', {
          username: this.registerUsername,
          email: this.registerEmail,
          password: this.registerPassword
        })
        this.registerMsg = '✅ Registration successful. Please log in.'
        setTimeout(() => {
          this.showRegisterForm = false
          this.registerMsg = ''
        }, 2000)
      } catch (err) {
        this.registerMsg = '❌ Registration failed. Please try again.'
      }
    }
  }
}
</script>


<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f3f4f6;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
}

.login-box {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #374151;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #374151;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #4f46e5;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #3730a3;
}

.error {
  margin-top: 1rem;
  color: #ef4444;
  font-weight: bold;
}

.toggle-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.link {
  color: #4f46e5;
  cursor: pointer;
  text-decoration: underline;
}

.link:hover {
  text-decoration: none;
}
</style>
