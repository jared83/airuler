<template>
    <div class="flight-item" :id="'flight-'+flight.ident">
        <div class="origin col">
            <inline-edit @value-accepted="updateOrigin">
                <p>{{ flight.origin }}</p>
            </inline-edit>
            <inline-edit @value-accepted="updateDeparture">
                <p>{{ departure | formatTime }}</p>
            </inline-edit>
        </div>
        <div class="flight-id col">
            <p> => </p>
            <inline-edit @value-accepted="updateFlighID">
                <h1>{{ flight.ident }}</h1>
            </inline-edit>
            <p> => </p>
        </div>
        <div class="departure col">
            <inline-edit @value-accepted="updateDestination">
                <p>{{ flight.destination }}</p>
            </inline-edit>
            <inline-edit  @value-accepted="updateArrival">
                <p>{{ arrival | format-time }}</p>
            </inline-edit>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import InlineEdit from './InlineEdit'
export default {
    components:{
        InlineEdit
    },
    methods: {
        updateDeparture(newTime) {
            let t = newTime.split(':')
            this.departure = {
                hours: Number(t[0]) || this.departure.hours,
                minutes: Number(t[1]) || this.departure.minutes,
            }
        },
        updateArrival(newTime) {
            let t = newTime.split(':')
            this.arrival = {
                hours: Number(t[0]) || this.arrival.hours,
                minutes: Number(t[1]) || this.arrival.minutes,
            }
        },
        updateOrigin(newOrigin) {
            this.flight.origin = newOrigin
        },
        updateDestination(newDestination) {
            this.flight.destination = newDestination
        },
        updateFlighID(newFlightID){
            const exists = this.getFlights.filter(flight => flight.ident === newFlightID)[0]
            if(!exists)
                this.flight.ident = newFlightID
        }
    },
    filters:{
        formatTime(time){
            time = {
                hours: parseInt(time.hours, 10),
                minutes: parseInt(time.minutes, 10)
            }
            return (time.hours < 10 ? ('0'+time.hours) : time.hours) + ':' + (time.minutes < 10 ? ('0'+time.minutes) : time.minutes)
        }
    },
    props: {
        flight: Object,
        day: Number,
    },
    computed: {
        ...mapGetters({
            getFlightDate: 'getFlightDate',
            getFlights: 'getFlights',
        }),
        date(){
            return this.getFlightDate(this.flight, this.day)
        },
        departure: {
            get() {
                const d = new Date(this.date)
                d.setUTCSeconds(this.flight.departuretime)
                return {
                    hours: d.getUTCHours(),
                    minutes: d.getUTCMinutes()
                }
            },
            set(departure) {
                let secs = (departure.hours*60*60) + (departure.minutes*60)
                // this.getFlights[this.flight.index].departuretime = secs
                this.flight.departuretime = secs
            }
        },
        arrival: {
            get() {
                const d = new Date(this.date)
                d.setUTCSeconds(this.flight.arrivaltime)
                return {
                    hours: d.getUTCHours(),
                    minutes: d.getUTCMinutes()
                }
            },
            set(arrival) {
                let secs = (arrival.hours*60*60) + (arrival.minutes*60)
                // this.getFlights[this.flight.index].arrivaltime = secs
                this.flight.arrivaltime = secs
            }
        },

    },
    mounted(){
        // this.getFlights[this.flight.index].departuretime = 10000
        // this.departure = {
        //     hours: this.arrival.hours,
        //     minutes: this.arrival.minutes,
        // }
        // this.flight.ident = 'changed'
    }
}
</script>

<style>
    h1 {
        margin: 0;
    }
    .flight-item {
        position: relative;
        display: inline-flex;
        align-items: stretch;
        width: 300px;
        margin: 1rem;
    }
    .flight-id {
        position: relative;
    }
    .col {
        position: relative;
        align-self: center;
        text-align: center;
        flex-grow: 1;
    }
    .col > * {
        /* line-height: 1rem; */
    }
    .origin {
        /* left: 0;
        bottom: 0; */
    }
    .departure {
        /* right: 0;
        bottom: 0 */
    }

</style>
