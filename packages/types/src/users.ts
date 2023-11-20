// create a role type with 3 enum roles 
export enum Role {
    ADMIN = 'ADMIN',
    ROLE_1 = 'ROLE_1',
    ROLE_2 = 'ROLE_2',
    ROLE_3 = 'ROLE_2',
    }

// user type with roles
// type UserWithNullableId = Omit<User, 'id'> & { id: string | null };
export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  picture?: string | null;  
  roles?: string | null; // comma separated string of roles
}

export interface Session{
  type: 'public' | 'user';
  properties: {
    userId: string;
    // roles: Role[];
  };
  iat: number;
  exp: number;
}


