export default {
    getAircrafts: (state, getters) => {
      return state.aircrafts
    },
    getAircraft: (state, getters) => (aircraftID) => {
      return state.aircrafts.data.filter(aircraft => aircraft.ident === aircraftID)[0];
    },
    getFlights: (state) => {
      return state.flights
    },
    getFlightsPerDay: (state, getters) => (dayNo) =>{
      const fpdi = getters.getFlightsPerDayIndexes[dayNo];
      return {day: dayNo, flights: getters.getFlights.slice(fpdi[0], fpdi[1]+1)};
    },
    getFlightsPerDayIndexes: (state, getters) => {
      const flights = getters.getFlights
      const days = [[0, flights.length-1]];

      flights.forEach((flight, index)=>{
        flight.index = index
        if (index > 0 && index < flights.length-1) {
          if (flight.arrivaltime > flights[index+1].departuretime){
            days[days.length-1][1] = index
            days.push([index+1, flights.length-1])
          }
        }
      })
      return days;
    },
    getFlight: (state) => (flightID) => {
      return state.flightsj.filter(flight=> flight.id === flightID)[0];
    },
    getUtilisationPerDay: (state, getters) => (dayNo) => {
      let utilData            = []
      const fpd               = getters.getFlightsPerDay(dayNo).flights
      const secsPer24h        = (24 * 60 * 60)
      const percent           = 100/secsPer24h
      const minTurnaround     = (40 * 60)
      const idleBeforeService = fpd[0].departuretime;
      const idleAfterService  = fpd[fpd.length-1].arrivaltime ;

      let totalScheduledTime = 0
      fpd.forEach( (flight, index) => {
        const isLastFlightToday = (index === fpd.length-1)
        const        turnaround = isLastFlightToday ? 0 : 
                                    (fpd[index+1].departuretime - flight.arrivaltime);
        const          inFlight = flight.arrivaltime - flight.departuretime

        totalScheduledTime += inFlight + turnaround

        utilData.push({
          flightID      : flight.ident,
          inFlight      : inFlight,
          minTurnaround : isLastFlightToday ? 0 : minTurnaround,
          turnaround    : turnaround
            }
          )
        })
    return {
      utilPercent       : totalScheduledTime,
      percentValue      : percent,
      utilDetails       : utilData,
      idleBeforeService : idleBeforeService,
      idleAfterService  : (secsPer24h - idleAfterService),
      }
    },

    getFlightTimeDate: (state, getters) => (flight, dayOffset) => {
      const tm = new Date(getters.getMidnightMilis)
      
      tm.setUTCDate(tm.getUTCDate()+dayOffset)

      const date = tm.getTime()
      
      tm.setUTCSeconds(flight.departuretime)
      const dt = tm.getTime()
      
      tm.setUTCSeconds(flight.arrivaltime - flight.departuretime)
      const at = tm.getTime()
      
      return {
        time: {
          departure : dt,
          arrival   : at
        },
        date: date
      };
    },
    getFlightDate: (state, getters) => (flight, dayOffset) => {
      const date = new Date(getters.getMidnightMilis)
      date.setUTCDate(date.getUTCDate()+dayOffset)
      return date.getTime()
    },
    getMidnightMilis: () => {
      const tm = new Date(Date.now())
      tm.setUTCHours(0);
      tm.setUTCMinutes(0);
      tm.setUTCSeconds(0);
      return tm.getTime()
    }
  }