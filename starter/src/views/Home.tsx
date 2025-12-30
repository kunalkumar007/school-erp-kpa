import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Select from '@/components/ui/Select'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import classNames from '@/utils/classNames'
import { PiBellDuotone, PiCaretRightDuotone } from 'react-icons/pi'

type TaskBucket = 'dueToday' | 'overdue'

type MyTask = {
    id: string
    title: string
    dueDate: string
    priority: 'High' | 'Medium' | 'Low'
    status: string
    bucket: TaskBucket
    completed?: boolean
}

type HodTask = {
    id: string
    title: string
    department: string
    hod: string
    kra: string
    dueDate: string
    priority: 'High' | 'Medium' | 'Low'
    status: string
    bucket: TaskBucket
    completed?: boolean
}

type Purchase = {
    id: string
    description: string
    department: string
    date: string
    amount: number
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount)

const priorityTone: Record<MyTask['priority'], string> = {
    High: 'bg-rose-50 text-rose-700 border border-rose-100',
    Medium: 'bg-amber-50 text-amber-700 border border-amber-100',
    Low: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
}

const statusTone: Record<string, string> = {
    'In progress':
        'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100',
    'Ready to sign':
        'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
    'Waiting for info':
        'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100',
    'Needs reschedule':
        'bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950 dark:text-purple-100',
    Escalated:
        'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950 dark:text-rose-100',
    Blocked:
        'bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-950 dark:text-orange-100',
    Done: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
}

const sectionTitle = 'text-sm font-semibold text-gray-700 dark:text-gray-200'
const metaText = 'text-xs text-gray-500 dark:text-gray-400'
const statusOrder = [
    'In progress',
    'Ready to sign',
    'Waiting for info',
    'Needs reschedule',
    'Blocked',
    'Escalated',
    'Done',
]

const Home = () => {
    const today = useMemo(() => dayjs(), [])

    const initialMyTasks = useMemo<MyTask[]>(
        () => [
            {
                id: 'mt-1',
                title: 'Approve science lab vendor payments',
                dueDate: today.toISOString(),
                priority: 'High',
                status: 'In progress',
                bucket: 'dueToday',
                completed: false,
            },
            {
                id: 'mt-2',
                title: 'Sign payroll release',
                dueDate: today.toISOString(),
                priority: 'Medium',
                status: 'Ready to sign',
                bucket: 'dueToday',
                completed: false,
            },
            {
                id: 'mt-3',
                title: 'Review overdue maintenance tickets',
                dueDate: today.subtract(1, 'day').toISOString(),
                priority: 'High',
                status: 'Needs reschedule',
                bucket: 'overdue',
                completed: false,
            },
            {
                id: 'mt-4',
                title: 'Confirm transport invoices',
                dueDate: today.subtract(2, 'day').toISOString(),
                priority: 'Medium',
                status: 'Waiting for info',
                bucket: 'overdue',
                completed: false,
            },
        ],
        [today],
    )

    const initialHodTasks = useMemo<HodTask[]>(
        () => [
            {
                id: 'ht-1',
                title: 'Submit Grade 10 lesson plans',
                department: 'Academics',
                hod: 'R. Singh',
                kra: 'Curriculum',
                dueDate: today.toISOString(),
                priority: 'Medium',
                status: 'In progress',
                bucket: 'dueToday',
                completed: false,
            },
            {
                id: 'ht-2',
                title: 'Share attendance exceptions',
                department: 'Operations',
                hod: 'L. Patel',
                kra: 'Compliance',
                dueDate: today.toISOString(),
                priority: 'Low',
                status: 'In progress',
                bucket: 'dueToday',
                completed: false,
            },
            {
                id: 'ht-3',
                title: 'Library book audit',
                department: 'Library',
                hod: 'A. Menon',
                kra: 'Inventory',
                dueDate: today.subtract(1, 'day').toISOString(),
                priority: 'Medium',
                status: 'Blocked',
                bucket: 'overdue',
                completed: false,
            },
            {
                id: 'ht-4',
                title: 'PTM schedule confirmation',
                department: 'Academics',
                hod: 'R. Singh',
                kra: 'Parent Connect',
                dueDate: today.subtract(2, 'day').toISOString(),
                priority: 'High',
                status: 'Escalated',
                bucket: 'overdue',
                completed: false,
            },
            {
                id: 'ht-5',
                title: 'Transport route reconciliation',
                department: 'Operations',
                hod: 'L. Patel',
                kra: 'Safety',
                dueDate: today.toISOString(),
                priority: 'High',
                status: 'Ready to sign',
                bucket: 'dueToday',
                completed: false,
            },
            {
                id: 'ht-6',
                title: 'Sports equipment justification',
                department: 'Sports',
                hod: 'S. Rao',
                kra: 'Budget',
                dueDate: today.subtract(3, 'day').toISOString(),
                priority: 'Medium',
                status: 'In progress',
                bucket: 'overdue',
                completed: false,
            },
        ],
        [today],
    )

    const [myTasks, setMyTasks] = useState<MyTask[]>(initialMyTasks)
    const [hodTasks, setHodTasks] = useState<HodTask[]>(initialHodTasks)

    const purchases = useMemo<Purchase[]>(
        () => [
            {
                id: 'po-1',
                description: 'Smart board accessories',
                department: 'Academics',
                date: today.toISOString(),
                amount: 48000,
            },
            {
                id: 'po-2',
                description: 'Transport diesel top-up',
                department: 'Transport',
                date: today.toISOString(),
                amount: 21500,
            },
            {
                id: 'po-3',
                description: 'Cafeteria dry stock',
                department: 'Cafeteria',
                date: today.toISOString(),
                amount: 12250,
            },
            {
                id: 'po-4',
                description: 'Sports jerseys',
                department: 'Sports',
                date: today.subtract(1, 'day').toISOString(),
                amount: 18600,
            },
            {
                id: 'po-5',
                description: 'Library renewals',
                department: 'Library',
                date: today.subtract(3, 'day').toISOString(),
                amount: 9300,
            },
        ],
        [today],
    )

    const [departmentFilter, setDepartmentFilter] = useState('all')
    const [hodFilter, setHodFilter] = useState('all')
    const [kraFilter, setKraFilter] = useState('all')

    const myTasksDueToday = useMemo(
        () =>
            myTasks.filter(
                (task) => task.bucket === 'dueToday' && !task.completed,
            ),
        [myTasks],
    )
    const myTasksOverdue = useMemo(
        () =>
            myTasks.filter(
                (task) => task.bucket === 'overdue' && !task.completed,
            ),
        [myTasks],
    )

    const allHodDueToday = useMemo(
        () =>
            hodTasks.filter(
                (task) => task.bucket === 'dueToday' && !task.completed,
            ),
        [hodTasks],
    )

    const filteredHodTasks = useMemo(
        () =>
            hodTasks.filter(
                (task) =>
                    (departmentFilter === 'all' ||
                        task.department === departmentFilter) &&
                    (hodFilter === 'all' || task.hod === hodFilter) &&
                    (kraFilter === 'all' || task.kra === kraFilter),
            ),
        [departmentFilter, hodFilter, kraFilter, hodTasks],
    )

    const hodDueToday = useMemo(
        () =>
            filteredHodTasks.filter(
                (task) => task.bucket === 'dueToday' && !task.completed,
            ),
        [filteredHodTasks],
    )
    const hodOverdue = useMemo(
        () =>
            filteredHodTasks.filter(
                (task) => task.bucket === 'overdue' && !task.completed,
            ),
        [filteredHodTasks],
    )

    const overdueTotal =
        myTasksOverdue.length +
        hodTasks.filter(
            (task) => task.bucket === 'overdue' && !task.completed,
        ).length

    const purchasesToday = useMemo(
        () => purchases.filter((purchase) => dayjs(purchase.date).isSame(today, 'day')),
        [purchases, today],
    )

    const latestPurchases = useMemo(
        () =>
            [...purchases]
                .sort(
                    (a, b) =>
                        dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
                )
                .slice(0, 5),
        [purchases],
    )

    const departmentOptions = useMemo(
        () => ['all', ...new Set(hodTasks.map((task) => task.department))],
        [hodTasks],
    )
    const hodOptions = useMemo(
        () => ['all', ...new Set(hodTasks.map((task) => task.hod))],
        [hodTasks],
    )
    const kraOptions = useMemo(
        () => ['all', ...new Set(hodTasks.map((task) => task.kra))],
        [hodTasks],
    )

    const summaryTiles = [
        {
            label: 'My tasks due today',
            value: myTasksDueToday.length,
            hint: 'Owner actions queued for today',
        },
        {
            label: 'All HOD tasks due today',
            value: allHodDueToday.length,
            hint: 'Across departments',
        },
        {
            label: 'Overdue tasks total',
            value: overdueTotal,
            hint: 'Includes your tasks and all HOD tasks',
        },
        {
            label: 'Purchases today',
            value: formatCurrency(
                purchasesToday.reduce(
                    (total, purchase) => total + purchase.amount,
                    0,
                ),
            ),
            hint: `${purchasesToday.length} entries logged`,
        },
    ]

    const renderTaskPill = (label: string, tone: string) => (
        <Tag className={classNames('text-xs font-semibold', tone)}>{label}</Tag>
    )

    const getNextStatus = (current: string) => {
        const currentIndex = statusOrder.findIndex(
            (status) => status === current,
        )
        if (currentIndex === -1) return statusOrder[0]
        const nextIndex = (currentIndex + 1) % statusOrder.length
        return statusOrder[nextIndex]
    }

    const markTaskDone = (task: MyTask | HodTask) => {
        const setter = 'hod' in task ? setHodTasks : setMyTasks
        setter((prevTasks) =>
            prevTasks.map((prevTask) =>
                prevTask.id === task.id
                    ? { ...prevTask, status: 'Done', completed: true }
                    : prevTask,
            ),
        )
    }

    const cycleTaskStatus = (task: MyTask | HodTask) => {
        const setter = 'hod' in task ? setHodTasks : setMyTasks
        setter((prevTasks) =>
            prevTasks.map((prevTask) => {
                if (prevTask.id !== task.id) return prevTask
                const nextStatus = getNextStatus(prevTask.status)
                return {
                    ...prevTask,
                    status: nextStatus,
                    completed: nextStatus === 'Done',
                }
            }),
        )
    }

    const editTaskTitle = (task: MyTask | HodTask) => {
        const isHodTask = 'hod' in task
        const currentList = isHodTask ? hodTasks : myTasks
        const currentTask = currentList.find(
            (current) => current.id === task.id,
        )

        if (!currentTask) return

        const nextTitle = window.prompt(
            'Edit task title',
            currentTask.title ?? '',
        )

        if (!nextTitle || nextTitle.trim() === currentTask.title.trim()) return

        const setter = isHodTask ? setHodTasks : setMyTasks
        setter((prevTasks) =>
            prevTasks.map((prevTask) =>
                prevTask.id === task.id
                    ? { ...prevTask, title: nextTitle.trim() }
                    : prevTask,
            ),
        )
    }

    const renderTaskCard = (task: MyTask | HodTask) => (
        <div
            key={task.id}
            className={classNames(
                'rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm',
                task.completed && 'opacity-70 ring-1 ring-emerald-100',
            )}
        >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <span
                            className={classNames(
                                'font-semibold text-gray-900 dark:text-gray-50',
                                task.completed && 'line-through',
                            )}
                        >
                            {task.title}
                        </span>
                        {renderTaskPill(
                            (task as MyTask).priority,
                            priorityTone[(task as MyTask).priority],
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {'department' in task && (
                            <span className={metaText}>
                                Department: {task.department}
                            </span>
                        )}
                        {'kra' in task && (
                            <span className={metaText}>KRA: {task.kra}</span>
                        )}
                        {'hod' in task && (
                            <span className={metaText}>HOD: {task.hod}</span>
                        )}
                        <span className={metaText}>
                            Due {dayjs(task.dueDate).format('MMM D')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {renderTaskPill(
                        task.status,
                        statusTone[task.status] ??
                            'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100',
                    )}
                </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                <Button
                    disabled={task.completed}
                    size="sm"
                    variant="plain"
                    onClick={() => markTaskDone(task)}
                >
                    Mark done
                </Button>
                <Button
                    size="sm"
                    variant="plain"
                    onClick={() => cycleTaskStatus(task)}
                >
                    Change status
                </Button>
                <Button
                    size="sm"
                    variant="plain"
                    onClick={() => editTaskTitle(task)}
                >
                    Edit
                </Button>
            </div>
        </div>
    )

    const renderTaskGroup = (title: string, tasks: (MyTask | HodTask)[]) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className={sectionTitle}>{title}</div>
                <span className={metaText}>{tasks.length} task(s)</span>
            </div>
            {tasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Nothing here right now.
                </div>
            ) : (
                <div className="space-y-3">{tasks.map(renderTaskCard)}</div>
            )}
        </div>
    )

    const renderFilter = (
        label: string,
        value: string,
        onChange: (value: string) => void,
        options: string[],
    ) => {
        const selectOptions = options.map((option) => ({
            value: option,
            label: option === 'all' ? 'All' : option,
        }))
        const selected = selectOptions.find(
            (option) => option.value === value,
        )

        return (
            <div className="space-y-1">
                <div className={metaText}>{label}</div>
                <Select
                    size="sm"
                    className="min-w-[140px]"
                    classNamePrefix="select"
                    options={selectOptions}
                    value={selected}
                    isSearchable={false}
                    isClearable={false}
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 50 }),
                    }}
                    onChange={(option) =>
                        onChange((option as { value: string }).value)
                    }
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Owner dashboard
                    </p>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                            KPA School
                        </h2>
                        <Tag className="bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-50">
                            Today&apos;s view
                        </Tag>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/notifications"
                        className="relative inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-700 dark:text-gray-100 shadow-sm hover:border-primary hover:text-primary transition-colors"
                    >
                        <PiBellDuotone className="text-xl" />
                        <span className="sr-only">View notifications</span>
                        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                            4
                        </span>
                    </Link>
                    <UserProfileDropdown hoverable={false} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryTiles.map((tile) => (
                    <Card
                        key={tile.label}
                        className="border border-gray-100 dark:border-gray-800 shadow-sm"
                        bodyClass="p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {tile.label}
                                </div>
                                <div className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                                    {tile.value}
                                </div>
                                <div className={metaText}>{tile.hint}</div>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                <PiCaretRightDuotone />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
                <Card
                    className="xl:col-span-1"
                    header={{ content: 'Today – My Tasks', bordered: false }}
                >
                    <div className="space-y-6">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Quick list with inline actions to keep you moving.
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {renderTaskGroup(
                                    'Due Today',
                                    myTasksDueToday,
                                )}
                            </div>
                            <div className="space-y-4">
                                {renderTaskGroup('Overdue', myTasksOverdue)}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card
                    className="xl:col-span-2"
                    header={{
                        content: 'HOD Tasks Due Today / Overdue',
                        bordered: false,
                    }}
                >
                    <div className="space-y-5">
                        <div className="grid gap-3 md:grid-cols-3">
                            {renderFilter(
                                'Department',
                                departmentFilter,
                                setDepartmentFilter,
                                departmentOptions,
                            )}
                            {renderFilter(
                                'HOD',
                                hodFilter,
                                setHodFilter,
                                hodOptions,
                            )}
                            {renderFilter(
                                'KRA',
                                kraFilter,
                                setKraFilter,
                                kraOptions,
                            )}
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {renderTaskGroup('Due Today', hodDueToday)}
                            {renderTaskGroup('Overdue', hodOverdue)}
                        </div>
                    </div>
                </Card>
            </div>

            <Card
                header={{ content: 'Purchases – Latest', bordered: false }}
                className="border border-gray-100 dark:border-gray-800 shadow-sm"
            >
                <div className="space-y-4">
                    {latestPurchases.map((purchase) => (
                        <div
                            key={purchase.id}
                            className="flex flex-col gap-1 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 dark:border-gray-800 md:flex-row md:items-center md:justify-between"
                        >
                            <div className="space-y-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-50">
                                    {purchase.description}
                                </div>
                                <div className={metaText}>
                                    {purchase.department} •{' '}
                                    {dayjs(purchase.date).format(
                                        'MMM D, YYYY',
                                    )}
                                </div>
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {formatCurrency(purchase.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default Home
