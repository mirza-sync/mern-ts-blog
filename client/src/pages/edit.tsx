import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import axios from 'axios';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useContext, useEffect, useState } from 'react';
import { ContentState, Editor, EditorState } from 'react-draft-wysiwyg';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

import Header from '../components/Header';
import LoadingComponent from '../components/LoadingComponent';
import Navigation from '../components/Navigation';
import TextMessage from '../components/TextMessage';
import config from '../config/config';
import logging from '../config/logging';
import UserContext from '../contexts/user';
import Blog from '../interfaces/blog';
import IUser from '../interfaces/user';

const EditPage = (props: RouteComponentProps) => {
  const [_id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [picture, setPicture] = useState('');
  const [content, setContent] = useState('');
  const [headline, setHeadline] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { user } = useContext(UserContext).userState;

  useEffect(() => {
    const blogId = (props.match.params as any).blogId;

    if (blogId) {
      setId(blogId);
    } else {
      setLoading(false);
    }
  }, []);

  const getBlog = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${config.server.url}/blogs/${_id}`,
      });

      if (response.status === 200 || response.status === 304) {
        const blog = response.data.blog as Blog;
        if (user._id !== (blog.author as IUser)._id) {
          logging.warn('Not blog author');
          setId('');
        } else {
          setTitle(blog.title);
          setContent(blog.content);
          setHeadline(blog.headline);
          setPicture(blog.picture || '');

          // Convert html string to draftjs editor state
          const contentBlock = htmlToDraft(blog.content);
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
          );
          const _editorState = EditorState.createWithContent(contentState);
          setEditorState(_editorState);
        }
      } else {
        setError(`Unable to retrieve blog ${_id}`);
        setId('');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async () => {
    if (title == null || headline == null || content == null) {
      setError('Please fill out all fields');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await axios({
        method: 'POST',
        url: `${config.server.url}/blogs/create`,
        data: {
          title,
          content,
          headline,
          picture,
          author: user._id,
        },
      });

      if (response.status === 200) {
        setId(response.data.blog._id);
        setSuccess('Blog posted. You can continue edit it on this page');
      } else {
        setError('Unable to save blog');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const editBlog = async () => {
    if (title == null || headline == null || content == null) {
      setError('Please fill out all fields');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await axios({
        method: 'PATCH',
        url: `${config.server.url}/blogs/update/${_id}`,
        data: {
          title,
          content,
          headline,
          picture,
          author: user._id,
        },
      });

      if (response.status === 200) {
        setId(response.data.blog._id);
        setSuccess('Blog updated.');
      } else {
        setError('Unable to save blog');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingComponent>Loading editor...</LoadingComponent>;

  return (
    <Container fluid className="p-0">
      <Navigation />
      <Header title={_id !== '' ? 'Edit your blog' : 'Create a blog'} headline={''} />
      <Container>
        <TextMessage type={'error'} message={error} />
        <Form>
          <FormGroup>
            <Label for="title">Title *</Label>
            <Input
              type="text"
              name="title"
              value={title}
              id="title"
              placeholder="Enter a title"
              disabled={isSaving}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="picture">Picture</Label>
            <Input
              type="text"
              name="picture"
              value={picture}
              id="picture"
              placeholder="Picture URL, ex: https://...."
              disabled={isSaving}
              onChange={(e) => setPicture(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="headline">Headline *</Label>
            <Input
              type="text"
              name="headline"
              value={headline}
              id="headline"
              placeholder="Enter a headline"
              disabled={isSaving}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="headline">Content</Label>
            <Editor
              editorState={editorState}
              wrapperClassName="card"
              editorClassName="card-body"
              onEditorStateChange={(newState) => {
                setEditorState(newState);
                setContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
              }}
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'fontSize',
                  'list',
                  'textAlign',
                  'history',
                  'embedded',
                  'emoji',
                  'image',
                ],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </FormGroup>
          <FormGroup>
            <TextMessage type={'success'} message={success} />
          </FormGroup>
          <FormGroup>
            <Button
              block
              onClick={() => {
                if (_id) {
                  editBlog();
                } else {
                  createBlog();
                }
              }}
              disabled={isSaving}
            >
              <i className="fas fa-save mr-1"></i>
              {_id ? 'Update' : 'Post'}
            </Button>
            {_id && (
              <Button block color="success" tag={Link} to={`/blogs/${_id}`}>
                View your blog post!
              </Button>
            )}
          </FormGroup>
          <FormGroup>
            <Label>Preview</Label>
            <div className="border p-2">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </FormGroup>
        </Form>
      </Container>
    </Container>
  );
};

export default withRouter(EditPage);
