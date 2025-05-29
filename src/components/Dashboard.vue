<!--
<template>
  <div>
    <h2>📊 Dashboard</h2>
    <p>Total SKUs: {{ inventory.length }}</p>
    <p>Total Stock: {{ totalStock }}</p>
    <p>In Sales: {{ inSales }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      inventory: []
    }
  },
  computed: {
    totalStock() {
      return this.inventory.reduce((sum, item) => sum + Number(item.total_sales_stock), 0)
    },
    inSales() {
      return this.inventory.filter(i => i.status === 'In sales').length
    }
  },
  mounted() {
    axios.get('http://127.0.0.1:8000/api/inventory/')
      .then(res => {
        this.inventory = res.data
      })
      .catch(err => {
        console.error("Dashboard fetch error:", err)
      })
  }
}
</script>

<style scoped>
h2 {
  margin-top: 2rem;
  color: #2b6cb0;
}
p {
  margin-bottom: 0.5rem;
}
</style>
-->