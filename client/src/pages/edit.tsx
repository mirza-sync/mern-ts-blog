import axios from 'axios';
import htmlToDraft from 'html-to-draftjs';
import { useContext, useEffect, useState } from 'react';
import { ContentState, EditorState } from 'react-draft-wysiwyg';
import { RouteComponentProps } from 'react-router-dom';

import LoadingComponent from '../components/LoadingComponent';
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

  return <div>Edit Page</div>;
};

export default EditPage;
