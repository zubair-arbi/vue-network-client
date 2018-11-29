<template>
  <div class="home-page">
    <h1 class="title">Vue Network Client</h1> <!-- Page title -->

    <hr>

    <div class="columns">
      <div class="column is-half">
        <h2 class="subtitle">All Network Systems</h2>

        <div class="system">
          <div class="card" v-for="system in systems" :key="system.id"> <!-- Loop through the systems array, if status is 0 (to do) then we'll show it. -->
            <div class="card-content">
              <div class="content">
                <h5 class="system-title" @click="systemDetail(system.id)" >{{ system.name }}</h5>
                <div>
                  <b>Areas:</b>
                  <span v-for="area in system.areas" :key="area.id">{{ area.address }}, </span>
                </div>
                <div>
                  <b>Connected Systems:</b>
                  <li v-for="connected_system in system.connected_systems" :key="connected_system.id">
                    {{ connected_system.name }}
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-half">
        <h2 class="subtitle">All Network Areas</h2>

        <div class="done">
          <div class="card area-card" v-for="area in areas" :key="area.id"> <!-- Loop through the areas array, if status is 1 (done) then we'll show it. -->
            <div class="card-content">
              <div class="content">
                <p class="area-title" @click="areaDetail(area.id)" >{{ area.address }}</p>
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
    },
    areaDetail (areaId) {
      this.$router.push({ name: 'areaDetail', params: { areaId: areaId } })
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
  .area-title {
    font-weight: bold;
    color: cornflowerblue;
  }
  .area-title:hover {
    COLOR: royalblue;
    TEXT-DECORATION: underline;
    cursor: pointer;
  }
  .card { /* Adding some air under the tasks */
    margin-bottom: 25px;
  }
</style>
