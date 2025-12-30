import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'departments',
        path: '/departments',
        title: 'Departments',
        translateKey: 'nav.departments',
        icon: 'departments',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'selfTasks',
        path: '/tasks/self',
        title: 'Owner Self Tasks',
        translateKey: 'nav.selfTasks',
        icon: 'selfTasks',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'hodDashboard',
        path: '/hod/dashboard',
        title: 'HOD Dashboard',
        translateKey: 'nav.hodDashboard',
        icon: 'hodDashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'purchases',
        path: '/purchases',
        title: 'Purchases',
        translateKey: 'nav.purchases',
        icon: 'purchases',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'kraManagement',
        path: '/kras',
        title: 'KRA Management',
        translateKey: 'nav.kraManagement',
        icon: 'kras',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
