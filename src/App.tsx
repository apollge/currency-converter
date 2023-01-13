import React from 'react';

import './App.css';

import Header from './components/Header';
import { fetchRates } from './utils/api';

const App = () => {
  const handleSubmit = async () => {
    try {
      const rates = await fetchRates('EUR');
      console.log(rates);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  return (
    <div className="app">
      <div className="app__content">
        <Header />
        <button onClick={handleSubmit}>get rates</button>
      </div>
    </div>
  );
};

export default App;
