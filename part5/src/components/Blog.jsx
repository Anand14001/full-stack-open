import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, updateBlog, user, removeBlog }) => {
  const [blogDataVisible, setBlogDataVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const showBlogData = { display: blogDataVisible? '' : 'none' }

  const toggleVisibility = () => {
    setBlogDataVisible(!blogDataVisible)
  }

  const handleLike = async() => {
    try{
      const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user?.id
      }

      await updateBlog(blog.id, updatedBlog)
      setLikes(likes + 1)
    }catch(error){
      console.log('error while adding like', error)
    }
  }

  const handleRemove = () => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if(confirmed){
      removeBlog(blog.id)
    }
  }


  const blogStyle = {
    border: '2px solid #000',
    margin: '10px',
    padding: '10px',
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
  }

  return(
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button id='blog_view_btn' onClick={toggleVisibility}>{blogDataVisible ? 'hide' : 'view'}</button>
      </div>

      <div style={showBlogData}>
        <p>{blog.url}</p>
        <div style={{ display:'flex', flexDirection:'row', alignItems: 'center', gap: '10px' }}>
          <p>likes: {likes}</p> {/* Use local state for likes */}
          <button
          id='like_btn'
            onClick={handleLike}
            style={{
              padding: '5px 10px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            like
          </button>

        </div>
        <p>{user.name}</p>
        {blog.user?.id === user.id && (
          <button id='remove-button' style={{ backgroundColor:'blue', color:'#ffff' }} onClick={handleRemove}>remove</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog