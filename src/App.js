import './App.css';
import { schedule } from "./schedule.js";
import moment from "moment-timezone";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import Geocode from "react-geocode";
import { useEffect } from 'react';
import banner1 from "./banner-1.jpg";

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
    } else if ((ot(8) >= 6 && ot(16) <= 25) || (ot(11) >= 6 && ot(19) <= 25)) {
        if (Math.abs(13 - ot(12)) < Math.abs(13 - ot(15))) {
            nextPrimary = "A";
        } else {
            nextPrimary = "B";
        }

        if ((ot(20) >= 7 && ot(4) <= 22) || (ot(23) >= 7 && ot(7) <= 22)) {
            if (Math.abs(13 - (ot(0) + 24) % 24) < Math.abs(13 - (ot(3) + 24) % 24)) {
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

    if (ot(16) >= 7 && ot(16) <= 19) {
        if (ot(0) >= 7 && ot(0) <= 20) {
            return ["L", "R1"];
        } else if (ot(7) >= 7 && ot(7) <= 20) {
            return ["L", "R2"];
        }
        return ["L", ""];
    } else if (ot(0) >= 7 && ot(0) <= 16) {
        if (ot(16) >= 7 && ot(16) <= 20) {
            return ["R1", "L"];
        } else if (ot(7) >= 7 && ot(7) <= 20) {
            return ["R1", "R2"];
        }
        return ["R1", ""];
    } else {
        if (ot(16) >= 7 && ot(16) <= 20) {
            return ["R2", "L"];
        } else if (ot(0) >= 7 && ot(0) <= 20) {
            return ["R2", "R1"];
        }
        return ["R2", ""];
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

    if ((ot(21) + 24) % 24 >= 7 && (ot(21) + 24) % 24 <= 18) {
        if (ot(7) >= 7 && ot(7) <= 20) {
            return ["L", "R1"];
        } else if (ot(16) >= 7 && ot(16) <= 20) {
            return ["L", "R2"];
        }
        return ["L", ""];
    } else if (ot(7) >= 7 && ot(7) <= 16) {
        if ((ot(21) + 24) % 24 >= 7 && (ot(21) + 24) % 24 <= 20) {
            return ["R1", "L"];
        } else if (ot(16) >= 7 && ot(16) <= 20) {
            return ["R1", "R2"];
        }
        return ["R1", ""];
    } else {
        if (ot(7) >= 7 && ot(7) <= 20) {
            return ["R2", "R1"];
        } else if ((ot(21) + 24) % 24 >= 7 && (ot(21) + 24) % 24 <= 20) {
            return ["R2", "L"];
        }
        return ["R2", ""];
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
        if (ot(0) >= 7 && ot(0) <= 20) {
            return ["L", "R1"];
        } else if (ot(7) >= 7 && ot(7) <= 20) {
            return ["L", "R2"];
        }
        return ["L", ""];
    } else if (ot(0) >= 7 && ot(0) <= 16) {
        if (ot(16) >= 7 && ot(16) <= 20) {
            return ["R1", "L"];
        } else if (ot(7) >= 7 && ot(7) <= 20) {
            return ["R1", "R2"];
        }
        return ["R1", ""];
    } else {
        if (ot(16) >= 7 && ot(16) <= 20) {
            return ["R2", "L"];
        } else if (ot(0) >= 7 && ot(0) <= 20) {
            return ["R2", "R1"];
        }
        return ["R2", ""];
    }
}

function genOpening(offset) {
    function ot(time) {
        // returns the time in utc translated to 24 hour time based on offset
        time = time + offset / 60;
        if (time < 0) {
            return (time + 24) % 24;
        }
        return time;
    }

    if (ot(7) >= 9 && ot(7) <= 20) {
        if ((ot(23) + 24) % 24 >= 8 && (ot(23) + 24) % 24 <= 20) {
            return ["1", true];
        }
        return ["1", false];
    } else if (ot(16) >= 8 && ot(16) <= 20) {
        if ((ot(23) + 24) % 24 >= 8 && (ot(23) + 24) % 24 <= 20) {
            return ["2", true];
        }
        return ["2", false];
    } else {
        return ["3", false];
    }
}

function genFTW(offset) {
    function ot(time) {
        // returns the time in utc translated to 24 hour time based on offset
        time = time + offset / 60;
        if (time < 0) {
            return (time + 24) % 24;
        }
        return time;
    }

    if (ot(6.5) >= 8 && ot(6.5) <= 19) {
        return "1";
    } else if (ot(15.5) >= 7 && ot(15.5) <= 19) {
        return "2";
    }
    return "";
}

function App() {
    const localizer = momentLocalizer(moment);
    const [location, setLocation] = useState("");
    const [offset, setOffset] = useState(0);
    const [timezone, setTimezone] = useState("Greenwich Mean Time");
    const [events, setEvents] = useState(processSchedule(schedule, offset));
    const [primary, setPrimary] = useState("A");
    const [secondary, setSecondary] = useState("");
    const [pc1a, setpc1a] = useState("L");
    const [altPc1a, setAtlPc1a] = useState("");
    const [pc1b, setpc1b] = useState("L");
    const [altPc1b, setAtlPc1b] = useState("");
    const [pc2, setpc2] = useState("L");
    const [altPc2, setAltPc2] = useState("");
    const [opening, setOpening] = useState("1");
    const [altOpening, setAltOpening] = useState(false);
    const [FTW, setFTW] = useState("1");
    const [view, setView] = useState("week");
    const [day, setDay] = useState(moment.unix(1627185600).toDate());

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
        // this functions colors the recommended events
        let backgroundColor = "#e0e0e0";
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
                if (utcStart >= moment("2021-07-26T20:00:00").unix() && utcStart <= moment("2021-07-27T04:30:00").unix()) {
                    backgroundColor = "#d9faf9";
                }
                else if (utcStart >= moment("2021-07-27T20:00:00").unix() && utcStart <= moment("2021-07-28T04:30:00").unix())
                    backgroundColor = "#d9faf9";
                break;
            case "D":
                if (utcStart >= moment("2021-07-26T23:00:00").unix() && utcStart <= moment("2021-07-27T07:30:00").unix())
                    backgroundColor = "#d9faf9";
                else if (utcStart >= moment("2021-07-27T23:00:00").unix() && utcStart <= moment("2021-07-28T07:30:00").unix())
                    backgroundColor = "#d9faf9";
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

            switch (altPc1a) {
                case "L":
                    if (utcStart === moment("2021-07-28T16:00:00").unix())
                        backgroundColor = "#d9faf9";
                    break;
                case "R1":
                    if (utcStart === moment("2021-07-29T00:00:00").unix())
                        backgroundColor = "#d9faf9";
                    break;
                case "R2":
                    if (utcStart === moment("2021-07-29T07:00:00").unix())
                        backgroundColor = "#d9faf9";
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
                    if (utcStart === moment("2021-07-29T07:00:00").unix())
                        backgroundColor = "yellow";
                    break;
                case "R2":
                    if (utcStart === moment("2021-07-29T16:00:00").unix())
                        backgroundColor = "yellow";
                    break;
            }

            switch (altPc1b) {
                case "L":
                    if (utcStart === moment("2021-07-28T21:00:00").unix())
                        backgroundColor = "#d9faf9";
                    break;
                case "R1":
                    if (utcStart === moment("2021-07-29T07:00:00").unix())
                        backgroundColor = "#d9faf9";
                    break;
                case "R2":
                    if (utcStart === moment("2021-07-29T16:00:00").unix())
                        backgroundColor = "#d9faf9";
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

            switch (altPc2) {
                case "L":
                    if (utcStart === moment("2021-07-29T16:00:00").unix())
                        backgroundColor = "#d9faf9";
                    break;
                case "R1":
                    if (utcStart === moment("2021-07-30T00:00:00").unix())
                        backgroundColor = "#d9faf9";
                    break;
                case "R2":
                    if (utcStart === moment("2021-07-30T07:00:00").unix())
                        backgroundColor = "#d9faf9";
                    break;
            }
        }

        switch (opening) {
            case "1":
                if (utcStart === moment("2021-07-25T07:00:00").unix())
                    backgroundColor = "yellow";
                break;
            case "2":
                if (utcStart === moment("2021-07-25T16:00:00").unix())
                    backgroundColor = "yellow";
                break;
            case "3":
                if (utcStart === moment("2021-07-25T23:00:00").unix())
                    backgroundColor = "yellow";
                break;
        }

        if (altOpening) {
            if (utcStart === moment("2021-07-25T23:00:00").unix())
                backgroundColor = "#d9faf9";
        }

        switch (FTW) {
            case "1":
                if (utcStart === moment("2021-07-25T06:30:00").unix())
                    backgroundColor = "yellow";
                break;
            case "2":
                if (utcStart === moment("2021-07-25T15:30:00").unix())
                    backgroundColor = "yellow";
                break;
        }

        const style = {
            backgroundColor,
            color: "black"
        };

        return { style };
    }

    useEffect(() => {
        setEvents(processSchedule(schedule, offset));
        // following logic based on Mark's flowchart

        const [nextPrimary, nextSecondary] = genRecommended(offset);
        const [next1a, nextAlt1a] = gen1a(offset);
        const [next1b, nextAlt1b] = gen1b(offset);
        const [next2, nextAlt2] = gen2(offset);
        const [nextOpening, nextAltOpening] = genOpening(offset);
        const nextFTW = genFTW(offset);
        if (nextPrimary !== primary) {
            setPrimary(nextPrimary);
        }
        if (nextSecondary !== secondary) {
            setSecondary(nextSecondary);
        }
        if (next1a !== pc1a) {
            setpc1a(next1a);
        }
        if (nextAlt1a !== pc1a) {
            setAtlPc1a(nextAlt1a);
        }
        if (next1b !== pc1b) {
            setpc1b(next1b);
        }
        if (nextAlt1b !== pc1b) {
            setAtlPc1b(nextAlt1b);
        }
        if (next2 !== pc2) {
            setpc2(next2);
        }
        if (nextAlt2 !== altPc2) {
            setAltPc2(nextAlt2);
        }
        if (nextOpening !== opening) {
            setOpening(nextOpening);
        }
        if (nextAltOpening !== altOpening) {
            setAltOpening(nextAltOpening);
        }
        if (nextFTW !== FTW) {
            setFTW(nextFTW);
        }
    }, [
        offset,
        primary,
        secondary,
        pc1a,
        altPc1a,
        pc1b,
        altPc1b,
        pc2,
        altPc2,
        view,
        day,
        opening,
        altOpening,
        FTW
    ]);

    return (
        <div className="App">
            <img src={banner1} alt="CRS conference banner" />

            <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLocation();
            }}>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Please enter your location:" />
                <button type="submit">Set Location!</button>
                <div>
                    Select your view:
                    <button style={{ marginLeft: "8px" }} onClick={() => setView("day")}>Day</button>
                    <button onClick={() => setView("week")}>Week</button>
                </div>
                {view === "day" && (
                    <div>
                        Select which day to show:
                        <button style={{ marginLeft: "8px" }} onClick={() => setDay(moment.unix(1627185600).toDate())}>Sunday 25th</button>
                        <button onClick={() => setDay(moment.unix(1627272000).toDate())}>Monday 26th</button>
                        <button onClick={() => setDay(moment.unix(1627358400).toDate())}>Tuesday 27th</button>
                        <button onClick={() => setDay(moment.unix(1627444800).toDate())}>Wednesday 28th</button>
                        <button onClick={() => setDay(moment.unix(1627531200).toDate())}>Thursday 29th</button>
                        <button onClick={() => setDay(moment.unix(1627617600).toDate())}>Friday 30th</button>
                    </div>
                )}
            </form>
            <p>Currently showing schedule for <strong>{timezone}</strong>, {view === "week" ? "July 25 – 31, 2021" : moment(day).format("dddd Do")}</p>
            <p><span id="yellow">YELLOW</span> = recommended schedule, <span id="blue">BLUE</span> = alternate schedule</p>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                date={day} // Unix timestamp for June 11
                views={["week", "day"]}
                eventPropGetter={eventStyleGetter}
                showMultiDayTimes
            />
        </div>
    );
}

export default App;
