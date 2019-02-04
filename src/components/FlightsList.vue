<template>
  <div class="flights-day">
    <div class="date">{{ date }}</div>
    <div class="total-util-percent">
      {{ utilPerDay(flightsList.day).utilPercent * utilPerDay(flightsList.day).percentValue | trunc }}% <br>
      <!-- {{ timeDate(flightsList.flights[0], flightsList.day).time }} : {{ timeDate(flightsList.flights[0], flightsList.day).date  }} -->
    </div>
    <util-timeline :day="flightsList.day"/>
    <ul :id="id" class="flights-list">
      <li v-for="(flight, index) in flightsList.flights" :key="id+'-'+index">
        <FlightItem :flight="flight" :day="flightsList.day" />
      </li>
    </ul>
  </div>
</template>

<script>
import FlightItem from "./FlightItem.vue";
import UtilTimeline from './UtilTimeline';
// import store from "./store";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "FlightsList",
  components: {
    FlightItem,
    UtilTimeline
  },
  props: {
    id: String,
    flightsList: Object
  },
  filters: {
    trunc: val => {
      return Math.trunc(val)
    }
  },
  computed: {
    ...mapGetters({
      timeDate: 'getFlightTimeDate',
      utilisationPercent: 'getAircraftUtilisationPercentPerDay',
      utilPerDay: 'getUtilisationPerDay'
    }),
    date() {
      return  new Date(this.timeDate(this.flightsList.flights[0], this.flightsList.day).date).toDateString()
    }
  }
};
</script>

<style>
  ul.flights-list {
    list-style: none;
    padding: 0;
  }
  .flights-list>li {
    /* padding: 1rem; */
    border: 1px black solid;
    /* border-radius: 5px; */
    box-shadow: 0px 0px 8px 1px #7990a7;
    background-color: rgb(27, 24, 41);
    /* height: 7rem; */
  }
  .flights-day {
    /* width: 400px; */
    display: table-cell;
    vertical-align: top;
    padding: 1rem;
  }
  .date {

  }
  .total-util-percent {
    color: green;
  }
</style>
