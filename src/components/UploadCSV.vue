<!--
<template>
    <div class="upload-container">
      <h2>📤 Upload Inventory CSV</h2>
      <input type="file" @change="handleFileUpload" accept=".csv" />
      <button @click="submitFile" :disabled="!file">Upload</button>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        file: null,
        message: ''
      }
    },
    methods: {
      handleFileUpload(event) {
        this.file = event.target.files[0]
      },
      async submitFile() {
        const formData = new FormData()
        formData.append('csv_file', this.file)
  
        try {
          const response = await axios.post('http://127.0.0.1:8000/admin/inventory/inventory/upload-csv/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          this.message = '✅ CSV uploaded successfully!'
        } catch (error) {
          console.error(error)
          this.message = '❌ Upload failed.'
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .upload-container {
    padding: 2rem;
    text-align: center;
  }
  </style>
  

  -->
  