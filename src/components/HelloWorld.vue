<template>
  <div class="hello">
    <h1 class="title">vue-network-client</h1> <!-- Page title -->

    <hr>

    <div class="columns">
      <div class="column is-one-third is-offset-one-third"> <!-- Narrow centered column -->
        <!--<form>&lt;!&ndash; Form for adding tasks &ndash;&gt;-->
          <!--<h2 class="subtitle">Add task</h2>-->

          <!--<div class="field"> &lt;!&ndash; Normal input field for the description &ndash;&gt;-->
            <!--<label class="label">Description</label>-->
            <!--<div class="control">-->
              <!--<input class="input" type="text">-->
            <!--</div>-->
          <!--</div>-->

          <!--<div class="field"> &lt;!&ndash; Select field for choosing the status (0 and 1 as value, same as in the django status choices) &ndash;&gt;v-->
            <!--<label class="label">Status</label>-->
            <!--<div class="control">-->
              <!--<div class="select">-->
                <!--<select>-->
                  <!--<option value="0">To do</option>-->
                  <!--<option value="1">Done</option>-->
                <!--</select>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->

          <!--<div class="field is-grouped"> &lt;!&ndash; Submit button &ndash;&gt;-->
            <!--<div class="control">-->
              <!--<button class="button is-link">Submit</button>-->
            <!--</div>-->
          <!--</div>-->
        <!--</form>-->
      </div>
    </div>

    <hr>

    <div class="columns">
      <div class="column is-half">
        <h2 class="subtitle">Systems</h2>

        <div class="system">
          <div class="card" v-for="system in systems"> <!-- Loop through the systems array, if status is 0 (to do) then we'll show it. -->
            <div class="card-content">
              <div class="content">
                {{ system.name }}
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

            <footer class="card-footer">
              <a class="card-footer-item">Done</a>
            </footer>
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
  import axios from 'axios';

  export default {
    name: 'HelloWorld',
    data () {
      return {
        areas: [], // Array for holding the areas
        systems: [] // Array for holding the systems
      }
    },
    mounted () { // This will be called when HelloWorld is loaded
      this.getAreas(); // Call our getAreas function below
      this.getSystems(); // Call our getSystems function below
    },
    methods: {
      getAreas() {
        axios({
          method:'get',
          url: 'http://localhost:8811/api/v1/areas/',
          auth: {
            username: 'admin',
            password: 'admin'
          }
        }).then(response => this.areas = response.data);
      },
      getSystems() {
        axios({
          method:'get',
          url: 'http://localhost:8811/api/v1/systems/',
          auth: {
            username: 'admin',
            password: 'admin'
          }
        }).then(response => this.systems = response.data);
      }
    }
  }
</script>



<style scoped>
  .select, select { /* 100% width for the select */
    width: 100%;
  }

  .card { /* Adding some air under the tasks */
    margin-bottom: 25px;
  }

  .done { /* Make the done tasks a little bit transparent */
    opacity: 0.3;
  }
</style>
