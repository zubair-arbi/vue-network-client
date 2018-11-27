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
                  <h5>
                    Areas:
                    <section id="new-area-form" class="column">
                      <b-field>
                        <b-input v-model.number="newAreaAddress" placeholder="4004"></b-input>
                        <p class="control">
                          <button class="button is-primary" @click="addNewArea">Add New Area</button>
                        </p>
                      </b-field>
                    </section>
                  </h5>
                  <ol id="areas-list">
                    <li class="areas-list" v-for="area in system.areas" :key="area.id">
                      {{ area.address }}

                      <button class="button is-small" click="removeItem(index)">
                        <b-icon icon="trash"></b-icon>
                        <span>Remove system from this area</span>
                      </button>
                    </li>
                  </ol>
                </div>
                <hr>
                <div>
                  <h5>Connected Systems:</h5>
                  <section id="new-system-form" class="column">
                    <b-field>
                      <b-input v-model="newSystemName" placeholder="New-System-Name-401-1" width="200px"></b-input>
                    </b-field>
                    <button class="button is-primary" @click="addNewSystem">Add New System</button>
                  </section>
                  <ol>
                    <li class="systems-list" v-for="connected_system in system.connected_systems" :key="connected_system.id">
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
      system: {},
      newAreaAddress: ''
    }
  },
  mounted () {
    this.getSystemDetail() // Call our getSystemDetail function below
  },
  methods: {
    getSystemDetail () {
      axios({
        method: 'get',
        url: `http://localhost:8811/api/v1/systems/${this.$route.params.systemId}/`,
        auth: {
          username: 'admin',
          password: 'admin'
        }
      }).then(response => { this.system = response.data })
    },
    addNewArea () {
      if (this.newAreaAddress === '') return
      if (Number(this.newAreaAddress) < 1) return
      axios({
        method: 'put',
        url: `http://localhost:8811/api/v1/systems/${this.$route.params.systemId}/`,
        auth: {
          username: 'admin',
          password: 'admin'
        },
        data: {
          name: this.system.name,
          areas: [{'address': this.newAreaAddress}],
          connected_systems: []
        }
      }).then(response => { this.system = response.data })

      // Finally empty the field
      this.newAreaAddress = ''
    },
    addNewSystem () {
      if (this.newSystemName === '') return
      axios({
        method: 'put',
        url: `http://localhost:8811/api/v1/systems/${this.$route.params.systemId}/`,
        auth: {
          username: 'admin',
          password: 'admin'
        },
        data: {
          name: this.system.name,
          areas: [],
          connected_systems: [{name: this.newSystemName}]
        }
      }).then(response => { this.system = response.data })
      // Finally empty the field
      this.newSystemName = ''
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

  ol {
    font-size: 20px;
  }
  .systems-list {
    color: forestgreen;
  }
</style>
