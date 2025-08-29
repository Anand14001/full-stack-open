const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + (blog.likes || 0)
    },0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    
    return blogs.reduce((favorite, current) => 
        favorite.likes > current.likes ? favorite : current
    );
}


const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    const blogCounts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1;
        return acc
    }, {})

    const topAuthor = Object.keys(blogCounts).reduce((a,b) => {
       return blogCounts[a] > blogCounts[b] ? a : b
    })

    return {
        author: topAuthor,
        blogs: blogCounts[topAuthor]
    }
    
}

const mostLikes = (blogs) => {
    if(blogs.length === 0 ) {
        return null
    }

    const likeCounts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0 ) +  blog.likes
        return acc
    }, {})

    const topAuthor = Object.keys(likeCounts).reduce((a, b) => {
        return likeCounts[a] > likeCounts[b] ? a:b
    })

    return{
        author: topAuthor,
        likes: likeCounts[topAuthor]
    }
 }



module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}