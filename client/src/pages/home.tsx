import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container } from 'reactstrap';

import BlogPreview from '../components/BlogPreview';
import Header from '../components/Header';
import LoadingComponent from '../components/LoadingComponent';
import Navigation from '../components/Navigation';
import TextMessage from '../components/TextMessage';
import config from '../config/config';
import logging from '../config/logging';
import Blog from '../interfaces/blog';

const HomePage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllBlogs();
  }, []);

  const getAllBlogs = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${config.server.url}/blogs`,
      });

      if (response.status === 200 || response.status === 304) {
        const blogs = response.data.blogs as Blog[];
        blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
        setBlogs(blogs);
      }
    } catch (error) {
      logging.error(error);
      setError('Unable to retrieve blogs');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  if (loading) {
    return <LoadingComponent>Loading blogs...</LoadingComponent>;
  }

  return (
    <Container fluid className="p-0">
      <Navigation />
      <Header
        title="A Nerdy Blog Website"
        headline="Check out what people have to say!"
      />
      <Container>
        <TextMessage type={'error'} message={error} />;
        {blogs.length === 0 && <p>There are no blogs yet. You should post one!</p>}
        {blogs.map((blog) => {
          return <BlogPreview key={blog._id} blog={blog} />;
        })}
      </Container>
    </Container>
  );
};

export default HomePage;
