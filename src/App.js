import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import './App.css';
import { 
  setData,
  setCars
} from './actions';
import Car from './components/Car';
const DATA_URL = './data.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cars: [],
      filter: '',
      raceCarDimension: '',
      raceCarRowHeight: '',
      distanceParts: [],
      speedLimits: [],
      traficLights: [],
      redLights: []
    }

  }

  componentWillMount() {
    this.getData().then(res => {

      // Akcija koja smesta podatke u reducer
      this.props.setData(res.data);
      this.props.setCars(res.data.cars);

      this.calculateDistanceParts(res.data.distance);
      this.generateSpeedLimits(res.data.speed_limits);
      this.generateTraficLights(res.data.traffic_lights);

      this.setState({
        cars: res.data.cars
      });
    });
  }

  componentDidMount() {
    this.calculateRaceCarDimension();
  }

  forceAppUpdate = () => {
    this.forceUpdate();
  }

  // Funckija sa axios pozivom ka data.json fajlu
  getData = () => {
    return axios.get(DATA_URL);
  }

  // Filtriranje automobila na osnovu unesenog niza karaktera u input polje
  filterCars = (filter) => {
    let cars = this.props.cars.filter(car => {
      let e = new RegExp(filter || "", "i");
      return e.test(car.name);
    });

    this.setState({
      cars
    })
  } 

  handleFilterChange = e => {
    let filter = e.target.value;

    // Ukoliko zelimo filtranje tek nakon klika na search dugme, zakomentarisati filterCars poziv
    this.filterCars(filter);

    this.setState({
      filter
    })
  }

  // Rekurzivna funkcija za dinamicni prikaz matrice automobila
  drowCarsList = (start, end) => {
    let { cars } = this.state;

    return (
      <React.Fragment>
        <div className='car_row'>
          {
            cars.slice(start, end).map((car, index) => (
              <Car key={index} car={car} forceAppUpdate={this.forceAppUpdate} />
            ))
            
          }
        </div>
        { start + 3 < this.state.cars.length ? this.drowCarsList(start + 3, end + 3) : "" }
      </React.Fragment>
    )
  }

  calculateRaceCarDimension = () => {
    let el = document.querySelector('.race_track');

    // Visina trake jednog vozila, visina jednog reda na traci
    let raceCarRowHeight = 0.1 * el.offsetWidth;

    //Dimenzije vozila na traci, 10% sirine cele trake - 20px
    let raceCarDimension = 0.1 * el.offsetWidth - 20;

    this.setState({
      raceCarDimension,
      raceCarRowHeight
    })
  }

  drowRaceCarColumns = index => {    
    return (
      <React.Fragment>
        <div className={'race_car_col' + (index === 10 ? ' last_col' : '')}></div>
        { index < 10 ? this.drowRaceCarColumns(index + 1) : "" }
      </React.Fragment>
    )
  }

  // Racunanje dela trase i kreiranje niza za prikaz distance na tom delu trase
  calculateDistanceParts = distance => {
    let distancePart = distance / 10;
    let distanceParts = [];

    for (let i = 1; i <= 9; i++) {
      distanceParts.push(i * distancePart);
    }

    this.setState({
      distanceParts
    })
  }

  // Generisanje niza objekta znakova sa pozicijama konvertovanim u procentima
  generateSpeedLimits = speedLimits => {
    speedLimits.map(c => {
      c.position = this.convertKilometerToPercent(c.position)
    });

    this.setState({
      speedLimits
    });
  }

  // Generisanje niza objekta semafora sa pozicijama konvertovanim u procentima
  generateTraficLights = traficLights => {
    let redLights = [];
    traficLights.map((c, index) => {
      c.position = this.convertKilometerToPercent(c.position);

      // Inicijalizuje se status crvenog svetla za mapirani semafor
      redLights.push(false);

      // Poziv funkciji koja setuje interval promene svetla na semaforu
      this.setTraficLightInterval(index, c.duration)
    });

    this.setState({
      traficLights,
      redLights
    });
  }

  // Setuje se interval promene statusa crvenog svetla za odredjeni semafor, semafor za prosledjenim indeksom i
  setTraficLightInterval = (i, duration) => {
    let { redLights } = this.state;
    setInterval(() => {
      redLights[i] = redLights[i] !== null && redLights[i] !== undefined && redLights[i] !== '' ? !redLights[i] : false;
      
      this.setState({
        redLights
      });

    }, duration)
  }

  // Konvertovanje u procente pocizije koja je dobijena u kilometrima iz JSON fajla
  convertKilometerToPercent = km => {
    let { distance } = this.props.data; // Ukupna distanca dobijena iz JSON fajla

    return 100 * km / distance;
  }



  render() {
    let { cars, distanceParts, speedLimits, traficLights, redLights } = this.state;
    let { raceCars } = this.props;

    console.log('Race cars: ', raceCars);

    return (
      <div className='app'>
        <div className='container'>
          <div className='filter_box'>
            <input type='text' placeholder='Filter cars' onChange={this.handleFilterChange} />
            <button onClick={() => this.filterCars(this.state.filter)}><i className='fas fa-search'></i></button>
          </div>
          <div className='cars_list'>
            {
              cars.length > 0 ? this.drowCarsList(0, 3) : ''
            }
          </div>
          <div className='race_track_wrap'>
            <div className={'race_track_header' + (raceCars.length === 0 ? ' hide' : '')}>
              {
                distanceParts.map(distance => (
                  <div className='race_track_distance_part' key={distance}><span>{distance}</span></div>
                ))
              }
            </div>
            <div className={'race_track' + (raceCars.length === 0 ? ' hide_box' : '')}>
              {
                raceCars.map((car, index) => (
                  <div key={index} className={'race_car_row' + (raceCars.length - 1 === index ? ' last_row' : '')} style={{height: this.state.raceCarRowHeight}}>
                    { this.drowRaceCarColumns(1) }
                    <div 
                      className='race_car' 
                      style={{
                        width: this.state.raceCarDimension,
                        height: this.state.raceCarDimension,
                        backgroundImage: `url(${car.image})`
                      }}
                    >
                    </div>
                  </div>
                ))
              }
              <div className={'limits_row' + (raceCars.length === 0 ? ' hide' : '')}>

                {
                  speedLimits.map((item, i) => (
                    <div key={i} className='limit_speed_col' style={{ left: `${item.position}%` }}>
                      <div className='dash_line'>
                        <div className='limit_speed'>
                          { item.speed }
                        </div>
                      </div>                      
                    </div>
                  ))                  
                }

                {
                  traficLights.map((item, i) => (
                    <div key={i} className='limit_speed_col' style={{ left: `${item.position}%` }}>
                      <div className='dash_line'>
                        <div className='traffic_lights'>
                          <div className={'light_color red' + (!redLights[i] ? ' light_color_disable' : '')}></div>
                          <div className={'light_color green' + (redLights[i] ? ' light_color_disable' : '')}></div>
                        </div>
                      </div>
                      
                    </div>
                  ))
                }

              </div>
            </div>
          </div> 
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.getData,
    cars: state.getCars,
    raceCars: state.getRaceCars
  }
}

export default connect(
  mapStateToProps, 
  {
    setData,
    setCars
  }
)(App);
