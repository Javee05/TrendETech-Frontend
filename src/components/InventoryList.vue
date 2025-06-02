<!-- Developed by: Floren Javee v. Cruz -->
<!--                 Adam Jared F. Ranon -->
<!--                 March 2025 - June 2025 -->



<script>

import axios from '../js/axiosInstance';
const api = import.meta.env.VITE_API_BASE_URL;


//import axios from 'axios'

export default {
  data() 
    return {
      inventory: []
    }
  },
  mounted() {
    axios.get(`${api}/api/inventory/`)
      .then(response => {
        this.inventory = response.data; // <-- Set data here
      })
      .catch(error => {
        console.error("Error fetching inventory:", error);
      });
  }

</script>