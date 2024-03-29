import { createContext } from 'react';

import IUser, { DEFAULT_FIRE_TOKEN, DEFAULT_USER } from '../interfaces/user';

export interface IUserState {
  user: IUser;
  fire_token: string;
}

export interface IUserAction {
  type: 'login' | 'logout';
  payload: IUserState;
}

export const initialUserState: IUserState = {
  user: DEFAULT_USER,
  fire_token: DEFAULT_FIRE_TOKEN,
};

export const userReducer = (state: IUserState, action: IUserAction) => {
  const user = action.payload.user;
  const fire_token = action.payload.fire_token;

  switch (action.type) {
    case 'login':
      localStorage.setItem('fire_token', fire_token);
      return { user, fire_token };

    case 'logout':
      localStorage.removeItem('fire_token');
      return initialUserState;

    default:
      return state;
  }
};

export interface IUserContextProps {
  userState: IUserState;
  userDispatch: React.Dispatch<IUserAction>;
}

const UserContext = createContext<IUserContextProps>({
  userState: initialUserState,
  userDispatch: () => {},
});

export const UserContextConsumer = UserContext.Consumer;
export const UserContextProvider = UserContext.Provider;

export default UserContext;
