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
      
    }

  }

  componentWillMount() {
    this.getData().then(res => {

      // akcija koja smesta podatke u reducer
      this.props.setData(res.data);
      this.props.setCars(res.data.cars);
    });
  }

  // Funckija sa axios pozivom ka data.json fajlu
  getData = () => {
    return axios.get(DATA_URL);
  }

  // Rekurzivna funkcija za dinamicni prikaz matrice automobila
  drowCarsList = (start, end) => {
    let { cars } = this.props;
    
    return (
      <React.Fragment>
        <div className='car_row'>
          {
            cars.slice(start, end).map((car, index) => (
              <Car key={index} car={car} />
            ))
            
          }
        </div>
        { start + 3 < this.props.cars.length ? this.drowCarsList(start + 3, end + 3) : "" }
      </React.Fragment>
    )
  }

  render() {
    let { cars } = this.props;

    return (
      <div className='app'>
        <div className='container'>
          <div className='cars_list'>
            {
              cars.length > 0 ? this.drowCarsList(0, 3) : ""
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
    cars: state.getCars
  }
}

export default connect(
  mapStateToProps, 
  {
    setData,
    setCars
  }
)(App);
