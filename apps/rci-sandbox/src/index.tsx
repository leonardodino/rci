import './index.css'
import { createRoot } from 'react-dom/client'
import { Example } from './Example'

const Page = ({ expected = '123123', a11yId = 'code-input' }) => (
  <div>
    <h1 className='my-6 text-[2em] font-bold'>
      <code>rci</code> example
    </h1>
    <label htmlFor={a11yId} className='block pb-2.5'>
      authentication code&emsp;
      <span className='opacity-50'>expected: {expected}</span>
    </label>
    <Example id={a11yId} expected={expected} />
    <a
      href='https://github.com/leonardodino/rci'
      title='leonardodino/rci'
      className='text-current no-underline'
      style={{ display: 'block', padding: '1rem 0', margin: '2rem 0' }}
    >
      <code>rci</code> @ GitHub
    </a>
  </div>
)

const element = document.getElementById('root')
if (element) createRoot(element).render(<Page />)
