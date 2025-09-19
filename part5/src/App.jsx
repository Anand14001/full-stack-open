import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notifications from './components/Notifications'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const BlogFormRef = useRef()

  const sortBlogsByLikes = (blogArray) => {
    return[...blogArray].sort((a,b) => b.likes - a.likes)
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sorteBlogs = sortBlogsByLikes(blogs)
      setBlogs(sorteBlogs)}
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBloglistUser')
    if(loggedUser){
      const user =  JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])



  const createBlog = async (newObject) => {
    try {

      const response = await blogService.createBlog(newObject)
      const createdBlog = blogs.concat(response)
      const sortedBlogs = sortBlogsByLikes(createdBlog)
      setBlogs(sortedBlogs)
      BlogFormRef.current.toggleVisibility()
      setSuccessMessage(`A new blog "${response.title}" by ${response.author} added!`)
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch (err) {
      setErrorMessage('Error creating blog: ' + err.response?.data?.error || err.message)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const response = await blogService.updateBlog({
        updatedObject: updatedBlog,
        id: id
      })
      const updatedBlogs = blogs.map(blog => blog.id === id ? response : blog)
      const sortedBlogs = sortBlogsByLikes(updatedBlogs)
      setBlogs(sortedBlogs)
    } catch (error) {
      setErrorMessage('Error while updating blog: ' + error.response?.data?.error || error.message)
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  const removeBlog = async(id) => {
    try{
      await blogService.deleteBlog(id)
      const deletedBlog = blogs.filter(blog => blog.id !== id)
      const sorteBlogs = sortBlogsByLikes(deletedBlog)
      setBlogs(sorteBlogs)

      setSuccessMessage('Blog deleted successfully!')
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }catch(error){
      setErrorMessage('error while removing blog', error?.response?.data?.error || error.message)
      setTimeout(() => {
        setErrorMessage('')
      },3000)
    }
  }


  const handleLogin = async (loginObject) => {
    try{
      const user = await loginService.login(loginObject)
      setUser(user)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setSuccessMessage(`Logged in successfully!, welcome back ${user.name}`)
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }catch(err){
      setErrorMessage('Error while logging in!',err.response?.data?.error || err.message)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }


  const handleLogout = () => {
    try{
      window.localStorage.removeItem('loggedBloglistUser')
      setUser(null)
      blogService.setToken(null)
      setSuccessMessage('Logged out successfully!')
      setTimeout(() => {
        setSuccessMessage('')
      }, 2000)
    }catch(err){
      setErrorMessage('error while logging out', err.response?.data?.error || err.message)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }


  const BlogForm = () => (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <p>{user.name} logged in!</p>
        <button
          style={{
            padding: '6px 12px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}

          onClick={handleLogout}
        >
        logout
        </button>
      </div>
      <div>
        <Toggleable buttonLabel='Create new blog' blogRef={BlogFormRef} >
          <CreateBlogForm createBlog={createBlog}/>
        </Toggleable>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} user={user} removeBlog={removeBlog}/>
      )}
    </div>
  )


  return (
    <div>
      <h1>{user ? 'Blogs' : 'Login to application'}</h1>
      <Notifications
        message={errorMessage || successMessage}
        type={errorMessage ? 'error' : 'success'}
      />
      {!user && <LoginForm handleSubmit={handleLogin}/>}
      {user && BlogForm()}
    </div>
  )

}

export default App