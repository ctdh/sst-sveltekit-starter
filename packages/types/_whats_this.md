# Global Types

The question is how to share types across the monorepo for use in infrastructure construction, backend and frontend.

I have created a folder /packages/types with an index file referencing all the types in the /packages/types/src folder.  /packages/types is then listed in the package.json as a dependency and in tsconfig.json as a path within each package.  

TODO:  The type dependencies are not working as expected atm
