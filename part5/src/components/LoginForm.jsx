import PropTypes from 'prop-types'
import { useState } from 'react'

const LoginForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    handleSubmit({
      username,
      password
    })
    setUsername('')
    setPassword('')
  }

  return(
    <div>
      <form onSubmit={onSubmit}>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px', }}>
          <label>
                    username
            <input value={username} onChange={(event) => setUsername(event.target.value)}/>
          </label>
          <label>
                    password
            <input type='password' value={password} onChange={(event) => setPassword(event.target.value)}/>
          </label>
        </div>
        <button id='login-btn' type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default LoginForm