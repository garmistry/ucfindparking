const request = require('request'); 
const cheerio = require('cheerio');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


const data = require('./models/entry.js');

mongoose.connect('mongodb://garfishParking:mistryParking@ec2-54-163-104-129.compute-1.amazonaws.com:27017/parkingData');
//mongoose.connect('mongodb://localhost/parking');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 	console.log("we're live with mongo");
 	setInterval(runtest, 5*1000);
});

function runtest(){
	request("http://secure.parking.ucf.edu/GarageCount/" , function(err, res, body){
		if(err){
			console.log("error: " + err);
		}

		var $ = cheerio.load(body);

		$('tr.dxgvDataRow_DevEx').each(function(i,elem){

			var date = getDate();
			var time = getTime();
			var size = $('#ctl00_MainContent_gvCounts_tccell'+i+'_2').text().trim();

			var entry = new data({
				garageID : i,
				capacity : eval(size), 
				dateMonth: date[0], 
				dateDay: date[1], 
				dateYear: date[2],
				hour: time[0],
				minute: time[1],
				second: time[2]	
			});
			entry.save(function(err,entry){
				if(err){
					console.log('err '+ err);
				}
				console.log(entry.capacity);
				
			});
		});
	});	
}




function getDate() {
	var date = new Date(); 

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;


    var dateArray = [month, day, year];
    return dateArray;
}

function getTime(){
 	var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var timeArray = [hour,min,sec]
    return timeArray;
}