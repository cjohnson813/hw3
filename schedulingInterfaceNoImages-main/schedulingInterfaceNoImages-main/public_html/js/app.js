const http = require('http');
const url = require('url');
// import the sendFile module
const { sendFile } = require('./sendFile');

const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = [
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }];

let serverObj =  http.createServer(function(req,res){
	console.log(req.url);
	let urlObj = url.parse(req.url,true);
	//parsed url options
	switch (urlObj.pathname) {
		case "/schedule":
			schedule(urlObj.query,res);
			break;
		case "/cancel":
			cancel(urlObj.query,res);
			break;
		case "/check":
			check(urlObj.query,res);
			break;
		// replaced error with a map for serving index.html based on "/"
		default:
			// serve static file
			const filePath = urlObj.pathname === "/" ? "./index.html" : "." + urlObj.pathname;
			sendFile(res, filePath);
	}
});

function schedule(qObj,res) {
	if (availableTimes[qObj.day].some(time => time == qObj.time))
	{
		// remove the time from availableTimes
		const index = availableTimes[qObj.day].findIndex(time => time == qObj.time);
		if (index !== -1) {
			availableTimes[qObj.day].splice(index, 1);
		}
		// add the appointment
		appointments.push({
			name: qObj.name,
			day: qObj.day,
			time: qObj.time,
		});
		//send user confirmation
		res.writeHead(200,{'content-type':'text/plain'});
		res.write("scheduled");
		res.end();
		//print updated arrays to console
		console.log("Appointments:", appointments);
		console.log("Available Times:", availableTimes);
	}
	//error response
	else
	{
		error(res,400,"Can't schedule");
	}
}

function cancel(qObj, res)
{
	// find appointment from url
	const index = appointments.findIndex(a =>
		a.name === qObj.name &&
		a.day === qObj.day &&
		a.time === qObj.time );
	if (index !== -1) {
		const { day, time } = appointments.splice(index, 1)[0];
	//put time slot back into availableTimes
		if (!availableTimes[day]) {
			 availableTimes[day] = [];
		}
		if (!availableTimes[day].includes(time)) {
			availableTimes[day].push(time);
		}
		//send user response to notify appt canceled
		res.writeHead(200,{'content-type':'text/plain'});
		res.write('Appointment has been canceled');
		res.end();
		//print updated array to console
		console.log("Appointments:", appointments);
		console.log("Available Times:", availableTimes);
	}
	//error response
	else {
		error(res,404,"Appointment not found");
	}
}

function check(qObj, res)
{
	// checks if input day is an option
	if (!availableTimes[qObj.day] || !availableTimes[qObj.time]) {
		return error(res,400,"Unknown Day or Time")
	}
	// returns positive if day & time are available
	if (availableTimes[qObj.day].includes(qObj.time)) {
		res.writeHead(200,{'content-type':'text/plain'});
		res.write("Appointment time is available");
		res.end();
	}
	// returns negative res if appt slot is not in array
	else {
		res.writeHead(200,{'content-type':'text/plain'});
		res.write("Appointment time is not available");
		res.end();
	}

	console.log(`Checked: day=${qObj.day}, time=${qObj.time}`);
}
