<template>
  <div>
    <Header/>

    <!-- Search and Filter -->
    <div class="search-filter">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search SKU or Name"
        class="search-input"
      />
      <!-- Removed the status dropdown menu -->
    </div>

    <!-- Inventory Table -->
    <div class="table-container">
      <div v-if="loading" class="loading-indicator">Loading...</div>
      <table v-else-if="filteredInventory.length" class="inventory-table">
        <thead>
          <tr>
            <th>#</th>
            <th @click="sortTable('sku')" title="Sort by SKU">SKU <span :class="getSortIndicator('sku')"></span></th>
            <th @click="sortTable('name')" title="Sort by Name">Name <span :class="getSortIndicator('name')"></span></th>
            <th>Category</th>
            <th @click="sortTable('total_sales_stock')" title="Sort by Stock">Stock <span :class="getSortIndicator('total_sales_stock')"></span></th>
            <th>Wholesale Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedInventory" :key="item.sku">
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td @click="copyToClipboard(item.sku)" class="clickable">{{ item.sku }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.parent_category }}</td>
            <td :class="getStockClass(item.total_sales_stock)">{{ item.total_sales_stock }}</td>
            <td>{{ formatPrice(item.wholesale_price) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="inventory.length === 0" class="empty-message">📭 No inventory items found. Try uploading or adding new items.</p>
      <p v-else-if="filteredInventory.length === 0" class="empty-message">🔍 No matching items found for your search or filter.</p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredInventory.length" class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
    </div>

<!-- Export Section -->
<div class="export-section">
  <div class="export-box">
    <h3>📄 Export Pricelist (PDF)</h3>
    <button @click="exportLowStock" class="action-btn">Download PDF</button>
  </div>
</div>

<Footer />
</div> <!-- Make sure this closes your top-level <div> -->
</template>

<script>
import axios from '../axiosInstance';

// import axios from 'axios'
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import { saveAs } from 'file-saver';

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      inventory: [],
      searchQuery: '',
      statusFilter: '',
      file: null, 
      message: '',
      form: {
        sku: '',
        name: '',
        status: '',
        parent_category: '',
        sub_category: '',
        total_sales_stock: 0
      },
      formMessage: '',
      isSuccess: false,
      exportFormat: '',
      sortKey: 'sku',
      sortOrder: 'asc',
      loading: false,
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    filteredInventory() {
      try {
        return this.inventory
          .filter(item => {
            const query = this.searchQuery.toLowerCase();
            const matchesSearch = item.sku.toLowerCase().includes(query) || item.name.toLowerCase().includes(query);
            const matchesStatus = this.statusFilter === '' || item.status === this.statusFilter;
            return matchesSearch && matchesStatus;
          })
          .sort((a, b) => {
            const valA = a[this.sortKey] ?? '';
            const valB = b[this.sortKey] ?? '';
            if (typeof valA === 'number' && typeof valB === 'number') {
              return this.sortOrder === 'asc' ? valA - valB : valB - valA;
            } else {
              return this.sortOrder === 'asc'
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
            }
          });
      } catch (e) {
        console.error('Error in filteredInventory:', e); // Log any errors
        return []; // Return an empty array in case of an error
      }
    },
    paginatedInventory() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredInventory.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredInventory.length / this.itemsPerPage);
    },
    totalStock() {
      return this.inventory.reduce((sum, item) => sum + item.total_sales_stock, 0);
    },
    inSales() {
      return this.inventory.filter(item => item.status === 'In sales').length;
    }
  },
  methods: {
    async fetchInventory() {
      this.loading = true;
      const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/inventory/', {
          headers: {
            Authorization: `Bearer ${token}` // Attach the token to the Authorization header
          }
        });

        console.log('API response:', response.data); // Debug: see the full response
        this.inventory = response.data.results || response.data; // Works for both paginated and non-paginated

      } catch (error) {
        console.error('Error fetching inventory:', error); // Log any errors
        console.error('Error response data:', error.response?.data); // Log error response data if available
        if (error.response && error.response.status === 401) {
          this.$router.push('/login'); // Redirect to login if unauthorized
        }
      } finally {
        this.loading = false; // Stop the loading indicator
      }
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
  
    async submitFile() {
      const formData = new FormData();
      formData.append('csv_file', this.file);
  
      try {
        await axios.post('http://127.0.0.1:8000/admin/inventory/inventory/upload-csv/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.message = '✅ CSV uploaded successfully!';
        this.fetchInventory(); // Refresh data
        this.sortKey = this.sortKey || 'total_sales_stock'; // Ensure sortKey persists
        this.sortOrder = this.sortOrder || 1; // Ensure sortOrder persists
      } catch (error) {
        console.error(error);
        this.message = '❌ Upload failed.';
      }
    },
    async submitForm() {
      try {
        await axios.post('http://127.0.0.1:8000/api/inventory/', this.form)
        this.formMessage = '✅ Item added successfully!'
        this.isSuccess = true
        this.fetchInventory()
        this.resetForm()
  
        // Auto-clear the message after 3 seconds
        setTimeout(() => {
          this.formMessage = '';
        }, 3000);
      } catch (error) {
        console.error(error)
        this.formMessage = '❌ Failed to add item.'
        this.isSuccess = false
  
        // Auto-clear the message after 3 seconds
        setTimeout(() => {
          this.formMessage = '';
        }, 3000);
      }
    },
    resetForm() {
      if (this.form.sku || this.form.name || this.form.status || this.form.parent_category || this.form.sub_category || this.form.total_sales_stock) {
        if (!confirm("Clear form? Unsaved changes will be lost.")) return
      }
      this.form = {
        sku: '',
        name: '',
        status: '',
        parent_category: '',
        sub_category: '',
        total_sales_stock: 0
      }
    },
    getStockClass(stock) {
      if (stock <= 10) {
        return 'critical-stock'; // Red for critical stock
      } else if (stock <= 20) {
        return 'low-stock'; // Yellow for low stock
      } else {
        return 'moderate-stock'; // Green for moderate to full stock
      }
    },
    copyToClipboard(sku) {
      navigator.clipboard.writeText(sku)
        .then(() => {
          alert(`SKU ${sku} copied to clipboard!`);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          alert('❌ Failed to copy SKU to clipboard.');
        });
    },

    exportLowStock() {
  const url = 'http://127.0.0.1:8000/api/inventory/low-stock.pdf/';
  window.open(url, '_blank'); // Triggers PDF download

    },
    formatPrice(value) {
      return value ? Number(value).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }) : '-';
    },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle between ascending and descending
      } else {
        this.sortKey = key; // Set the new sort key
        this.sortOrder = 'asc'; // Default to ascending
      }
    },
    getSortIndicator(key) {
      if (this.sortKey !== key) return ''; // Return an empty string if the key is not the current sort key
      return this.sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'; // Return the appropriate class based on sort order
    },
    confirmLogout() {
      if (confirm('Are you sure you want to logout?')) {
        this.logout();
      }
    },
    logout() {
      localStorage.removeItem('access_token'); // Remove the token from localStorage
      this.$router.push('/login'); // Redirect to the login page
    },
    
  },
  mounted() {
    this.fetchInventory();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&family=Roboto:ital,wght@0,900;1,900&display=swap');@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
  font-family: 'Roboto', sans-serif !important; /* Force Roboto font globally */
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f9fafb;
  border-bottom: 1px solid #ddd;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.logout-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #dc2626;
}

.loading-indicator {
  text-align: center;
  font-size: 1.2rem;
  margin: 20px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.pagination button {
  padding: 10px 20px;
  border: none;
  background-color: #4f46e5;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.search-filter {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.search-input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.table-container {
  margin: 20px auto;
  max-width: 100%;
  overflow-x: auto;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.inventory-table th,
.inventory-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.inventory-table th {
  background-color: #f3f4f6;
  cursor: pointer;
  position: sticky;
  top: 0;
  z-index: 1;
}

.inventory-table th:hover {
  background-color: #e5e7eb;
}

.inventory-table tr:hover {
  background-color: #f3f4f6;
}

.empty-message {
  text-align: center;
  color: #6b7280;
  margin: 20px 0;
}

.action-section {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
}

.action-box {
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #ffffff;
  text-align: center;
}

.file-input {
  margin: 10px 0;
}

.action-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #3730a3;
}

.action-message {
  margin-top: 10px;
  color: #10b981;
}

.form-section {
  margin: 20px 0;
}

.inventory-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.form-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item label {
  font-weight: 600;
  color: #374151;
}

.form-item input,
.form-item select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}

.action-btn {
  align-self: flex-end;
  margin-top: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.success {
  color: #10b981;
}

.error {
  color: #ef4444;
}


.center-btn {
  width: 200px;
  margin: 20px auto 0;
  display: block;
}

.sort-asc::after {
  content: ' 🔼';
}
.sort-desc::after {
  content: ' 🔽';
}
.export-section {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.export-box {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  text-align: center;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.critical-stock {
  background-color: #f8d7da; /* Light red */
  color: #721c24; /* Dark red text */
  font-weight: bold;
}

.low-stock {
  background-color: #fff3cd; /* Light yellow */
  color: #856404; /* Dark yellow text */
  font-weight: bold;
}

.moderate-stock {
  background-color: #d4edda; /* Light green */
  color: #155724; /* Dark green text */
  font-weight: bold;
}

</style>