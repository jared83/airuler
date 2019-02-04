<template>
    <div class="timeline">
        <!-- <div class="tl-flight-util"  -->
            <!-- :style="{ width: fu.flightUtilPercent + '%'}" -->
            <span class="idle bar" :style="{width: idle.beforeService+'%'}"></span>
        <template
            v-for="(fu, index) in uppd">
            <span class="in-flight bar" :style="{width: fu.inFlight+'%'}" :key="'td-if-'+index"></span>
            <span class="turnaround bar" :style="{width: fu.turnaround+'%'}" :key="'td-t-'+index"></span>
            <span class="min-turnaround bar" :style="{left: fu.optimalTurnaround+'%'}" :key="'td-mt-'+index" title="Minimum turnaround"></span>
        </template>
            <span class="idle bar" :style="{width: idle.afterService+'%'}"></span>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
    name: 'UtilTimeline',
    props: {
        day: Number
    },
    computed: {
        ...mapGetters({
            utilPerDay: 'getUtilisationPerDay'
        }),
        uppd(){
            const upd = this.utilPerDay(this.day)
            const percent = upd.percentValue
            let minTurnOffset = 0
            return upd.utilDetails.map(d =>{
                const details = {
                    flightID: d.flightID,
                    inFlight: d.inFlight * percent,
           optimalTurnaround: (upd.idleBeforeService + minTurnOffset + d.inFlight + d.minTurnaround) * percent,
                  turnaround: d.turnaround * percent,
           flightUtilPercent: (d.inFlight + d.turnaround + d.idle) * percent,
                    }

            minTurnOffset += d.inFlight + d.turnaround
                return details
            })
        },
        idle() {
            const upd = this.utilPerDay(this.day)
            return {
                beforeService: upd.idleBeforeService * upd.percentValue,
                afterService: upd.idleAfterService * upd.percentValue,
            }
        }
    }
}
</script>

<style>
  .timeline {
    width: 100%;
    position: relative;
  }
  .tl-flight-util {
      display: inline-block;
  }
  .bar {
    height: 15px;
    position: relative;
    display: inline-block;
  }
  .in-flight {
    background-color: green;
  }
  .turnaround {
    background-color: purple;
  }
  .idle {
    background-color: gray;
  }
  .min-turnaround {
    background-color: red;
    position: absolute;
    width: 1px;
    top: 0;
    box-shadow: 0px 0px 1px 1px red;
    z-index: 10
  };
</style>
