<!--
<template>
    <div class="summary-container">
      <div class="card">
        <div class="card-icon">📦</div>
        <div class="card-title">Total SKUs</div>
        <div class="card-value">{{ totalSKUs }}</div>
      </div>
      <div class="card">
        <div class="card-icon">📊</div>
        <div class="card-title">Total in Stock</div>
        <div class="card-value">{{ totalStock }}</div>
      </div>
      <div class="card">
        <div class="card-icon">🛒</div>
        <div class="card-title">In Sales</div>
        <div class="card-value">{{ inSales }}</div>
      </div>
      <div class="card">
  <div class="card-icon">💰</div>
  <div class="card-title">Revenue</div>
  <div class="card-value">
    {{ revenue !== null ? formatCurrency(revenue) : '--' }}
  </div>
</div>

      
    </div>
  </template>
  
  <script>
  export default {
    props: ['totalSKUs', 'totalStock', 'inSales', 'revenue'],
    methods: {
      formatCurrency(value) {
        return Number(value).toLocaleString('en-PH', {
          style: 'currency',
          currency: 'PHP'
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .summary-container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 1.5rem auto;
    flex-wrap: wrap;
    max-width: 1000px;
  }
  
  .card {
    flex: 1;
    min-width: 200px;
    background: #fff;
    border-radius: 12px;
    padding: 1.2rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    text-align: center;
    border-top: 5px solid #6c63ff;
  }
  
  .card-icon {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
  
  .card-title {
    font-weight: 600;
    color: #555;
    margin-bottom: 0.25rem;
  }
  
  .card-value {
    font-size: 1.6rem;
    font-weight: bold;
    color: #2d3748;
  }
  </style>

  -->
  