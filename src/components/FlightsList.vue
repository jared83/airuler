<template>
  <div class="flights-day">
    <div class="date">{{ date }}</div>
    <div class="total-util-percent">
      {{ utilPerDay(flightsList.day).utilPercent * utilPerDay(flightsList.day).percentValue | trunc }}%
      <br>
    </div>
    <util-timeline :day="flightsList.day" :util-data="utilData"/>
    <ul :id="id" class="flights-list">
      <li v-for="(flight, index) in flightsList.flights" :key="id+'-'+index">
        <FlightItem :flight="flight" :day="flightsList.day" :util-data="utilData" :flight-no-today="index" />
      </li>
    </ul>
  </div>
</template>

<script>
import FlightItem from "./FlightItem.vue";
import UtilTimeline from "./UtilTimeline";
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
      return Math.trunc(val);
    }
  },
  computed: {
    ...mapGetters({
      timeDate            : "getFlightTimeDate",
      utilisationPercent  : "getAircraftUtilisationPercentPerDay",
      utilPerDay          : "getUtilisationPerDay"
    }),
    date() {
      return new Date(
        this.timeDate(this.flightsList.flights[0], this.flightsList.day).date
      ).toDateString();
    },
    utilData(){
      return {
        inService : this.uppd,
        idle      : this.idle,
      };
    },
    uppd() {
      const upd = this.utilPerDay(this.flightsList.day);
      const percent = upd.percentValue;
      let minTurnOffset = 0;
      return upd.utilDetails.map(d => {
        const details = {
          flightID          : d.flightID,
          inFlight          : d.inFlight * percent,
          optimalTurnaround : (upd.idleBeforeService +
                                minTurnOffset +
                                d.inFlight +
                                d.minTurnaround) *
                              percent,
          turnaround        : d.turnaround * percent,
          flightUtilPercent : (d.inFlight + d.turnaround + d.idle) * percent
        };

        minTurnOffset += d.inFlight + d.turnaround;
        return details
      });
    },
    idle() {
      const upd = this.utilPerDay(this.flightsList.day);
      return {
        beforeService : upd.idleBeforeService * upd.percentValue,
        afterService  : upd.idleAfterService * upd.percentValue
      };
    }
  }
};
</script>

<style>
ul.flights-list {
  list-style: none;
  padding: 0;
}
.flights-list > li:hover {
  box-shadow: 0px 0px 8px 1px #81a779;
  z-index: 100;
}
.flights-list > li {
  border: 1px black solid;
  box-shadow: 0px 0px 8px 1px #7990a7;
  background-color: rgb(27, 24, 41);
}
.flights-day {
  display: table-cell;
  vertical-align: top;
  padding: 1rem;
}
.date {
  line-height: 2;
}
.total-util-percent {
  color: green;
  font-size: 1.2rem;
  line-height: 1.7;
  font-weight: 600;
}
</style>
