<template>
    <div class="timeline">
        <span class="idle bar" :style="{width: utilData.idle.beforeService+'%'}"></span>
        <template v-for="(fu, index) in utilData.inService">
            <span class="in-flight bar" :style="{width: fu.inFlight+'%'}" :key="'td-if-'+index"></span>
            <span class="turnaround bar" :style="{width: fu.turnaround+'%'}" :key="'td-t-'+index"></span>
            <span class="min-turnaround bar" :style="{left: fu.optimalTurnaround+'%'}" :key="'td-mt-'+index" title="Minimum turnaround"></span>
        </template>
        <span class="idle bar" :style="{width: utilData.idle.afterService+'%'}"></span>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
    name: 'UtilTimeline',
    props: {
        utilData  : Object
    },
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
    height: 20px;
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
