import React, { Component } from 'react';

class RaceCar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      raceCarPositionLeft: 0
    }

    this.raceCarInterval = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if ( this.props.start !== prevProps.start ) {
      this.start();
    }
  }

  // Startovanje premestanja automobila sa pocetka na kraj trase
  start = () => {
    let { car } = this.props;

    // Ukupno milisekundi za celu trasu od 100%
    let durationMiliSeconds = this.getDuration(car.speed);

    // Procenat trase koji vozilo predje za jednu milisekundu
    let progressPercentPerMiliseconds = 100 / durationMiliSeconds;

    this.raceInterval(progressPercentPerMiliseconds);

  }

  // Vraca broj milisekundi koliko je potrebno da vozilo predje celu trasu (distance iz JSON fajla)
  getDuration = speed => {
    let { distance } = this.props; // Ukupna distanca dobijena iz JSON fajla

    let durationHours = distance / speed;
    let durationMiliSeconds = durationHours * 60 * 60 * 1000;

    return durationMiliSeconds;
  }

  raceInterval = progressPercentPerMiliseconds => {
    let progress = progressPercentPerMiliseconds * this.props.animationSpeed;

    this.raceCarInterval = setInterval(() => {
      let { raceCarPositionLeft } = this.state;
      
      if ( raceCarPositionLeft + progress >= 90 ) {
          this.setState({
            raceCarPositionLeft: 90
          });
          clearInterval(this.raceCarInterval);
      } else {
          this.setState({
            raceCarPositionLeft: raceCarPositionLeft + progress
          });
      }

    }, 1);
    
  }

  // Prikaz jednog od 10 dela trase
  drowRaceCarColumns = index => {    
    return (
      <React.Fragment>
        <div className={'race_car_col' + (index === 10 ? ' last_col' : '')}></div>
        { index < 10 ? this.drowRaceCarColumns(index + 1) : "" }
      </React.Fragment>
    )
  }

  render() { 
    let { index, car, raceCars, raceCarRowHeight, raceCarDimension } = this.props;
    let { raceCarPositionLeft } = this.state;

    return ( 
      <React.Fragment>
        <div key={index} className={'race_car_row' + (raceCars.length - 1 === index ? ' last_row' : '')} style={{height: raceCarRowHeight}}>
          { this.drowRaceCarColumns(1) }
          <div 
            className='race_car_box'
            style={{
              width: raceCarRowHeight,
              height: raceCarRowHeight,
              left: `${raceCarPositionLeft}%`
            }}
          >
            <div 
              className={'race_car'}
              style={{
                width: raceCarDimension,
                height: raceCarDimension,
                backgroundImage: `url(${car.image})`
              }}
            >
            </div>
          </div>          
        </div>
      </React.Fragment>
    );
  }
}
 
export default RaceCar;