import './App.css';
import { schedule } from "./schedule.js";
import moment from "moment-timezone";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import Geocode from "react-geocode";
import { useEffect } from 'react';
import banner1 from "./banner-1.jpg"

Geocode.setApiKey("AIzaSyAb94zapDceVmspV65wFj_-iV2AWQk9kwY");

function processSchedule(schedule, utcOffset) {
    const processed = [];
    for (let event of schedule) {
        const start = moment.unix(event[0] + utcOffset * 60).toDate();
        const end = moment.unix(event[1] + utcOffset * 60 - 1).toDate();
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

function genRecommended(offset) {
    function ot(time) {
        // returns the time in utc translated to 24 hour time based on offset
        return time + offset / 60;
    }

    let nextPrimary = "";
    let nextSecondary = "";
    if ((ot(8) >= 7 && ot(16) <= 22) || (ot(11) >= 7 && ot(19) <= 22)) {
        if (Math.abs(13 - ot(12)) < Math.abs(13 - ot(15))) {
            // This means A is closer to cetered at 1 pm
            nextPrimary = "A";
        } else {
            nextPrimary = "B";
        }
    } else if ((ot(8) >= 7 && ot(16) <= 26) || (ot(11) >= 7 && ot(19) <= 25)) {
        if (Math.abs(13 - ot(12)) < Math.abs(13 - ot(15))) {
            nextPrimary = "A";
        } else {
            nextPrimary = "B";
        }

        if ((ot(20) >= 7 && ot(4) <= 22) || (ot(23) >= 7 && ot(7) <= 22)) {
            if (Math.abs(13 - ot(0)) < Math.abs(13 - ot(3))) {
                // This means C is closer to cetered at 1 pm
                nextSecondary = "C";
            } else {
                nextSecondary = "D";
            }
        } else {
        }
    } else {
        if (Math.abs(13 - (ot(0) + 24) % 24) < Math.abs(13 - (ot(3) + 24) % 24)) {
            nextPrimary = "C";
        } else {
            nextPrimary = "D";
        }
    }
    return [nextPrimary, nextSecondary];
}

function gen1a(offset) {
    function ot(time) {
        // returns the time in utc translated to 24 hour time based on offset
        time = time + offset / 60;
        if (time < 0) {
            return (time + 24) % 24;
        }
        return time;
    }

    if (ot(16) >= 7 && ot(16) <= 18) {
        return "L";
    } else if (ot(0) >= 8 && ot(0) <= 16) {
        return "R1";
    } else {
        return "R2";
    }
}

function gen1b(offset) {
    function ot(time) {
        // returns the time in utc translated to 24 hour time based on offset
        time = time + offset / 60;
        if (time < 0) {
            return (time + 24) % 24;
        }
        return time;
    }

    if (ot(21) >= 7 && ot(21) <= 18) {
        return "L";
    } else if (ot(5) >= 8 && ot(5) <= 16) {
        return "R1";
    } else {
        return "R2";
    }
}

function gen2(offset) {
    function ot(time) {
        // returns the time in utc translated to 24 hour time based on offset
        time = time + offset / 60;
        if (time < 0) {
            return (time + 24) % 24;
        }
        return time;
    }

    if (ot(16) >= 7 && ot(16) <= 18) {
        return "L";
    } else if (ot(0) >= 8 && ot(0) <= 16) {
        return "R1";
    } else {
        return "R2";
    }
}

function App() {
    const localizer = momentLocalizer(moment);
    const [location, setLocation] = useState("Please enter your location:");
    const [offset, setOffset] = useState(0);
    const [timezone, setTimezone] = useState("Greenwich Mean Time");
    const [events, setEvents] = useState(processSchedule(schedule, offset));
    const [primary, setPrimary] = useState("A");
    const [secondary, setSecondary] = useState("");
    const [pc1a, setpc1a] = useState("L");
    const [pc1b, setpc1b] = useState("L");
    const [pc2, setpc2] = useState("L");

    function handleLocation() {
        Geocode.fromAddress(location)
            .then(
                (response) => {
                    const { lat, lng } = response.results[0].geometry.location;
                    const url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + '&timestamp=1625976000&key=AIzaSyAb94zapDceVmspV65wFj_-iV2AWQk9kwY';
                    fetch(url)
                        .then((response) => {
                            if (response.ok) {
                                response.json()
                                    .then((json) => {
                                        setTimezone(json.timeZoneName);
                                        setOffset((json.dstOffset + json.rawOffset) / 60);
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

    function eventStyleGetter(event, start, end, isSelected) {
        let backgroundColor = "grey";
        const utcStart = (start.getTime() - (offset * 60 * 1000)) / 1000;
        switch (primary) {
            case "A":
                if (utcStart >= moment("2021-07-26T08:00:00").unix() && utcStart <= moment("2021-07-26T15:30:00").unix())
                    backgroundColor = "yellow";
                else if (utcStart >= moment("2021-07-27T08:00:00").unix() && utcStart <= moment("2021-07-27T15:30:00").unix())
                    backgroundColor = "yellow";
                break;
            case "B":
                if (utcStart >= moment("2021-07-26T11:00:00").unix() && utcStart <= moment("2021-07-26T18:30:00").unix())
                    backgroundColor = "yellow";
                else if (utcStart >= moment("2021-07-27T11:00:00").unix() && utcStart <= moment("2021-07-27T18:30:00").unix())
                    backgroundColor = "yellow";
                break;
            case "C":
                if (utcStart >= moment("2021-07-26T20:00:00").unix() && utcStart <= moment("2021-07-27T03:30:00").unix()) {
                    backgroundColor = "yellow";
                }
                else if (utcStart >= moment("2021-07-27T20:00:00").unix() && utcStart <= moment("2021-07-28T03:30:00").unix())
                    backgroundColor = "yellow";
                break;
            case "D":
                if (utcStart >= moment("2021-07-26T23:00:00").unix() && utcStart <= moment("2021-07-27T06:30:00").unix())
                    backgroundColor = "yellow";
                else if (utcStart >= moment("2021-07-27T23:00:00").unix() && utcStart <= moment("2021-07-28T06:30:00").unix())
                    backgroundColor = "yellow";
                break;
        }

        switch (secondary) {
            case "C":
                if (utcStart >= moment("2021-07-26T20:00:00").unix() && utcStart <= moment("2021-07-27T03:30:00").unix()) {
                    backgroundColor = "green";
                }
                else if (utcStart >= moment("2021-07-27T20:00:00").unix() && utcStart <= moment("2021-07-28T03:30:00").unix())
                    backgroundColor = "green";
                break;
            case "D":
                if (utcStart >= moment("2021-07-26T23:00:00").unix() && utcStart <= moment("2021-07-27T06:30:00").unix())
                    backgroundColor = "green";
                else if (utcStart >= moment("2021-07-27T23:00:00").unix() && utcStart <= moment("2021-07-28T06:30:00").unix())
                    backgroundColor = "green";
                break;
        }

        if (event.title.includes("1A")) {
            switch (pc1a) {
                case "L":
                    if (utcStart === moment("2021-07-28T16:00:00").unix())
                        backgroundColor = "yellow";
                    break;
                case "R1":
                    if (utcStart === moment("2021-07-29T00:00:00").unix())
                        backgroundColor = "yellow";
                    break;
                case "R2":
                    if (utcStart === moment("2021-07-29T07:00:00").unix())
                        backgroundColor = "yellow";
                    break;
            }
        }
        if (event.title.includes("1B")) {
            switch (pc1b) {
                case "L":
                    if (utcStart === moment("2021-07-28T21:00:00").unix())
                        backgroundColor = "yellow";
                    break;
                case "R1":
                    if (utcStart === moment("2021-07-29T05:00:00").unix())
                        backgroundColor = "yellow";
                    break;
                case "R2":
                    if (utcStart === moment("2021-07-29T16:00:00").unix())
                        backgroundColor = "yellow";
                    break;
            }
        }
        if (event.title.includes("2")) {
            switch (pc2) {
                case "L":
                    if (utcStart === moment("2021-07-29T16:00:00").unix())
                        backgroundColor = "yellow";
                    break;
                case "R1":
                    if (utcStart === moment("2021-07-30T00:00:00").unix())
                        backgroundColor = "yellow";
                    break;
                case "R2":
                    if (utcStart === moment("2021-07-30T07:00:00").unix())
                        backgroundColor = "yellow";
                    break;
            }
        }

        const style = {
            backgroundColor,
            color: backgroundColor === "yellow" ? "black" : "white",
        };
        return {
            style
        };
    }

    useEffect(() => {
        setEvents(processSchedule(schedule, offset));
        // following logic based on Mark's flowchart

        const [nextPrimary, nextSecondary] = genRecommended(offset);
        const next1a = gen1a(offset);
        const next1b = gen1b(offset);
        const next2 = gen2(offset);
        if (nextPrimary !== primary) {
            setPrimary(nextPrimary);
        }
        if (nextSecondary !== secondary) {
            setSecondary(nextSecondary);
        }
        if (next1a !== pc1a) {
            setpc1a(next1a);
        }
        if (next1b !== pc1b) {
            setpc1b(next1b);
        }
        if (next2 !== pc2) {
            setpc2(next2);
        }
    }, [offset, primary, secondary, pc1a, pc1b, pc2]);

    return (
        <div className="App">
            <img src={banner1} alt="CRS conference banner"/>
            
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
            <h1>Currently showing schedule for {timezone}</h1>
            <br></br>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                defaultDate={moment.unix(1627185600).toDate()} // Unix timestamp for June 11
                views={["week"]}
                eventPropGetter={eventStyleGetter}
                showMultiDayTimes
                step={15}
            />
        </div>
    );
}

export default App;
