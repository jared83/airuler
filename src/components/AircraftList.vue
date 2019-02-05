<template>
    <ul id="AircraftList">
        <li>
            <aircraft-item :aircraft="getAircrafts[0]"/>
        </li>
    </ul>
</template>

<script>
import AircraftItem from "./AircraftItem.vue";
import { mapGetters } from "vuex";
export default {
    components: {
        AircraftItem
    },
    computed: {
        ...mapGetters({
            getAircrafts: 'getAircrafts'
        })
    }
}
</script>

<style>
    #AircraftList {
        padding: 0;
        list-style: none;
    }
</style>
