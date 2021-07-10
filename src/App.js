import './App.css';
import { schedule } from "./schedule.js";
import moment from "moment-timezone";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import Geocode from "react-geocode";
import { useEffect } from 'react';

Geocode.setApiKey("AIzaSyAb94zapDceVmspV65wFj_-iV2AWQk9kwY");

function processSchedule(schedule, utcOffset) {
    const processed = [];
    for (let event of schedule) {
        const start = moment.unix(event[0] + utcOffset * 60).toDate();
        const end = moment.unix(event[1] + utcOffset * 60).toDate();
        const title = event[2];
        processed.push(
            {
                title,
                start,
                end,
            }
        );
    }

    return processed;
}

function App() {
    function handleLocation() {
        Geocode.fromAddress(location)
            .then(
                (response) => {
                    const { lat, lng } = response.results[0].geometry.location;
                    console.log(lat, lng);
                    const url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + '&timestamp=1625976000&key=AIzaSyAb94zapDceVmspV65wFj_-iV2AWQk9kwY';
                    fetch(url)
                        .then((response) => {
                            if (response.ok) {
                                response.json()
                                    .then((json) => {
                                        setOffset((json.dstOffset + json.rawOffset) / 60);
                                        console.log(offset);
                                    })
                                    .catch(() => alert("Something went wrong. Please check the location and try again."));
                            } else {
                                alert("Something went wrong. Please check the location and try again.");
                            }
                        })
                        .catch(() => alert("Something went wrong. Please check the location and try again."));
                },
                (error) => {
                    console.error(error);
                }
            )
            .catch(() => alert("Something went wrong. Please check the location and try again."));
    }

    const localizer = momentLocalizer(moment);
    const [location, setLocation] = useState("Please enter your location:");
    const [offset, setOffset] = useState(0);
    const [events, setEvents] = useState(processSchedule(schedule, offset));

    useEffect(() => {
        console.log(offset);
        setEvents(processSchedule(schedule, offset));
    }, [offset]);
    return (
        <div className="App">
            <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLocation();
            }}>
                <input value={location} onChange={e => setLocation(e.target.value)} />
                <br></br>
                <button type="submit">Set Location!</button>
            </form>
            <br></br>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                date={moment.unix(1625976000).toDate()} // Unix timestamp for June 11
            />
        </div>
    );
}

export default App;
