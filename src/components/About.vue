<template>
  <div class="about-page">
    <h1 class="title">About vue-network-client</h1> <!-- Page title -->

    <div class="content">
      <div class="card">
        This is a test frontend project "vue-network-client" in VueJs to display data provided by django DRF backend "vue-network".
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  .content {
    height: 400px;
  }

  .card {
    font-size: larger;
    margin-bottom: 25px;
    padding: 50px 0;
  }
</style>
