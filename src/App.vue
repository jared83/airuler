<template>
  <div id="app">
    <div class="timeline-key">
      <p>Timeline Key</p>
      <span class="mt-key">minimum / optimal turnaround marker</span>
      <span class="t-key">turnaround</span>
      <span class="if-key">in flight</span>
      <span class="i-key">idle</span>
    </div>
    <div class="airuler-container">
      <div class="aircrafts">
        <h1>Available Aircrafts</h1>
        <aircraft-list/>
      </div>
      <div class="schedule">
        <header>
          <p>Edit rotation by clicking on any displayed value. For time fields, once clicked use arrows to jump between editing hours and minutes.</p>
          <h1>Full Rotation Schedule</h1>
        </header>
        <div class="flights">
          <template v-for="(fIdx, dayNo) in flightsPerDayIndexes">
            <flights-list :flights-list="flightsPerDay(dayNo)" :id="'flpd'+dayNo" :key="'flist'+dayNo"/>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FlightsList from "./components/FlightsList.vue";
import AircraftList from "./components/AircraftList.vue";
import store from "./store";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "app",
  components: {
    FlightsList,
    AircraftList
  },
  data(){
    return {
      selectedAircraft: {
        name: 'Select Aircraft'
      }
    }
  },
  computed:{
    ...mapGetters({
      flights: 'getFlights',
      flightsPerDay: 'getFlightsPerDay',
      flightsPerDayIndexes: 'getFlightsPerDayIndexes',
      getAircrafts: 'getAircrafts'
    }),
    aircrafts(){
      return this.getAircrafts.map((ac)=>{
        return {
          name: ac.ident,
        }
      })
    }
  },
  methods:{
    selectAircraft(aircraft){
      this.selectedAircraft = aircraft
    }
  }
};
</script>

<style>
body {
  color: #7990a7;
  background-color: rgb(27, 24, 41);
  margin: -10px 0;
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 0px;
}
ul {
  list-style: none;
  padding: 0;
}
.airuler-container {
  position: relative;
  display: flex;
}
.aircrafts {
    width: auto;
    height: 100vh;
    position: relative;
    display: block;
    box-shadow: 6px 0px 8px -6px #81a779;
    padding: 1rem;
    color: #81a779;
}
.flights {
  width: 100%;
  overflow: auto;
  height: calc(90vh - 24px);
}
.schedule {
  width: 85vw;
}
.schedule > header p {
  margin-top: 0;
}
.schedule > header {
  width: 100%;
  display: block;
  padding: 1rem;
  height: 10vh;
  text-align: left;
}
p {
  font-size: 1.2rem;
}
.timeline-key span::after {
  width: 10px;
  height: 10px;
  display: inline-block;
  position: relative;
  content: ' ';
  right: -7px;
}
.timeline-key * {
  margin: 0;
  padding: 0;
  text-align: right;
}
.timeline-key span {
  position: relative;
  display: block;
  text-align: right;
} 
.timeline-key {
  position: fixed;
  top: 0;
  right: 10px;
  color: rgba(65, 112, 102, 0.851);
}
.if-key::after  {
  background-color: green;
}
.t-key::after  {
  background-color: purple;
}
.i-key::after  {
  background-color: gray;
}
.mt-key::after {
  background-color: red;
}
</style>
