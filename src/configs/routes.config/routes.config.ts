import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'departments',
        path: '/departments',
        component: lazy(() => import('@/views/Departments')),
        authority: [],
    },
    {
        key: 'kraManagement',
        path: '/kras',
        component: lazy(() => import('@/views/KraManagement')),
        authority: [],
    },
    {
        key: 'tasks.create',
        path: '/tasks/create',
        component: lazy(() => import('@/views/tasks/TaskCreate')),
        authority: [],
    },
    {
        key: 'tasks.detail',
        path: '/tasks/:taskId',
        component: lazy(() => import('@/views/tasks/TaskDetailOwner')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'tasks.self',
        path: '/tasks/self',
        component: lazy(() => import('@/views/tasks/OwnerSelfTasks')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'hod.dashboard',
        path: '/hod/dashboard',
        component: lazy(() => import('@/views/tasks/HodDashboard')),
        authority: [],
    },
    {
        key: 'hod.taskDetail',
        path: '/hod/tasks/:taskId',
        component: lazy(() => import('@/views/tasks/HodTaskDetail')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'purchases.board',
        path: '/purchases',
        component: lazy(() => import('@/views/tasks/PurchasesBoard')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'notifications',
        path: '/notifications',
        component: lazy(() => import('@/views/Notifications')),
        authority: [],
    },
    ...othersRoute,
]
