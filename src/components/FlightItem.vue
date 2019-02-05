<template>
    <div class="flight-item" :id="'flight-'+flight.ident">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="origin col">
            <inline-edit @value-accepted="updateOrigin">
                <p>{{ flight.origin.toUpperCase() }}</p>
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
                <p>{{ flight.destination.toUpperCase() }}</p>
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
    data(){
        return {
            errorMessage: ''
        }
    },
    methods: {
        displayErrorMessage(msg){
                this.errorMessage = msg
                setTimeout(()=>{
                    this.errorMessage = ''
                }, 3000)
        },
        updateDeparture(newTime) {
            const t = newTime.split(':')
            const d = {
                hours   : Number(t[0]),
                minutes : Number(t[1]),
            }
            if(this.isDepartureTimeValid(d))
                this.departure = d
        },
        updateArrival(newTime) {
            const t = newTime.split(':')
            const a = {
                hours   : Number(t[0]),
                minutes : Number(t[1]),
            }
            if(this.isArrivalTimeValid(a))
                this.arrival = a
        },
        updateOrigin(newOrigin) {
            if(this.isAirportCodeValid(newOrigin))
                this.flight.origin = newOrigin
        },
        updateDestination(newDestination) {
            if(this.isAirportCodeValid(newDestination))
                this.flight.destination = newDestination
        },
        updateFlighID(newFlightID){
            if(this.isFlightIDValid(newFlightID))
                this.flight.ident = newFlightID.toUpperCase() 
        },
        isFlightIDValid(id){
            const exists = this.getFlights.filter(flight => flight.ident === id)[0]
            const match = id.match(/[a-zA-Z0-9]/g)
            const isValid = match === null ? false : match.length === id.length
            if(exists)
                this.displayErrorMessage('Flight ' + id + ' already exists')
            else if (!isValid)
                this.displayErrorMessage('Flight id ' + id + ' is invalid')
            return !exists && isValid
        },
        isDepartureTimeValid(dt){
            const at                    = this.arrival
            const prevFlightArrMinutes  = this.flightNoToday === 0 ? -40 :
                                            this.getFlights[this.flight.index-1].arrivaltime / 60
            const totalArrMinutes       = (at.hours * 60) + at.minutes
            const totalDepMinutes       = (dt.hours * 60) + dt.minutes

            const inputIsValidNumber    = !isNaN(dt.hours)
                                            && !isNaN(dt.minutes) 
                                            && dt.minutes < 60  && dt.minutes >= 0
                                            && dt.hours <= 24  && dt.hours >= 0
            const isLessThanArrTime     = totalDepMinutes < totalArrMinutes
            const hasEnoughTurnaround   = totalDepMinutes >= prevFlightArrMinutes + 40

            // error messages
            if(!inputIsValidNumber)
                this.displayErrorMessage('invalid input: must be a number within time range')
            else if(!isLessThanArrTime)
                this.displayErrorMessage('must depart before arrival')
            else if(!hasEnoughTurnaround)
                this.displayErrorMessage('minimum 40min turnaround expected')

            return inputIsValidNumber && isLessThanArrTime && hasEnoughTurnaround
        },
        isArrivalTimeValid(at){
            const dt                      = this.departure
            const nextFlightDepMinutes    = this.flightNoToday === this.flightsToday.length-1 ?
                                                (24*60) : 
                                                (this.getFlights[this.flight.index+1].departuretime / 60) - 40
            const totalArrMinutes         = (at.hours * 60) + at.minutes
            const totalDepMinutes         = (dt.hours * 60) + dt.minutes

            const inputIsValidNumber      = !isNaN(at.hours)
                                                && !isNaN(at.minutes) 
                                                && at.minutes < 60  && at.minutes >= 0
                                                && at.hours <= 24  && at.hours >= 0
            const arrivedAfterDeparture   = totalArrMinutes > totalDepMinutes
            const leavesEnoughTurnaround  = totalArrMinutes <= nextFlightDepMinutes

            // error messages
            if(!inputIsValidNumber)
                this.displayErrorMessage('invalid input: must be a number within time range')
            else if(!arrivedAfterDeparture)
                this.displayErrorMessage('must arrive after departure')
            else if(!leavesEnoughTurnaround)
                this.displayErrorMessage('must leave minimum 40min turnaround before the next flight')

            return inputIsValidNumber && arrivedAfterDeparture && leavesEnoughTurnaround
        },
        isAirportCodeValid(s){
            const match = s.match(/[a-zA-Z0-9]/g)
            const isValid = match === null ? false : match.length === 4
            if(!isValid)
                this.displayErrorMessage('invalid airport code')
            return isValid
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
        flightNoToday: Number,
        utilData: Object,
    },
    computed: {
        ...mapGetters({
            getFlightDate: 'getFlightDate',
            getFlights: 'getFlights',
            getFlightsPerDay: 'getFlightsPerDay',
        }),
        date(){
            return this.getFlightDate(this.flight, this.day)
        },
        flightsToday(){
            return this.getFlightsPerDay(this.day).flights
        },
        departure: {
            get() {
                const d = new Date(this.date)
                d.setUTCSeconds(this.flight.departuretime)
                return {
                    hours   : d.getUTCHours(),
                    minutes : d.getUTCMinutes()
                }
            },
            set(departure) {
                let secs = (departure.hours*60*60) + (departure.minutes*60)
                this.flight.departuretime = secs
            }
        },
        arrival: {
            get() {
                const d = new Date(this.date)
                d.setUTCSeconds(this.flight.arrivaltime)
                return {
                    hours   : d.getUTCHours(),
                    minutes : d.getUTCMinutes()
                }
            },
            set(arrival) {
                let secs = (arrival.hours*60*60) + (arrival.minutes*60)
                this.flight.arrivaltime = secs
            }
        },

    },
    mounted(){
    }
}
</script>

<style>
    .flight-id h1 {
        margin: 0;
    }
    .flight-item {
        position: relative;
        display: inline-flex;
        align-items: stretch;
        width: 300px;
        padding: 1rem;
    }
    .flight-id {
        position: relative;
        margin: 20px 0;
    }
    .flight-id > p {
        margin: 0;
        line-height: 1;
    }
    .col {
        position: relative;
        align-self: center;
        text-align: center;
        flex-grow: 1;
    }
    .error-message {
        color: red;
        position: absolute;
        width: 100%;
        line-height: .8;
        left: 0;
        top: 5px;
    }


</style>
