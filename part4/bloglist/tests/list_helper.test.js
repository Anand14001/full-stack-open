const {test, describe} = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('dummy test returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)

    return assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const blogs = []

        return assert.strictEqual(totalLikes(blogs), 0)
    })

    test ('when list has only one blogs equals the likes of that', () => {
        const listWithOneBlog = [
            {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
            }
        ]

        return assert.strictEqual(totalLikes(listWithOneBlog), listWithOneBlog[0].likes)
    })

    test('of a bigger list is calculated right', () => {
        const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
        console.log('total likes', likes)

        return assert.strictEqual(totalLikes(blogs), likes)
    })

})

describe ('favorite blogs', () => {
  test('when list has only one blog then it is the favorite', () => {
    const result = favoriteBlog([blogs[0]])
    console.log('favorite blog:', result)
    return assert.deepStrictEqual(result, blogs[0])
  })

  test('of empty list is zero', () => {
    const blog = []
    const result = favoriteBlog(blog)
    return assert.deepStrictEqual(result, null)
  })

  test('of a bigger list is calculated right', () => {
    const result = favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[2])
  })
})

describe ('most blogs', () => {
  test('where list is empty return null', () => {
    const result = mostBlogs([])
    assert.deepStrictEqual(result, null)
  })

   test('when list has only one blog, returns its author with count 1', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    assert.deepStrictEqual(result, { author: 'Michael Chan', blogs: 1 })
  })

  test('Of the biggest list is calculated right', () => {
    const result = mostBlogs(blogs)

    assert.deepStrictEqual(result, {author: 'Robert C. Martin', blogs:3})
  })
})

describe('most likes', () => {
  test('when list is empty and returns null' , () => {
    const result = mostLikes([])

    assert.deepStrictEqual(result, null)
  })

  test('when list have only one blog', () => {
    const result = mostLikes([blogs[0]])

    assert.deepStrictEqual(result, {
      author: 'Michael Chan', likes: 7
    })
  })

  test('Of the biggest lost is calculated right', () => {
    const result = mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra', likes: 17
    })
  })
})