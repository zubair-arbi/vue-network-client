<template>
  <div class="home-page">
    <h1 class="title">Area Detail: {{ this.$route.params.areaId }}</h1> <!-- Page title -->

    <hr>

    <div class="columns">
      <div class="column is-half">
        <h2 class="subtitle">Area Address: {{ area.address }}</h2>

        <div class="system">
          <div class="card">
            <div class="card-content">
              <div class="content">
                <div>
                  <h5>Connected Systems: {{ area.connected_systems.length }}</h5>
                  <section id="new-system-form" class="column">
                    <b-field>
                      <b-input v-model="newSystemName" placeholder="New-System-Name-401-1" width="200px"></b-input>
                    </b-field>
                    <button class="button is-primary" @click="addNewSystem">Add New System</button>
                  </section>
                  <ol>
                    <li class="systems-list" v-for="connected_system in area.connected_systems" :key="connected_system.id">
                      <router-link :to="{ name: 'systemDetail', params: { systemId: connected_system.id }}">{{ connected_system.name }}</router-link>

                      <button class="button is-small" @click="removeConnectedSystem(connected_system.name)" title="Remove this system from this area">
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
        <h2 class="subtitle">Area Network Topology</h2>

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
      area: { 'connected_systems': [] },
      newSystemName: ''
    }
  },
  mounted () {
    this.getAreaDetail()
  },
  methods: {
    getAreaDetail () {
      axios({
        method: 'get',
        url: `http://localhost:8811/api/v1/areas/${this.$route.params.areaId}/`,
        auth: {
          username: 'admin',
          password: 'admin'
        }
      }).then((response) => {
        this.area = response.data
        this.drawNetworkTopology()
      })
    },
    addNewSystem () {
      if (this.newSystemName === '') return
      axios({
        method: 'put',
        url: `http://localhost:8811/api/v1/areas/${this.$route.params.areaId}/`,
        auth: {
          username: 'admin',
          password: 'admin'
        },
        data: {
          address: this.area.address,
          areas: [],
          connected_systems: [{name: this.newSystemName}]
        }
      }).then((response) => {
        this.area = response.data
        this.drawNetworkTopology()
      })
      // Finally empty the field
      this.newSystemName = ''
    },
    removeConnectedSystem (connectedSystemName) {
      axios({
        method: 'put',
        url: `http://localhost:8811/api/v1/areas/${this.$route.params.areaId}/`,
        auth: {
          username: 'admin',
          password: 'admin'
        },
        data: {
          address: this.area.address,
          areas: [],
          connected_systems: [],
          unlinked_areas: [],
          unlinked_connected_systems: [{name: connectedSystemName}]
        }
      }).then((response) => {
        this.area = response.data
        this.drawNetworkTopology()
      })
    },
    drawNetworkTopology () {
      var tempNetworkData = []
      var tempNetworkEdgeData = []
      var networkItemsCount = 0

      // Add current area and make its edges with all areas and connected systems
      tempNetworkData.push({
        id: networkItemsCount,
        label: 'Current Area #' + this.area.address,
        shape: 'star',
        color: {background: 'coral'}
      })
      networkItemsCount += 1

      this.area.connected_systems.forEach(function (system) {
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

      // Now initialize the Vis network topology
      /* eslint-disable no-new */
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
  ol {
    font-size: 20px;
  }
  .systems-list a {
    color: forestgreen;
  }
  .systems-list:hover a {
    color: darkgreen;
  }
  #network-topology {
    display: block;
    width: 100%;
    height: 600px;
    border: solid;
    background-color: white;
  }
</style>
