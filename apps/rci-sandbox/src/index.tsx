import 'modern-normalize'
import './index.css'
import { render } from 'react-dom'
import { Example } from './Example'

const expected = '123123'
const a11yId = 'code-input'

const Page = () => (
  <div>
    <h1>
      <code>rci</code> example
    </h1>
    <label htmlFor={a11yId}>
      authentication code&emsp;<span>expected: {expected}</span>
    </label>
    <Example id={a11yId} expected={expected} />
    <a
      href='https://github.com/leonardodino/rci'
      title='leonardodino/rci'
      style={{ display: 'block', padding: '1rem 0', margin: '2rem 0' }}
    >
      <code>rci</code> @ GitHub
    </a>
  </div>
)

render(<Page />, document.getElementById('root'))
