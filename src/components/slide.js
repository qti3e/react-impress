import React, {Component} from 'react'
import Step from './step'

let defaultStyle = {
  display: 'block',
  padding: '40px 60px',
  backgroundColor: 'white',
  border: '1px solid rgba(0, 0, 0, .3)',
  borderRadius: '10px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, .1)',
  color: 'rgb(102, 102, 102)',
  textShadow: '0 2px 2px rgba(0, 0, 0, .1)',
  fontSize: '30px',
  lineHeight: '36px',
  letterSpacing: '-1px'
}

class Slide extends Component{
  render(){
    let style = {
      ...defaultStyle,
      width: this.props.width,
      height: this.props.height,
      ...this.props.style
    }
    return (
      <Step {...this.props} style={style}>
        {this.props.children}
      </Step>
    )
  }
}

Slide.defaultProps = {
  style: {},
  x: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  rotate: 0,
  scale: 1,
  width: 900,
  height: 700
}

export default Slide
