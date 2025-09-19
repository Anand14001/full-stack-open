import { screen, render } from "@testing-library/react";
import CreateBlogForm from './BlogForm'
import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe('<CreateBlogForm/>', () => {
    test('calls the createBlog event handler with the right details when a new blog is created', async() => {
        const mockCreateBlog = vi.fn()
        const user = userEvent.setup()

        render(
            <CreateBlogForm createBlog={mockCreateBlog}/>
        )

        const titleInput = screen.getByLabelText('title')
        const authorInput = screen.getByLabelText('author')
        const urlInput = screen.getByLabelText('url')

        await user.type(titleInput, 'test blog')
        await user.type(authorInput, 'test author')
        await user.type(urlInput, 'www.testblog.com')

        const createButton = screen.getByText('Create')
        await user.click(createButton)

        console.log(mockCreateBlog.mock.calls)
        
        expect(mockCreateBlog).toBeCalledTimes(1)
        expect(mockCreateBlog).toBeCalledWith({
            title:'test blog',
            author:'test author',
            url:'www.testblog.com'
        })
    })
})