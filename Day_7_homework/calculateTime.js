let minutes = 8000;
const minutesPerHour = 60;
const secondsPerMinute = 60;

let totalHours = minutes / minutesPerHour;
let totalSeconds = minutes * secondsPerMinute;

let hoursDisplay = Math.floor(totalHours);
let remainingMinutes = (minutes % minutesPerHour).toFixed(2);
let remainingSeconds = (totalSeconds % secondsPerMinute).toFixed(2);

console.log("Time:" + hoursDisplay + ":" + remainingMinutes + ":" + remainingSeconds);
