import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';

const RouterContext = createContext(null);
const PostContext = createContext(null);

const routes = [
  { id: crypto.randomUUID(), name: 'Home', url: '#/', element: <Home /> },
  { id: crypto.randomUUID(), name: 'About', url: '#/about', element: <About /> },
  { id: crypto.randomUUID(), name: 'Posts', url: '#/posts', element: <Posts /> },
  { id: crypto.randomUUID(), name: 'Contact', url: '#/contact', element: <Contact /> },
];

const notFound = { name: 'Page not found', element: <NotFound /> };

function getRoute(routeUrl) {
  const route = routes.find(x => x.url === routeUrl);
  return route ?? notFound;
}


const title = "App";
function setTitle(pageTitle) {
  document.title = `${pageTitle} - ${title}`;
}


function App() {
  const [route, setRoute] = useState(() => {
    if (location.hash.length < 2) {
      return routes[0];
    }
    return getRoute(location.hash);
  });

  useEffect(() => {
    setTitle(route.name);
  }, [route]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute(location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <RouterContext.Provider value={route}>
      <PostProvider>
        <div className="container">
          <Header />
          <Main />
          <Footer />
        </div>
      </PostProvider>
    </RouterContext.Provider>
  );
}

function Main() {
  return (
    <div className="main">
      <Content />
      <Sidebar />
      < LikeDislikeBtn />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <a href="#/" className='logo'>useContext / Posts</a>
      <Nav />
    </div>
  );
}

function Nav() {
  const route = useContext(RouterContext);

  return (
    <ul className="nav">
      {routes.map(x =>
        <li key={x.id}>
          <a href={x.url} className={route.url === x.url ? 'selected' : ''}>{x.name}</a>
        </li>
      )}
    </ul>
  );
}

function Content() {
  const route = useContext(RouterContext);

  return (
    <div className="content">
      <h1>{route.name}</h1>
      {route.element}
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">&copy; 2024</div>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="widget">
      </div>
    </div>
  );
}


function LikeDislikeBtn() {
  const [likeCount, setLikeCount] = useState(
    localStorage.getItem('likeCount') ? parseInt(localStorage.getItem('likeCount')) : 0
  );
  const [dislikeCount, setDislikeCount] = useState(
    localStorage.getItem('dislikeCount') ? parseInt(localStorage.getItem('dislikeCount')) : 0
  );

  useEffect(() => {
    localStorage.likeCount = likeCount;
    localStorage.dislikeCount = dislikeCount;
  }, [likeCount, dislikeCount]);

  function increaseLikeCount() {
    setLikeCount(likeCount + 1);
  }

  function increaseDislikeCount() {
    setDislikeCount(dislikeCount + 1);
  }

  return (
    <div className="like-dislike-container">
      <button className='likeBtn' onClick={increaseLikeCount}>😍 {likeCount}</button>
      <button className='dislikeBtn' onClick={increaseDislikeCount}>😡 {dislikeCount}</button>
    </div>
  );
}

function Home() {
  return (
    <div className="home">
      <h1>Welcome!</h1>
      <p>
        Welcome to our project! Here, we offer a dynamic web application featuring various content and functionalities. To learn more about the key components of our project, explore the sections below:
      </p>
      <div className="sections">
        <section>
          <h2>1-About</h2>
          <p>Discover what our project is about and the features it offers. In the About section, you'll find detailed information about the project's purpose and main functionalities.</p>
        </section>
        <section>
          <h2>2-Posts</h2>
          <p>Explore various posts and comments using the DummyJSON API. In this section, you can view different posts and delve into the comments associated with each post.</p>
        </section>
        <section>
          <h2>3-Contact</h2>
          <p>Find our contact information here to reach out with any questions or feedback. Our email address and social media links are available for you to connect with us.</p>
        </section>
      </div>
    </div>
  );
}

function About() {
  return (
    <>
      <p>This project is designed as a Post and Comment Management System. Here are its main features:</p>
      <p>Fetching Posts and Comments: Posts and comments are fetched from the dummyjson.com API and displayed.</p>
      <p>Dynamic Listing: Comments can be listed in options of 5, 10, or 25 per page.</p>
      <p>Pagination: Comments are managed with pagination support, allowing long comment lists to be displayed in an organized manner.</p>
      <p>Adding New Comments: Users can add new comments to posts.</p>
      <p>Local Storage: Comments are stored using local storage, ensuring data persistence.</p>
      <p>This project allows users to easily manage posts and comments, and incorporates modern web development techniques.</p>
    </>
  );
}

function Contact() {
  return (
    <div className="content">
      <p>Email: <a href="mailto:aysuacunmedya@gmail.com">aysuacunmedya@gmail.com</a></p>
      <p>GitHub: <a href="https://github.com/AysuAsci" target="_blank" rel="external">https://github.com/AysuAsci</a></p>
      <p>Vercel: <a href="https://vercel.com/aysus-projects-3490c001" target="_blank" rel="external">https://vercel.com/aysus-projects-3490c001</a></p>
    </div>
  );
}

function Posts() {
  const [postId, setPostId] = useState(null);

  return (
    <>
      {postId ? <PostDetail postId={postId} setPostId={setPostId} /> : <PostList setPostId={setPostId} />}
    </>
  );
}

function PostProvider({ children }) {
  const [comments, setComments] = useState([]);
  const [commentsPerPage, setCommentsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem('postComments')) || [];
    setComments(savedComments);
  }, []);

  useEffect(() => {
    const start = (currentPage - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    const savedComments = JSON.parse(localStorage.getItem('postComments')) || [];
    setComments(savedComments.slice(start, end));
  }, [currentPage, commentsPerPage]);

  return (
    <PostContext.Provider value={{ comments, setComments, commentsPerPage, setCommentsPerPage, currentPage, setCurrentPage }}>
      {children}
    </PostContext.Provider>
  );
}

function PostList({ setPostId }) {
  const { commentsPerPage, currentPage, setCurrentPage } = useContext(PostContext);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetch('https://dummyjson.com/posts')
      .then(r => r.json())
      .then(r => {
        setPosts(r.posts);
        setTotalPages(Math.ceil(r.posts.length / commentsPerPage));
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, [commentsPerPage]);

  function handleCommentsPerPageChange(event) {
    setCommentsPerPage(Number(event.target.value));
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }

  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return (
    <>
      {/* ... existing JSX code ... */}
      <label htmlFor="commentsPerPage">Comments per page: </label>
      <select
        id="commentsPerPage"
        value={commentsPerPage}
        onChange={handleCommentsPerPageChange}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
      </select>

      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {Math.ceil(posts.length / commentsPerPage)} </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={endIndex >= posts.length}>Next</button>
      </div>

      <div>
        {paginatedPosts.map(post => (
          <div key={post.id} onClick={() => setPostId(post.id)}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
      </div>

      
    </>
  );
}
function PostDetail({ postId, setPostId }) {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const { commentsPerPage, currentPage, setCurrentPage } = useContext(PostContext);

  async function getData() {
    const postData = await fetch('https://dummyjson.com/posts/' + postId).then(r => r.json());
    const commentsData = await fetch(`https://dummyjson.com/posts/${postId}/comments`).then(r => r.json());

    setPost(postData);
    setComments(commentsData.comments);
  }

  useEffect(() => {
    getData();
  }, [postId]);

  function handleClick(e) {
    e.preventDefault();
    setPostId(null);
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  const start = (currentPage - 1) * commentsPerPage;
  const endIndex = start + commentsPerPage;
  const paginatedComments = comments.slice(start, endIndex);


  return (
    <>
      <p><a href="#" onClick={handleClick}>back</a></p>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <hr />
      <h4>Comments: </h4>
      {paginatedComments.map(
        x => <p key={x.id}><strong>{x.user.fullName}</strong> says: {x.body}</p>
      )}
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={start + commentsPerPage >= comments.length}>Next</button>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <p>Page not found. <a href="#/">return home</a></p>
  );
}

export default App;