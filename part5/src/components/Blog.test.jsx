import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog"
import { describe, expect, test, vi } from "vitest";

describe("<Blog/>", () => {
  const mockBlog = {
    id:'1',
    title:'Test Blog',
    author:'Test Author',
    url:'www.testblog.com',
    likes: 8,
    user:{
      id:'user1',
      name:'test user'
    }
  }

  const mockUser = {
    id:'user1',
    name:'test user'
  }

  const mockUpdateBlog = vi.fn()
  const mockRemoveBlog = vi.fn()

  test('render blog title and author by default', () => {
    render(
      <Blog blog={mockBlog} removeBlog={mockRemoveBlog} updateBlog={mockUpdateBlog} user={mockUser}/>
    )

    expect(screen.getByText('Test Blog Test Author')).toBeInTheDocument();

    const urlElement = screen.queryByText('www.testblog.com')
    expect(urlElement).toBeInTheDocument()
    expect(urlElement).not.toBeVisible()

    const likeElement = screen.queryByText('likes: 8')
    expect(likeElement).toBeInTheDocument()
    expect(likeElement).not.toBeVisible()

  })

  test('render likes and url when a button is clicked', async() => {
      const user = userEvent.setup()

      render(
        <Blog
          blog={mockBlog}
          updateBlog={mockUpdateBlog}
          removeBlog={mockRemoveBlog}
          user={mockUser}
        />
      )

      const Button = screen.getByText('view')

      await user.click(Button)

      expect(screen.getByText("www.testblog.com")).toBeVisible();
      expect(screen.getByText("likes: 8")).toBeVisible();
  })


  test('Hide likes and url when button is clicked', async() => {
    const user = userEvent.setup()

    render(
      <Blog user={mockUser} blog={mockBlog} updateBlog={mockUpdateBlog} removeBlog={mockRemoveBlog}/>
    )

    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const hideButton = screen.getByText('hide')
    await  user.click(hideButton)

    expect(screen.getByText("www.testblog.com")).not.toBeVisible()
    expect(screen.getByText("likes: 8")).not.toBeVisible()
  })

  test('clicking like button calls updateBlog handler twice', async() => {
    const user = userEvent.setup()

    render(
      <Blog
        user={mockUser}
        blog={mockBlog}
        updateBlog={mockUpdateBlog}
        removeBlog={mockRemoveBlog}
      />
    )

    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
  })
})