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
                      <section id="new--nested-system-form" class="column">
                        <b-field>
                          <b-input v-model="newNestedSystemName" placeholder="New-Nested-System-Name-401-1" width="200px"></b-input>
                        </b-field>
                        <button class="button is-primary" @click="addNewNestedSystem(connected_system.name)">Add New Nested System</button>
                      </section>

                      <ol>
                        <li class="nested-systems-list" v-for="nested_system in connected_system.connected_systems" :key="nested_system.id">
                          <router-link :to="{ name: 'systemDetail', params: { systemId: nested_system.id }}">{{ nested_system.name }}</router-link>

                          <button class="button is-small" @click="removeNestedSystem(connected_system.name, nested_system.name)" title="Remove this nested system from this parent system">
                            <b-icon icon="trash-alt"></b-icon>
                          </button>
                        </li>
                      </ol>
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
      newSystemName: '',
      newNestedSystemName: ''
    }
  },
  mounted () {
    this.getAreaDetail()
  },
  methods: {
    getAreaDetail () {
      axios({
        method: 'get',
        url: process.env.NETWORK_AREAS_API + `${this.$route.params.areaId}/`,
        auth: process.env.NETWORK_API_AUTH
      }).then((response) => {
        this.area = response.data
        this.drawNetworkTopology()
      })
    },
    addNewSystem () {
      if (this.newSystemName === '') return
      axios({
        method: 'put',
        url: process.env.NETWORK_AREAS_API + `${this.$route.params.areaId}/`,
        auth: process.env.NETWORK_API_AUTH,
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
        url: process.env.NETWORK_AREAS_API + `${this.$route.params.areaId}/`,
        auth: process.env.NETWORK_API_AUTH,
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
    addNewNestedSystem (parentSystemName) {
      if (this.newNestedSystemName === '') return
      axios({
        method: 'put',
        url: process.env.NETWORK_AREAS_API + `${this.$route.params.areaId}/`,
        auth: process.env.NETWORK_API_AUTH,
        data: {
          address: this.area.address,
          areas: [],
          connected_systems: [],
          nested_systems: [{parent_system: parentSystemName, name: this.newNestedSystemName}]
        }
      }).then((response) => {
        this.area = response.data
        this.drawNetworkTopology()
      })
      // Finally empty the field
      this.newNestedSystemName = ''
    },
    removeNestedSystem (parentSystemName, childSystemName) {
      axios({
        method: 'put',
        url: process.env.NETWORK_AREAS_API + `${this.$route.params.areaId}/`,
        auth: process.env.NETWORK_API_AUTH,
        data: {
          address: this.area.address,
          areas: [],
          connected_systems: [],
          unlinked_nested_systems: [{parent_system: parentSystemName, name: childSystemName}]
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
      var parentSystemIndex = 0
      var nestedSystemLabel = ''

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
        parentSystemIndex = networkItemsCount

        networkItemsCount += 1
        system.connected_systems.forEach(function (nestedSystem) {
          nestedSystemLabel = 'CS# ' + nestedSystem.name
          const duplicateNodeIndex = tempNetworkData.findIndex((node) => node.label === nestedSystemLabel)

          if (duplicateNodeIndex === -1) {
            tempNetworkData.push({
              id: networkItemsCount,
              label: 'CS# ' + nestedSystem.name,
              shape: 'triangle',
              color: {background: 'palevioletred'}
            })
            tempNetworkEdgeData.push({
              from: parentSystemIndex,
              to: networkItemsCount
            })
          } else {
            tempNetworkEdgeData.push({
              from: parentSystemIndex,
              to: tempNetworkData[duplicateNodeIndex].id
            })
          }
          networkItemsCount += 1
        })
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
  .nested-systems-list a {
    color: palevioletred !important;
  }
  .nested-systems-list:hover a {
    color: deeppink !important;
  }
  #network-topology {
    display: block;
    width: 100%;
    height: 600px;
    border: solid;
    background-color: white;
  }
</style>
