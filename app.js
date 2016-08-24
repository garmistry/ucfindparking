const request = require('request'); 
const cheerio = require('cheerio');
const mongoose = require('mongoose');

const data = require('./models/entry.js');

mongoose.connect('mongodb://root:36rzkhLRgfQJ@localhost/parking');

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
				capacity : size, 
				dateMonth: date[0], 
				dateDay: date[1], 
				dateYear: date[2],
				hour: time[0],
				minute: time[1],
				second: time[2]	
			});
			entry.save(function(err){
				if(err){
					console.log('err '+ err);
				}
				else{
					console.log('pushed ' +  i );
				}
			});
		});
	});	
}

setInterval(runtest, 5*1000);


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