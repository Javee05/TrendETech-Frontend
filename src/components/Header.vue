<!-- Developed by: Floren Javee v. Cruz -->
<!--                 Adam Jared F. Ranon -->
<!--                 March 2025 - June 2025 -->


<template>
  <header class="custom-header">
    <div class="header-left">
      <span class="app-logo">💻🖥</span>
      <span class="app-title">TrendETech Hub</span>
    </div>

    <nav class="header-nav">
       <router-link to="/" exact-active-class="active-link">Home</router-link>
      <router-link to="/products" exact-active-class="active-link">Products</router-link>
    <!--- <router-link to="/inventory" exact-active-class="active-link">Inventory</router-link>
      <router-link to="/reports" exact-active-class="active-link">Reports</router-link>
      <router-link to="/help" exact-active-class="active-link">Help</router-link>-->
    </nav>

    <div class="header-right">
     <!-- 🔔 Notifications Bell with Hover Dropdown -->
<div class="dropdown">
  <span class="alert-icon">
    🔔
    <span class="badge" v-if="unreadCount">{{ unreadCount }}</span>
  </span>
  <div class="dropdown-menu">
    <div v-if="notifications.length === 0" class="dropdown-item">No notifications</div>
    <div v-for="n in notifications" :key="n.id" class="dropdown-item">
      {{ n.message }}
    </div>
  </div>
</div>
      <!--<span class="theme-toggle" @click="toggleTheme">
        {{ darkMode ? '☀️' : '🌙' }} 
      </span> -->
      <!-- 👤 User Menu with Hover Dropdown -->
<div class="dropdown">
  <span class="dropdown-toggle">Welcome, {{ username }} ⯆</span>
  <div class="dropdown-menu">
    <router-link to="/profile">My Profile</router-link>
    <button @click="logout">Logout</button>
  </div>
</div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem('username') || 'User',
      darkMode: false,
      notifications: [],
      unreadCount: 0,
      showDropdown: false
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark-mode');
    }
    this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      try {
        // Import your axios instance if not using this.$axios
        const axiosInstance = this.$axios || (await import('../axiosInstance')).default;
        const res = await axiosInstance.get('/notifications/');
        this.notifications = res.data;
        this.unreadCount = res.data.filter(n => !n.is_read).length;
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      document.body.classList.toggle('dark-mode', this.darkMode);
    }
  }
};
</script>

<style scoped>
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f2d3d;
  color: #fff;
  padding: 1rem 2rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.header-nav a,
.header-nav .router-link-active,
.header-nav .active-link {
  color: #fff;
  margin: 0 0.75rem;
  text-decoration: none;
}

.header-nav a:hover,
.header-nav .router-link-active:hover,
.header-nav .active-link:hover {
  text-decoration: underline;
}

.active-link {
  font-weight: bold;
  border-bottom: 2px solid #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.alert-icon {
  position: relative;
  cursor: pointer;
  font-size: 1.25rem;
}

.badge {
  background: red;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 50%;
  position: absolute;
  top: -8px;
  right: -10px;
}

.theme-toggle {
  cursor: pointer;
}

.user-menu {
  position: relative;
}

/* Dropdown wrapper */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Toggle */
.dropdown-toggle {
  cursor: pointer;
  padding: 6px 10px;
  font-weight: 500;
  color: #ffffff;
}

/* Dropdown menu */
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: rgb(31, 45, 61);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-width: 200px;
  z-index: 999;
}

/* Show on hover */
.dropdown:hover .dropdown-menu {
  display: block;
}

/* Dropdown links and buttons */
.dropdown-menu a,
.dropdown-menu button {
  font-size: 16px;       
  font-weight: 500;      
  padding: 14px 18px;    
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f0f0f0; /* ✅ light text for dark bg */
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  transition: background 0.2s ease;
}

/* Hover effects */
.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background-color: #3a4b5c; /* darker hover */
}

/* Optional icons */
.dropdown-menu a::before {
  content: '👤';
}
.dropdown-menu button::before {
  content: '🚪';
}

.dropdown-menu {
  min-width: 180px;
}
/* DARK MODE STYLES TEMPORARILY DISABLED

:global(body.dark-mode) {
  background-color: #413939;
  color: #000000;
}

:global(body.dark-mode) .custom-header {
  background-color: #2b2f3a;
  color: #ffffff;
}

:global(body.dark-mode) .header-nav a {
  color: #e0e0e0;
}

:global(body.dark-mode) .header-nav a:hover {
  color: #ffffff;
  text-decoration: underline;
}

:global(body.dark-mode) .user-menu span {
  color: #ffffff;
}

:global(body.dark-mode) .header-right button {
  background-color: #444;
  color: #fff;
  border: none;
}

:global(body.dark-mode) .theme-toggle {
  color: #fff;
}

.custom-header,
.header-nav a,
.user-menu span,
.header-right button {
  transition: all 0.3s ease;
}

:global(body.dark-mode) thead th {
  background-color: #2f3640;
  color: #f1f1f1;
}

:global(body.dark-mode) .inventory-table thead th {
  background-color: #2f3640;
  color: #f1f1f1;
}

*/


thead th {
  transition: background-color 0.3s, color 0.3s;
}

:global(body.dark-mode) thead th {
  background-color: #2f3640; /* dark background for header */
  color: #f1f1f1;            /* light text for visibility */
}
:global(body.dark-mode) .inventory-table thead th {
  background-color: #2f3640;
  color: #f1f1f1;
}



</style>