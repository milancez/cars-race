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
      filter: ""
    }

  }

  componentWillMount() {
    this.getData().then(res => {

      // akcija koja smesta podatke u reducer
      this.props.setData(res.data);
      this.props.setCars(res.data.cars);
      this.setState({
        cars: res.data.cars
      })
    });
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

  render() {
    let { cars } = this.state;
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
