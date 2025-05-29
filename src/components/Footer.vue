<template>
    <footer class="footer">
      <p>© 2025 Trendetech Inventory Sync. All rights reserved.</p>


      <!-- <div class="theme-switcher">
        <label for="theme-select">Theme:</label>
        <select id="theme-select" v-model="selectedTheme" @change="applyTheme">
          <option value="light">White</option>
          <option value="gray">Gray</option>
          <option value="dark">Dark</option>
        </select>
      </div> -->
    </footer>
  </template>

  <script>
  export default {
    name: 'Footer',

    // data() {
    //   return {
    //     selectedTheme: localStorage.getItem('theme') || 'light'
    //   }
    // },
    // mounted() {
    //   this.applyTheme()
    // },
    // methods: {
    //   applyTheme() {
    //     document.body.className = ''
    //     document.body.classList.add(theme-${this.selectedTheme})
    //     localStorage.setItem('theme', this.selectedTheme)
    //   }
    // }

  }
  </script>

  <style scoped>
  .footer {
    margin-top: 3rem;
    padding: 1rem;
    text-align: center;
    font-size: 0.9rem;
    color: #000;
    border-top: 1px solid #eee;
  }
  .theme-switcher {
    margin-top: 0.5rem;
  }
  select {
    margin-left: 0.5rem;
    padding: 4px 6px;
  }
  </style>
