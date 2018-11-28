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

                      <button class="button is-small" @click="removeArea(area.address)" title="Remove current system from this area">
                        <b-icon icon="trash"></b-icon>
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

                      <button class="button is-small" @click="removeConnectedSystem(connected_system.name)" title="Remove this system from connected systems">
                        <b-icon icon="trash"></b-icon>
                      </button>
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

        <div id="network-topology"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import vis from 'vis'

// Below variables required for showing vis network topology
var nodes = {}
var edges = {}
var data = {}
var options = {}

export default {
  name: 'SystemDetail',
  data () {
    return {
      system: {},
      newAreaAddress: '',
      newSystemName: ''
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
      // }).then(response => { this.system = response.data })
      }).then((response) => {
        this.system = response.data
        this.drawNetworkTopology()
      })
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
    },
    removeArea (areaAddress) {
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
          connected_systems: [],
          unlinked_areas: [{address: areaAddress}],
          unlinked_connected_systems: []
        }
      }).then(response => { this.system = response.data })
    },
    removeConnectedSystem (connectedSystemName) {
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
          connected_systems: [],
          unlinked_areas: [],
          unlinked_connected_systems: [{name: connectedSystemName}]
        }
      }).then(response => { this.system = response.data })
    },
    drawNetworkTopology () {
      var tempNetworkData = []
      var tempNetworkEdgeData = []
      var networkItemsCount = 0

      // Add current system and make it edges with all areas and connected systems
      tempNetworkData.push({
        id: networkItemsCount,
        label: 'Current System #' + this.system.name,
        shape: 'star',
        color: {background: 'coral'}
      })
      networkItemsCount += 1

      this.system.areas.forEach(function (area) {
        tempNetworkData.push({
          id: networkItemsCount,
          label: 'Area #' + area.address,
          shape: 'circle',
          color: {background: 'cornflowerblue'}
        })
        tempNetworkEdgeData.push({
          from: 0,
          to: networkItemsCount
        })
        networkItemsCount += 1
      })

      this.system.connected_systems.forEach(function (system) {
        tempNetworkData.push({
          id: networkItemsCount,
          label: 'CS# ' + system.name,
          shape: 'diamond',
          color: {background: 'forestgreen'}
        })
        tempNetworkEdgeData.push({
          from: 0,
          to: networkItemsCount
        })
        networkItemsCount += 1
      })
      // create an array with network nodes
      nodes = new vis.DataSet(tempNetworkData)
      // create an array with network edges
      edges = new vis.DataSet(tempNetworkEdgeData)

      // provide the data in the vis format:
      data = {
        nodes: nodes,
        edges: edges
      }

      // initialize your network!
      new vis.Network(
        document.getElementById('network-topology'), data, options
      )
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
    color: cornflowerblue;
  }

  ol {
    font-size: 20px;
  }
  .systems-list {
    color: forestgreen;
  }
  #network-topology {
    display: block;
    width: 100%;
    height: 600px;
    border: solid;
    background-color: white;
  }
</style>
