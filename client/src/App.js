import React from 'react';
import './App.css';
import Topbar from './components/Topbar/Topbar'
import CardNavigation from './components/CardNavigation/CardNavigation'
import FlashCard from './components/FlashCard/FlashCard'
import Button from './components/Button/Button';

const controls = ['Back', 'Flip', 'Next']

function App() {
  return (
    <React.Fragment>
      <Topbar/>
        <div className='container'>
          <CardNavigation/>
          <div className='card-container'>
            <FlashCard/>
            <div className='card-controls'>
              {controls.map((control) => {
                return (
                  <Button>{control}</Button>
                )
              })}
            </div>
          </div>
        </div>
    </React.Fragment>
  );
}

export default App;
