import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Nav, Navbar, NavbarBrand, NavbarText } from 'reactstrap';

import UserContext, { initialUserState } from '../../contexts/user';

function Navigation() {
  const userContext = useContext(UserContext);
  const { user } = userContext.userState;

  const logout = () => {
    userContext.userDispatch({ type: 'logout', payload: initialUserState });
  };

  return (
    <Navbar color="light" light sticky="top" expand="md">
      <Container>
        <NavbarBrand tag={Link} to="/">
          📝
        </NavbarBrand>
        <Nav className="mr-auto" />
        {user._id === '' ? (
          <div>
            <NavbarText tag={Link} to="/login">
              Login
            </NavbarText>
            <NavbarText className="mx-2">|</NavbarText>
            <NavbarText tag={Link} to="/register">
              Sign Up
            </NavbarText>
          </div>
        ) : (
          <div>
            <Button outline tag={Link} to="/edit">
              Post a Blog
            </Button>
            <Button onClick={() => logout()} className="ml-2">
              Logout
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
}

export default Navigation;
