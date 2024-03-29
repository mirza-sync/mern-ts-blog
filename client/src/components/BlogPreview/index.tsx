import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';

import Blog from '../../interfaces/blog';
import IUser from '../../interfaces/user';

interface BlogPreviewProps {
  blog: Blog;
  children?: React.ReactNode;
}

function BlogPreview(props: BlogPreviewProps) {
  const { _id, author, title, headline, createdAt, updatedAt } = props.blog;
  const _author = author as IUser;
  return (
    <Card className="border-0">
      <CardBody className="p-0">
        <Link to={`/blogs/${_id}`}>
          <h1>
            <b>{title}</b>
          </h1>
          <h3>{headline}</h3>
          <br />
        </Link>
        {createdAt !== updatedAt ? (
          <p>
            Updated by {_author.name} at {new Date(updatedAt).toLocaleString()}
          </p>
        ) : (
          <p>
            Posted by {_author.name} at {new Date(createdAt).toLocaleString()}
          </p>
        )}
        {props.children}
      </CardBody>
    </Card>
  );
}

export default BlogPreview;
