import React, {Component} from 'react'
import {scale, translate, rotate} from '../helpers'

class Step extends Component{
  constructor(props){
    super(props)
    this.step = {
      translate: {
        x: props.x,
        y: props.y,
        z: props.z
      },
      rotate: {
        x: props.rotateX,
        y: props.rotateY,
        z: props.rotateZ || props.rotate
      },
      scale: props.scale
    }
  }

  render(){
    let styles = {
      ...this.props.style,
      position: "absolute",
      transform: "translate(" + (document.dir == 'rtl' ? '' : '-') + "50%,-50%)" +
                 translate(this.step.translate) +
                 rotate(this.step.rotate) +
                 scale(this.step.scale),
      transformStyle: "preserve-3d",
    }

    return (
      <div style={styles} className={this.props.active ? 'active' : ''} data-id={this.props.id}>
        {this.props.children}
      </div>
    )
  }
}

Step.defaultProps = {
  style: {},
  x: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  rotate: 0,
  scale: 1
}

export default Step
