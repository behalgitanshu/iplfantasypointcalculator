import React from 'react';
import './App.css';
import { Scoreboard } from './components/ScoreBoard';
import { createAnExcelSheetWithDummyData } from './Experiments/ExcelTest';

function App() {
  return (
    <div className="App">
      <button onClick={() => createAnExcelSheetWithDummyData()}>Gitanshu's Experiment Trigger</button>
      <Scoreboard />
    </div>
  );
}

export default App;
