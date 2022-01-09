function blog( { posts } ) {
    const elements = posts.map( post => <li>{post.title}</li>);
    return <ul>elements</ul>
}