import { Role } from '$shared_types/types/index';

type MenuItem = {
    name: string;
    link: string;
    isSelected: boolean;
    description: string;
    icon: string;
    menuItems?: MenuItem[];
    roles: Role[]
  };
export let menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      isSelected: false,
      description: 'Dashboard',
      icon: 'home',
      roles: [Role.ADMIN, Role.ROLE_1, Role.ROLE_2, Role.ROLE_3],
      menuItems:[
        {
          name: 'Role1 Dashboard',
          link: '/dashboard/role1',
          isSelected: false,
          description: 'Role1',
          icon: 'Role1',
          roles: [Role.ADMIN, Role.ROLE_1],
        },
        {
          name: 'Role2 Dashboard',
          link: '/dashboard/role2',
          isSelected: false,
          description: 'role2',
          icon: 'users',
          roles: [Role.ADMIN, Role.ROLE_2],
        },
      ]
    },
    {
      name: 'Role1',
      link: '/Role1',
      isSelected: false,
      description: 'Role1',
      icon: 'users',
      roles: [Role.ADMIN, Role.ROLE_1],
      menuItems :[
        {
          name: 'Role1 menu item 1',
          link: '/role1/item1',
          isSelected: false,
          description: 'Role 1 Item1',
          icon: 'Item1',
          roles: [Role.ADMIN, Role.ROLE_1],
        },
        {
          name: 'Role1 menu item 2',
          link: '/role1/item2',
          isSelected: false,
          description: 'Role 1, Item 2',
          icon: 'Item2',
          roles: [Role.ADMIN, Role.ROLE_1],
        }
      ]
    },
    {
      name: 'Role2',
      link: '/role2',
      isSelected: false,
      description: 'Role2',
      icon: 'folder',
      roles: [Role.ADMIN, Role.ROLE_2],
      menuItems: [
        {
          name: 'Role2 menu item 1',
          link: '/role2/item1',
          isSelected: false,
          description: 'Role2, Item 1',
          icon: 'home',
          roles: [Role.ADMIN, Role.ROLE_2],
        },
        {
          name: 'Role2 menu item 2',
          link: '/role2/item2',
          isSelected: false,
          description: 'Role2, Item 2',
          icon: 'home',
          roles: [Role.ADMIN, Role.ROLE_2],

        }
      ]
    },
    {
        name: 'Settings',
        link: '/settings',
        isSelected: false,
        description: 'My Account',
        icon: 'settings',
        roles: [Role.ADMIN, Role.ROLE_1, Role.ROLE_2],
        menuItems:[
            {
            name: 'My Account',
            link: '/settings/account',
            isSelected: false,
            description: 'My details',
            icon: 'home',
            roles: [Role.ADMIN, Role.ROLE_1, Role.ROLE_2],
          },
            {
                name: 'Notifications',
                link: '/settings/notifications',
                isSelected: false,
                description: 'notifications',
                icon: 'home',
                roles: [Role.ADMIN, Role.ROLE_1, Role.ROLE_2, Role.ROLE_3],
              },
        ]
    },
];
