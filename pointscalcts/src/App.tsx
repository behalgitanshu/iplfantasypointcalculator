import React from 'react';
import './App.css';
import { Scoreboard } from './components/ScoreBoard';
import { createAnExcelSheetWithDummyData } from './Experiments/ExcelTest';

function App() {
  return (
    <div className="App">
      <Scoreboard />
    </div>
  );
}

export default App;
