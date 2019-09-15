import React, { Component } from 'react';
import { connect } from "react-redux";
import { setRaceCars } from '../actions';

class Car extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  toggleSelectCar = () => {
    // Ispituje se da li je odabrani auto vec dodat na listu odabranih, ako jeste brise se sa liste, ako nije i ako na listi ima manje od 3 automobila, dodaje se na listu 
    if ( this.isSelected() ) {
      this.unSelectCar();
    } else if ( this.props.raceCars.length < 3 ) {
        this.selectCar();
    }
  }

  selectCar = () => {
    let { car, raceCars } = this.props;
    
    raceCars.push(car);

    // Setuje se u reducer novi niz selektovanih automobila
    this.props.setRaceCars(raceCars);
    console.log(this.props.raceCars);

    this.props.forceAppUpdate();
    this.forceUpdate();
  }

  unSelectCar = () => {
    let { car } = this.props;

    let raceCars = this.props.raceCars.filter(c => c.id !== car.id);

    // Setuje se u reducer novi niz selektovanih automobila
    this.props.setRaceCars(raceCars);
    
  }

  isSelected = () => {
    let isSelected = false;
    let { car } = this.props;

    this.props.raceCars.map(c => {
      if ( c.id === car.id ) {
        isSelected = true
      }
    });

    return isSelected;

  }

  render() { 
    let { car } = this.props;
    
    return ( 
      <div className='car'>
        <div className={'car_box' + (this.isSelected() ? ' selected' : '')} onClick={() => this.toggleSelectCar()}>
          <div className='car_name'>{car.name}</div>
          <div className='img_box'>
            <img src={car.image} alt={car.name} />
          </div>
          <div className='img_overlay'>
            <div className='car_description'>{car.description}</div>
            <div className='car_speed'>Brzina: {car.speed} km/h</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    raceCars: state.getRaceCars
  }
}
 
export default connect(
  mapStateToProps, 
  {
    setRaceCars
  }
)(Car);