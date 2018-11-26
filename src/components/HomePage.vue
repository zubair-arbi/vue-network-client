<template>
  <div class="home-page">
    <h1 class="title">Vue Network Client</h1> <!-- Page title -->

    <hr>

    <div class="columns">
      <div class="column is-half">
        <h2 class="subtitle">Systems</h2>

        <div class="system">
          <div class="card" v-for="system in systems"> <!-- Loop through the systems array, if status is 0 (to do) then we'll show it. -->
            <div class="card-content">
              <div class="content">
                <h5 class="system-title" @click="systemDetail(system.id)" >{{ system.name }}</h5>
                <div>
                  <b>Areas:</b>
                  <span v-for="area in system.areas">{{ area.address }}, </span>
                </div>
                <div>
                  <b>Connected Systems:</b>
                  <li v-for="connected_system in system.connected_systems">{{ connected_system.name }}</li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-half">
        <h2 class="subtitle">Areas</h2>

        <div class="done">
          <div class="card" v-for="area in areas"> <!-- Loop through the areas array, if status is 1 (done) then we'll show it. -->
            <div class="card-content">
              <div class="content">
                {{ area.address }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomePage',
  data () {
    return {
      areas: [], // Array for holding the areas
      systems: [] // Array for holding the systems
    }
  },
  mounted () { // This will be called when HomePage is loaded
    this.getAreas() // Call our getAreas function below
    this.getSystems() // Call our getSystems function below
  },
  methods: {
    getAreas () {
      axios({
        method: 'get',
        url: 'http://localhost:8811/api/v1/areas/',
        auth: {
          username: 'admin',
          password: 'admin'
        }
      }).then(response => { this.areas = response.data })
    },
    getSystems () {
      axios({
        method: 'get',
        url: 'http://localhost:8811/api/v1/systems/',
        auth: {
          username: 'admin',
          password: 'admin'
        }
      }).then(response => { this.systems = response.data })
    },
    systemDetail (systemId) {
      this.$router.push({ name: 'systemDetail', params: { systemId: systemId } })
    }
  }
}
</script>

<style scoped>
  .select, select { /* 100% width for the select */
    width: 100%;
  }

  .system-title {
    font-weight: bold;
    color: coral;
  }
  .system-title:hover {
    COLOR: chocolate;
    TEXT-DECORATION: underline;
    cursor: pointer;
  }

  .card { /* Adding some air under the tasks */
    margin-bottom: 25px;
  }

  .done { /* Make the done tasks a little bit transparent */
    opacity: 0.3;
  }
</style>
