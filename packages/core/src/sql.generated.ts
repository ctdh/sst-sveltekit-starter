// type UserWithNullableId = Omit<User, 'id'> & { id: string | null };

export interface Users {
    id: string ;
    email: string;
    picture: string | null;
    first_name: string | null;
    last_name: string | null;
    roles: string | null;
  }
  
  export interface Database {
    users: Users;
  }