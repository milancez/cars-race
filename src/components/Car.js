import React, { Component } from 'react';

class Car extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() { 
    let { car } = this.props;
    return ( 
      <div className='car'>
        <div className='car_box'>
          <div className='car_name'>{ car.name }</div>
          <div className='img_box'>
            <img src={car.image} />
          </div>
          <div className='img_overlay'></div>
        </div>
      </div>
    );
  }
}
 
export default Car;