<template>
  <div id="app">
    <div :style="{width: '100%', scroll: 'scroll'}">
      <template v-for="(fIdx, dayNo) in flightsPerDayIndexes">
        <!-- {{fIdx[0]}} : {{fIdx[1]}} -->
        <flights-list :flights-list="flightsPerDay(dayNo)" :id="'flpd'+dayNo" :key="'flist'+dayNo"/>
      </template>
    </div>
  </div>
</template>

<script>
import FlightsList from "./components/FlightsList.vue";
import store from "./store";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "app",
  components: {
    FlightsList
  },
    computed:{
    ...mapGetters({
      flights: 'getFlights',
      flightsPerDay: 'getFlightsPerDay',
      flightsPerDayIndexes: 'getFlightsPerDayIndexes',
    })
  }
};
</script>

<style>
body {
  color: #7990a7;
  background-color: rgb(27, 24, 41);
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
