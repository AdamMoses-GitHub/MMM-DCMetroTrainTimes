// set the dev WMATA api key
var wmata_api_key = 'SET_API_KEY_HERE';
// check that the api key is set
if (wmata_api_key === 'SET_API_KEY_HERE')
{
    console.log("You must set 'wmata_api_key' first!");
}
else {
// set the objects used here
const https = require('https');
const fs = require('fs');
const date = new Date();
// saves the json station code data to a markdown and json file
function writeStationCodesToFiles(theData)
{	
	var stationJSON = JSON.parse(theData).Stations;
	var timestampString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	var markdownOutput = "# CURRENT AS OF " + timestampString + "<br/>";
	markdownOutput += "<table>"
	markdownOutput += "<thead><tr><th>Index</th><th>Name</th><th>Lines</th><th>Code</th><th>Shares Station</th></tr></thead><tbody>";
	for (var stationIndex = 0; stationIndex < stationJSON.length; stationIndex++)
	{
		var station = stationJSON[stationIndex];
		var code = station.Code;
		var name = station.Name;
		var lines = station.LineCode1;
		var sharedStation = "";
		if (station.LineCode2 != null)
			lines += " " + station.LineCode2;
		if (station.LineCode3 != null)
			lines += " " + station.LineCode3;
		if (station.LineCode4 != null)
			lines += " " + station.LineCode4;
		if (station.StationTogether1 != null)
			sharedStation = station.StationTogether1;
		if (station.StationTogether2 != null)
			sharedStation += " " + station.StationTogether2;
		markdownOutput += "<tr><td>" + (stationIndex + 1) 
					+ "</td><td>" + name 
					+ "</td><td>" + lines 
					+ "</td><td>" + code 
					+ "</td><td>" + sharedStation 
					+ "</td></tr>\n";
	}
	markdownOutput += "</tbody></table>";
    // write the markdown to file
	fs.writeFile('stationcodes.md', markdownOutput, (err) => {
		  if (err) throw err;
		  console.log('Station Codes Written To \'stationcodes.md\'');
		});
    // write the JSON to file
	fs.writeFile('stationcodes.json', JSON.stringify(JSON.parse(theData).Stations, null, 4), (err) => {
		  if (err) throw err;
		  console.log('Station Codes Written To \'stationcodes.json\'');
		});	
}
// build the URL
var wmataStationCodesURL = 'https://api.wmata.com/Rail.svc/json/jStations?api_key=' + wmata_api_key;
// get from the URL and build the data
https.get(wmataStationCodesURL, (res) => {
  let rawData = '';
  res.on('data', (chunk) => rawData += chunk);
  // once all data has been received, send it to be written to disk
  res.on('end', () => {
	  writeStationCodesToFiles(rawData);
  });
})
// if an error, say so
.on('error', (e) => {
	console.error('Error Fetching Station Codes Data From WMATA.');
	console.error(e);
});
}
