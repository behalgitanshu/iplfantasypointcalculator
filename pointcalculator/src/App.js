import React from 'react';
import './App.css';


function getData(eventId) {
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  var url = "https://hsapi.espncricinfo.com/v1/pages/match/scoreboard?lang=en&leagueId=8048&eventId=" + eventId + "&liveTest=false&qaTest=false";
  fetch(proxyUrl + url).then((data) => {
    console.log(data);
  }).catch((e) => {
    console.log("failed to fetch data");
  })
}

function App() {
  getData("1216492");
  return (
    <div className="App">
      <header className="App-header">
        "Hello World"
      </header>
    </div>
  );
}

export default App;
