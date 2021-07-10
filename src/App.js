import './App.css';
import { schedule } from "./schedule.js";
import moment from "moment-timezone";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    const events = processSchedule(schedule, 60);
    const localizer = momentLocalizer(moment);
    return (
        <div className="App">
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
