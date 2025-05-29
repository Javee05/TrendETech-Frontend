<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>👤 My Profile</h2>
      <div v-if="successMsg" class="toast">{{ successMsg }}</div>
      <form @submit.prevent="saveProfile" class="profile-form">
        <div class="form-row">
          <label>First Name:</label>
          <input v-model="profile.first_name" type="text" />
        </div>
        <div class="form-row">
          <label>Last Name:</label>
          <input v-model="profile.last_name" type="text" />
        </div>
        <div class="form-row">
          <label>Email:</label>
          <input v-model="profile.email" type="email" />
        </div>
        <div class="form-row">
          <label>Company Name:</label>
          <input v-model="profile.company_name" type="text" />
        </div>
        <div class="form-row">
          <label>Mobile:</label>
          <input v-model="profile.mobile" type="text" />
        </div>
        <div class="form-row">
          <label>Address:</label>
          <textarea v-model="profile.address" rows="3"></textarea>
        </div>
        <div class="form-row">
          <label>Notes:</label>
          <textarea v-model="profile.notes" rows="3"></textarea>
        </div>
        <div class="form-row">
          <label>Upload Avatar:</label>
          <div class="avatar-preview" v-if="profile.avatar || avatarPreview">
            <img :src="avatarPreview || profile.avatar" alt="Avatar" style="max-width:80px;max-height:80px;border-radius:50%;margin-bottom:10px;" />
          </div>
          <input type="file" accept="image/*" @change="onFileChange" />
        </div>
        <div class="form-footer">
          <button type="submit">💾 Save Changes</button>
          <span class="last-login">🕒 Last Login: {{ profile.last_login }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../axiosInstance'

export default {
  data() {
    return {
      profile: {},
      avatarFile: null,
      avatarPreview: null,
      successMsg: '',
    }
  },
  async mounted() {
    const res = await axios.get('/me/')
    this.profile = res.data
  },
  methods: {
    async saveProfile() {
      const formData = new FormData();
      for (const key in this.profile) {
        if (key !== 'avatar') {
          formData.append(key, this.profile[key]);
        }
      }
      if (this.avatarFile) {
        formData.append('avatar', this.avatarFile);
      }

      try {
        await axios.put('/me/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.successMsg = '✅ Profile updated!';
        setTimeout(() => this.successMsg = '', 3000);
        // Optionally update avatar preview after upload
        if (this.avatarFile) {
          this.profile.avatar = this.avatarPreview;
        }
      } catch (err) {
        console.error('Failed to save:', err);
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.avatarFile = file;
      if (file) {
        this.avatarPreview = URL.createObjectURL(file);
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background: #f9fafb;
}

.profile-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
  text-align: center;
}

.profile-form .form-row {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

.profile-form label {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.profile-form input,
.profile-form textarea {
  font-size: 1rem;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  transition: border 0.2s;
}

.profile-form input:focus,
.profile-form textarea:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #3730a3;
}

.last-login {
  font-size: 0.9rem;
  color: #6b7280;
}

.success-message {
  margin-top: 1rem;
  padding: 10px;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 6px;
  text-align: center;
}

.toast {
  margin-bottom: 1rem;
  padding: 10px;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
}
.toast {
  background-color: #10b981;
  color: white;
  padding: 10px 20px;
  margin-bottom: 15px;
  text-align: center;
  border-radius: 6px;
  font-weight: 600;
}
.avatar-preview {
  margin-bottom: 10px;
  text-align: left;
}
.avatar-preview img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 2px solid #4f46e5;
}
</style>
