import { Container } from 'reactstrap';

type CenterPieceProps = {
  children: React.ReactNode;
};

function CenterPiece({ children }: CenterPieceProps) {
  return (
    <Container fluid className="p-0">
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {children}
      </div>
    </Container>
  );
}

export default CenterPiece;
