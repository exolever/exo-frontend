export interface AlertMessageResponseInterface {
  can_be_closed: boolean;
  code: string;
  id: string;
  level: number;
  user: number;
  variables: {
    email: string;
    pk: string;
    user_pk: string;
    verif_key: string;
    counter: number;
  };
}
