<template>
  <div class="home-page">
    <h1 class="title">System Detail: {{ this.$route.params.systemId }}</h1> <!-- Page title -->

    <hr>

    <div class="columns">
      <div class="column is-half">
        <h2 class="subtitle">{{ system.name }}</h2>

        <div class="system">
          <div class="card">
            <div class="card-content">
              <div class="content">
                <div>
                  <h5>Areas:</h5>
                  <ol>
                    <li class="areas-list" v-for="area in system.areas">{{ area.address }}</li>
                  </ol>
                </div>
                <hr>
                <div>
                  <h5>Connected Systems:</h5>
                  <ol>
                    <li class="systems-list" v-for="connected_system in system.connected_systems">
                      {{ connected_system.name }}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-half">
        <h2 class="subtitle">System Network Topology</h2>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SystemDetail',
  data () {
    return {
      system: {}
    }
  },
  mounted () {
    this.getSystemDetail() // Call our getSystemDetail function below
  },
  methods: {
    getSystemDetail () {
      axios({
        method: 'get',
        url: `http://localhost:8811/api/v1/systems/${this.$route.params.systemId}`,
        auth: {
          username: 'admin',
          password: 'admin'
        }
      }).then(response => { this.system = response.data })
    }
  }
}
</script>

<style scoped>
  .card-content {
    text-align: left;
  }
  .card { /* Adding some air under the tasks */
    margin-bottom: 25px;
  }
  .areas-list {
    color: blue;
  }
  .systems-list {
    color: forestgreen;
  }
</style>
