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
import Impress, {Step} from 'impress.js-react'
import ReactDOM from 'react-dom'

const Presentation = () => (
  <Impress>
    <Step x={50} y={300} z={35}>
      Hello World
    </Step>
    <Step x={50} y={30} z={35}>
      Test
    </Step>
  </Impress>
)

ReactDOM.render(<Presentation />, document.getElementById('root'))
```

# Todo
- [ ] Slide component
- [ ] Support background related attributes
- [ ] Animations

# Contributions

This project is open for new contributions :)  
Please help me to improve this code in any way you can
