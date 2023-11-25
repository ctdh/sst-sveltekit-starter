// type UserWithNullableId = Omit<User, 'id'> & { id: string | null };

export interface Users {
    id: string ;
    email: string;
    picture: string | null;
    firstName: string | null;
    lastName: string | null;
    roles: string | null;
  }
  
  export interface Database {
    users: Users;
  }