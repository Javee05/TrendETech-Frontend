<template>
    <div v-if="lowStockItems.length > 0">
      <h3>⚠️ Low Stock Alerts</h3>
      <ul>
        <li v-for="item in lowStockItems" :key="item.sku">
          {{ item.name }} (Remaining: {{ item.total_sales_stock }})
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const lowStockItems = ref([]);
  
  const loadLowStock = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/inventory/low-stock/');
      const data = await res.json();
      lowStockItems.value = data;
    } catch (error) {
      console.error("Failed to fetch low stock items:", error);
    }
  };
  
  onMounted(() => {
    loadLowStock();
  });
  </script>
  