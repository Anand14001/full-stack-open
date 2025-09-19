import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title, author, url,
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return(
    <div>
      <form onSubmit={addBlog}>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          <label>
                    title
            <input value={title} onChange={(event) => setTitle(event.target.value)}/>
          </label>
          <label>
                    author
            <input value={author} onChange={(event) => setAuthor(event.target.value)}/>
          </label>
          <label>
                    url
            <input value={url} onChange={(event) => setUrl(event.target.value)}/>
          </label>
        </div>
        <button id='create_blog_btn' type='submit'>Create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}
export default BlogForm