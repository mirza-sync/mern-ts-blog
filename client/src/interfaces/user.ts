export default interface IUser {
  _id: string;
  uid: string;
  name: string;
}

export const DEFAULT_USER: IUser = {
  _id: '',
  name: '',
  uid: '',
};

export const DEFAULT_FIRE_TOKEN = '';
