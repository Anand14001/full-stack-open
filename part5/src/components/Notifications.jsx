import PropTypes from 'prop-types'
const Notification = ({ message, type = 'error' }) => {
  if (message === null || message === '') {
    return null
  }
  const notificationStyle = {
    borderRadius: '10px',
    marginBottom: '10px',
    border: `2px solid ${type === 'success' ? '#4CAF50' : '#f44336'}`,
    color: type === 'success' ? '#4CAF50' : '#f44336',
    fontWeight: 'bold',
    padding:'10px',
    backgroundColor:'#ccc'
  }

  return(
    <div style={notificationStyle} id='notification_container'>
      <p id='notification_txt'>{message}</p>
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default Notification