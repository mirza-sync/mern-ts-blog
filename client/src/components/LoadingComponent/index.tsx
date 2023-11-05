import { ReactNode } from 'react';
import { Card, CardBody } from 'reactstrap';

import CenterPiece from '../CenterPiece';

type LoadingProps = {
  dotType?: string;
  children?: ReactNode;
};

type LoadingComponentProps = {
  card?: boolean;
} & LoadingProps;

const Loading = ({ dotType = 'dot-bricks', children }: LoadingProps) => {
  return (
    <div className="text-center">
      <div className="stage">
        <div className={dotType}></div>
        {children}
      </div>
    </div>
  );
};

function LoadingComponent({
  card = true,
  dotType = 'dot-bricks',
  children,
}: LoadingComponentProps) {
  if (card) {
    return (
      <CenterPiece>
        <Card>
          <CardBody>
            <Loading dotType={dotType}>{children}</Loading>
          </CardBody>
        </Card>
      </CenterPiece>
    );
  }
  return <Loading dotType={dotType}>{children}</Loading>;
}

export default LoadingComponent;
