# React Impress
Rewrite Impress.js presentation framework for React & JSX

# Install
This package is available on NPM:
```
npm install --save impress.js-react
```

# Example
```js
import React from 'react'
import Impress, {Step, Slide} from 'impress.js-react'
import ReactDOM from 'react-dom'

const Presentation = () => (
  <Impress>
    <Slide x={50} y={300} z={35}>
      Hello World
    </Slide>
    <Step x={50} y={30} z={35}>
      Test
    </Step>
    <img x={40} rotateX={45} src='./pic.png' />
  </Impress>
)

ReactDOM.render(<Presentation />, document.getElementById('root'))
```

# Todo
- [x] Slide component
- [ ] Auto circle generator
- [ ] Overview component
- [ ] Support background related attributes
- [ ] Animations

# Contributions

This project is open for new contributions :)  
Please help me to improve this code in any way you can
