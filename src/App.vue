<template>
  <div id="app">
    <a class="header-logo" href="/">
      <img src="./assets/logo.png">
    </a>
    <div><a href="/#/about">Read more about this site.</a></div>

    <router-view/>

    <footer id="footer" class="ft">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="copyright-text text-center">
              <p>&copy; {{ new Date().getFullYear() }} All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <!--/#footer-->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .header-logo img {
    height: 100px;
  }

  #footer {
    width: 100%;
    padding: 25px 0px;
    background-color: gainsboro;
  }
</style>
