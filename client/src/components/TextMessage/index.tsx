type TextMessageProps = {
  type: 'success' | 'error';
  message: string;
};

function TextMessage(props: TextMessageProps) {
  const { type, message } = props;

  if (message == null) return null;

  return (
    <small className={type === 'success' ? 'text-success' : 'text-danger'}>
      {message}
    </small>
  );
}

export default TextMessage;
