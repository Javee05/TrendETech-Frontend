<template>
  <div class="form-container">
    <h2>➕ Add / Edit Inventory</h2>
    <form @submit.prevent="submitForm">
      <label>SKU:</label>
      <input type="text" v-model="form.sku" required />

      <label>Name:</label>
      <input type="text" v-model="form.name" required />

      <label>Status:</label>
      <select v-model="form.status" required>
        <option disabled value="">Select status</option>
        <option>In sales</option>
        <option>Out of stock</option>
        <option>Discontinued</option>
      </select>

      <label>Parent Category:</label>
      <input type="text" v-model="form.parent_category" />

      <label>Sub Category:</label>
      <input type="text" v-model="form.sub_category" />

      <label>Total Sales Stock:</label>
      <input type="number" v-model="form.total_sales_stock" required />

      <button type="submit">✅ Submit</button>
    </form>

    <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">
      {{ message }}
    </p>
  </div>
</template>

<script>

import axios from '../js/axiosInstance';
// import axios from 'axios'

export default {
  data() {
    return {
      form: {
        sku: '',
        name: '',
        status: '',
        parent_category: '',
        sub_category: '',
        total_sales_stock: 0
      },
      message: '',
      isSuccess: false
    }
  },
  methods: {
    submitForm() {
      axios.post('http://127.0.0.1:8000/api/inventory/', this.form)
        .then(() => {
          this.message = '✅ Inventory item submitted successfully!'
          this.isSuccess = true
          this.resetForm()
        })
        .catch(error => {
          console.error(error)
          this.message = '❌ Failed to submit item'
          this.isSuccess = false
        })
    },
    resetForm() {
      this.form = {
        sku: '',
        name: '',
        status: '',
        parent_category: '',
        sub_category: '',
        total_sales_stock: 0
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  margin-top: 2rem;
  max-width: 500px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 0.5rem;
  font-weight: bold;
}

input,
select {
  padding: 8px;
  margin-top: 0.25rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

button {
  margin-top: 1rem;
  padding: 10px;
  background-color: #38a169;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2f855a;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
