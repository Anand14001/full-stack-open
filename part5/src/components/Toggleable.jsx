import { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Toggleable = (props) => {
  const [visible, setVisible] = useState(false)

  const hiddenWhenVisible = { display: visible? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }


  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.blogRef, () => {
    return { toggleVisibility }
  })
  return(
    <div>
      <div style={hiddenWhenVisible}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>

      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>

    </div>
  )
}

Toggleable.propTypes = {
  blogRef: PropTypes.object.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default Toggleable