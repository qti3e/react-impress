import React, {Component} from 'react'
import {noop, $, css, perspective, scale, toNumber, translate, rotate} from '../helpers'
import Events from '../events'

class Impress extends Component{
  constructor(props){
    super(props)

    let body = document.body

    // First we set up the viewport for mobile devices.
    // For some reason iPad goes nuts when it is not done properly.
    let meta = $("meta[name='viewport']") || document.createElement("meta")
    meta.content = "width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no"
    if(meta.parentNode !== document.head){
        meta.name = 'viewport'
        document.head.appendChild(meta)
    }

    this.windowScale = this.computeWindowScale()

    // set initial styles
    document.documentElement.style.height = "100%"

    css(body, {
      height: "100%",
      overflow: "hidden"
    })

    let canvasStyles = {
      position: "absolute",
      transformOrigin: "top left",
      transition: "all 0s ease-in-out",
      transformStyle: "preserve-3d",
    }

    body.classList.remove("impress-disabled")
    body.classList.add("impress-enabled")

    this.styles = {
        rootStyles: {
          ...canvasStyles,
          top: "50%",
          left: "50%",
          transform: perspective(props.perspective/this.windowScale) + scale(this.windowScale)
        },
        canvasStyles,
    }

    this.state = {
      currentStep: 0
    }

    this.currentState = {
      translate: { x: 0, y: 0, z: 0 },
      rotate: { x: 0, y: 0, z: 0 },
      scale: 1
    }

    this.API = {
      goTo: this.goTo.bind(this),
      next: this.next.bind(this),
      prev: this.prev.bind(this)
    }
    this.props.onGotAPI(this.API)
    this.events = Events(this.API)
  }

  // `computeWindowScale` counts the scale factor between window size and size
  // defined for the presentation in the config.
  computeWindowScale = () => {
    let hScale = window.innerHeight / this.props.height,
        wScale = window.innerWidth / this.props.width,
        scale = hScale > wScale ? wScale : hScale

    if (this.props.maxScale && scale > this.props.maxScale) {
        scale = this.props.maxScale
    }

    if (this.props.minScale && scale < this.props.minScale) {
        scale = this.props.minScale
    }

    return scale
  }

  calculateStyles = () => {
    if(!this.props.children)
      return
    // Sometimes it's possible to trigger focus on first link with some keyboard action.
    // Browser in such a case tries to scroll the page to make this element visible
    // (even that body overflow is set to hidden) and it breaks our careful positioning.
    //
    // So, as a lousy (and lazy) workaround we will make the page scroll back to the top
    // whenever slide is selected
    //
    // If you are reading this and know any better way to handle it, I'll be glad to hear about it!
    window.scrollTo(0, 0)

    let id = this.state.currentStep
    let step = this.props.children[id]
    if(!step)
      step = this.props.children
    let duration = this.duration

    // Compute target state of the canvas based on given step
    let target = {
        rotate: {
          x: -step.props.rotateX,
          y: -step.props.rotateY,
          z: -(step.props.rotateZ || step.props.rotate)
        },
        translate: {
          x: -step.props.x,
          y: -step.props.y,
          z: -step.props.z
        },
        scale: 1 / step.props.scale
    }

    // Check if the transition is zooming in or not.
    //
    // This information is used to alter the transition style:
    // when we are zooming in - we start with move and rotate transition
    // and the scaling is delayed, but when we are zooming out we start
    // with scaling down and move and rotation are delayed.
    let zoomin = target.scale >= this.state.scale
    let delay = (duration / 2)

    this.windowScale = this.computeWindowScale()

    let targetScale = target.scale * this.windowScale

    // Here is a tricky part...
    //
    // If there is no change in scale or no change in rotation and translation, it means there was actually
    // no delay - because there was no transition on `root` or `canvas` elements.
    // We want to trigger `impress:stepenter` event in the correct moment, so here we compare the current
    // and target values to check if delay should be taken into account.
    //
    // I know that this `if` statement looks scary, but it's pretty simple when you know what is going on
    // - it's simply comparing all the values.
    if ( this.currentState.scale === target.scale ||
        (this.currentState.rotate.x === target.rotate.x && this.currentState.rotate.y === target.rotate.y &&
         this.currentState.rotate.z === target.rotate.z && this.currentState.translate.x === target.translate.x &&
         this.currentState.translate.y === target.translate.y && this.currentState.translate.z === target.translate.z) ) {
        delay = 0
    }

    // store current state
    this.currentState = target

    clearTimeout(this.stepEnterTimeout)
    this.stepEnterTimeout = setTimeout(function() {
        // onStepEnter(activeStep);
    }, duration + delay)

    // Now we alter transforms of `root` and `canvas` to trigger transitions.
    //
    // And here is why there are two elements: `root` and `canvas` - they are
    // being animated separately:
    // `root` is used for scaling and `canvas` for translate and rotations.
    // Transitions on them are triggered with different delays (to make
    // visually nice and 'natural' looking transitions), so we need to know
    // that both of them are finished.
    this.styles = {
      rootStyles: {
        ...this.styles.rootStyles,
        // to keep the perspective look similar for different scales
        // we need to 'scale' the perspective, too
        transform: perspective(this.props.perspective / targetScale) + scale(targetScale),
        transitionDuration: duration + "ms",
        transitionDelay: (zoomin ? delay : 0) + "ms"
      },
      canvasStyles: {
        ...this.styles.canvasStyles,
        transform: rotate(target.rotate, true) + translate(target.translate),
        transitionDuration: duration + "ms",
        transitionDelay: (zoomin ? 0 : delay) + "ms"
      }
    }
  }

  goTo = (idOrEl, duration) => {
    if(typeof idOrEl !== 'number'){
      idOrEl = parseInt(idOrEl.dataset.id)
      if(isNaN(idOrEl)){
        return
      }
    }
    this.duration = toNumber(duration, this.props.transitionDuration)
    this.setState({
      currentStep: idOrEl
    })
  }

  next = (duration) => {
    if(!this.props.children || !this.props.children.length)
      return
    let step = (this.state.currentStep + 1) % this.props.children.length
    return this.goTo(step, duration)
  }

  prev = (duration) => {
    if(!this.props.children || !this.props.children.length)
      return
    let step = this.state.currentStep - 1
    return this.goTo(step < 0 ? this.props.children.length - 1 : step, duration)
  }

  componentWillMount(){
    this.events.listen()
  }

  componentWillUnmount(){
    clearTimeout(this.stepEnterTimeout)
    this.events.remove()
  }

  render(){
    this.calculateStyles()

    let childrenWithProps = React.Children.map(this.props.children, (child, id) =>
      React.cloneElement(child, {
        active: id == this.state.currentStep,
        id: id
      })
    )

    return (
      <div style={this.styles.rootStyles}>
        <div style={this.styles.canvasStyles}>
          {childrenWithProps}
        </div>
      </div>
    )
  }
}

Impress.defaultProps = {
  width: 1024,
  height: 768,
  maxScale: 1,
  minScale: 0,
  perspective: 1000,
  transitionDuration: 1000,
  onGotAPI: API => null
}

export default Impress
