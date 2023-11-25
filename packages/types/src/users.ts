import { Config } from "sst/node/config";

// create a role type with enum roles 
// match the ADMIN role with .env.local ADMIN_USER_ROLE
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

export interface SessionType{
  type: 'public' | 'user';
  properties: {
    userId: string;
    // roles: Role[];
  };
  iat: number;
  exp: number;
}


