import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import {
    Button,
    Card,
    Tag,
    Tooltip,
} from '@/components/ui'
import classNames from '@/utils/classNames'
import {
    PiArrowRightDuotone,
    PiCheckCircleDuotone,
    PiClipboardTextDuotone,
    PiClockCountdownDuotone,
    PiHandPointingDuotone,
    PiMegaphoneDuotone,
    PiWarningCircleDuotone,
} from 'react-icons/pi'

type HodTaskBucket = 'New' | 'In Progress' | 'Completed' | 'Overdue'

type HodTask = {
    id: string
    title: string
    department: string
    kra: string
    dueDate: string
    priority: 'High' | 'Medium' | 'Low'
    bucket: HodTaskBucket
}

type DelegationRow = {
    staff: string
    task: string
    status: HodTaskBucket
    esign: 'Signed' | 'Pending'
    dueDate: string
}

type PurchaseRow = {
    id: string
    title: string
    hod: string
    amount: number
    category: string
    date: string
    status: 'Submitted' | 'In review' | 'Approved'
}

const priorityTone: Record<HodTask['priority'], string> = {
    High: 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950 dark:text-rose-100',
    Medium:
        'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100',
    Low: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
}

const bucketTone: Record<HodTaskBucket, string> = {
    New: 'bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-100',
    'In Progress':
        'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100',
    Completed:
        'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
    Overdue:
        'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950 dark:text-rose-100',
}

const HodDashboard = () => {
    const now = useMemo(() => dayjs(), [])

    const initialTasks = useMemo<HodTask[]>(
        () => [
            {
                id: 'hd-01',
                title: 'Math remedial plan for Grade 9',
                department: 'Academics',
                kra: 'Curriculum depth',
                dueDate: now.toISOString(),
                priority: 'High',
                bucket: 'New',
            },
            {
                id: 'hd-02',
                title: 'Route safety log for buses',
                department: 'Transport',
                kra: 'Safety',
                dueDate: now.add(2, 'hour').toISOString(),
                priority: 'Medium',
                bucket: 'In Progress',
            },
            {
                id: 'hd-03',
                title: 'Sports day vendor shortlist',
                department: 'Sports',
                kra: 'Budget',
                dueDate: now.add(1, 'day').toISOString(),
                priority: 'Low',
                bucket: 'Completed',
            },
            {
                id: 'hd-04',
                title: 'Late fee waiver summary',
                department: 'Finance',
                kra: 'Compliance',
                dueDate: now.subtract(1, 'day').toISOString(),
                priority: 'High',
                bucket: 'Overdue',
            },
            {
                id: 'hd-05',
                title: 'Lab equipment servicing calendar',
                department: 'Academics',
                kra: 'Asset care',
                dueDate: now.toISOString(),
                priority: 'Medium',
                bucket: 'New',
            },
            {
                id: 'hd-06',
                title: 'PTM invites ready for print',
                department: 'Academics',
                kra: 'Parent connect',
                dueDate: now.subtract(2, 'day').toISOString(),
                priority: 'Medium',
                bucket: 'Overdue',
            },
        ],
        [now],
    )

    const [tasks, setTasks] = useState<HodTask[]>(initialTasks)

    const delegation: DelegationRow[] = [
        {
            staff: 'J. Dsouza',
            task: 'Bus safety drill log',
            status: 'In Progress',
            esign: 'Pending',
            dueDate: now.add(1, 'day').toISOString(),
        },
        {
            staff: 'S. Roy',
            task: 'Library weed list',
            status: 'New',
            esign: 'Signed',
            dueDate: now.add(3, 'day').toISOString(),
        },
        {
            staff: 'T. Mehta',
            task: 'Sports vendor shortlist',
            status: 'Completed',
            esign: 'Signed',
            dueDate: now.subtract(1, 'day').toISOString(),
        },
        {
            staff: 'N. Iyer',
            task: 'Fee waiver rationale',
            status: 'Overdue',
            esign: 'Pending',
            dueDate: now.subtract(2, 'day').toISOString(),
        },
    ]

    const purchaseRows: PurchaseRow[] = [
        {
            id: 'ph-01',
            title: 'Science lab consumables',
            hod: 'R. Singh',
            amount: 42000,
            category: 'Lab',
            date: now.toISOString(),
            status: 'Submitted',
        },
        {
            id: 'ph-02',
            title: 'Bus tyre replacement',
            hod: 'L. Patel',
            amount: 58000,
            category: 'Transport',
            date: now.subtract(1, 'day').toISOString(),
            status: 'In review',
        },
        {
            id: 'ph-03',
            title: 'Sports jerseys',
            hod: 'S. Rao',
            amount: 18600,
            category: 'Sports',
            date: now.subtract(2, 'day').toISOString(),
            status: 'Approved',
        },
    ]

    const dueToday = useMemo(
        () =>
            tasks.filter((task) => dayjs(task.dueDate).isSame(now, 'day')),
        [now, tasks],
    )

    const overdue = useMemo(
        () =>
            tasks.filter((task) => dayjs(task.dueDate).isBefore(now, 'day')),
        [now, tasks],
    )

    const bucketedTasks = useMemo(
        () => ({
            New: tasks.filter((task) => task.bucket === 'New'),
            'In Progress': tasks.filter((task) => task.bucket === 'In Progress'),
            Completed: tasks.filter((task) => task.bucket === 'Completed'),
            Overdue: tasks.filter((task) => task.bucket === 'Overdue'),
        }),
        [tasks],
    )

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount)

    const advanceTask = (taskId: string) => {
        setTasks((prev) =>
            prev.map((task) => {
                if (task.id !== taskId) return task

                if (task.bucket === 'New') return { ...task, bucket: 'In Progress' }
                if (task.bucket === 'In Progress')
                    return { ...task, bucket: 'Completed' }
                return task
            }),
        )
    }

    const renderTaskRow = (task: HodTask, highlight?: boolean) => (
        <div
            key={task.id}
            className={classNames(
                'rounded-xl border px-3 py-3 text-sm shadow-sm dark:border-gray-800',
                highlight
                    ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50'
                    : 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800',
            )}
        >
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-50">
                            {task.title}
                        </span>
                        <Tag className={classNames('text-xs', priorityTone[task.priority])}>
                            {task.priority}
                        </Tag>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-300">
                        <span className="text-xs">
                            Dept: {task.department} • KRA: {task.kra}
                        </span>
                        <span className="text-xs">
                            Due {dayjs(task.dueDate).format('MMM D, h:mm A')}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Tag
                        className={classNames('text-xs font-semibold', bucketTone[task.bucket])}
                    >
                        {task.bucket}
                    </Tag>
                    <Link
                        to={`/hod/tasks/${task.id}`}
                        state={{ task }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                        Open detail <PiArrowRightDuotone />
                    </Link>
                    <Button
                        size="sm"
                        variant="plain"
                        onClick={() => advanceTask(task.id)}
                    >
                        Move forward
                    </Button>
                </div>
            </div>
        </div>
    )

    const renderBucket = (bucket: HodTaskBucket) => (
        <div key={bucket} className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {bucket}
                </div>
                <Tag
                    className={classNames('text-[11px] font-semibold', bucketTone[bucket])}
                >
                    {bucketedTasks[bucket].length} task(s)
                </Tag>
            </div>
            <div className="space-y-2">
                {bucketedTasks[bucket].length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        No items here yet.
                    </div>
                ) : (
                    bucketedTasks[bucket].map((task) => renderTaskRow(task))
                )}
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        HOD dashboard
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        Today&apos;s focus
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Due today, overdue, and delegated items at a glance with task buckets.
                    </p>
                </div>
                <Tag
                    prefix
                    className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100"
                >
                    <PiMegaphoneDuotone />
                    HOD view
                </Tag>
            </div>

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-100">
                            <PiClockCountdownDuotone />
                        </span>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Today&apos;s focus
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                                2 critical handoffs and 1 reschedule needed before 3 PM.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Tag className="bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100">
                            {dueToday.length} due today
                        </Tag>
                        <Tag className="bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950 dark:text-rose-100">
                            {overdue.length} overdue
                        </Tag>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card
                    header={{
                        content: 'Due Today (highlighted)',
                        bordered: false,
                    }}
                    className="border border-amber-100 shadow-sm ring-1 ring-amber-100 dark:border-amber-900 dark:ring-amber-900"
                >
                    <div className="space-y-3">
                        {dueToday.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-amber-200 px-3 py-2 text-sm text-amber-700 dark:border-amber-900 dark:text-amber-100">
                                Nothing due today.
                            </div>
                        ) : (
                            dueToday.map((task) => renderTaskRow(task, true))
                        )}
                    </div>
                </Card>
                <Card
                    header={{
                        content: 'Overdue list',
                        bordered: false,
                    }}
                    className="border border-rose-100 shadow-sm dark:border-rose-900"
                >
                    <div className="space-y-3">
                        {overdue.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-rose-200 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:text-rose-100">
                                You are clear of overdue items.
                            </div>
                        ) : (
                            overdue.map((task) =>
                                renderTaskRow(task, task.bucket === 'Overdue'),
                            )
                        )}
                    </div>
                </Card>
            </div>

            <Card
                header={{
                    content: (
                        <div className="flex items-center justify-between">
                            <span>Task buckets</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <PiHandPointingDuotone />
                                New, In Progress, Completed, Overdue
                            </div>
                        </div>
                    ),
                    bordered: false,
                }}
            >
                <div className="grid gap-4 lg:grid-cols-4">
                    {(['New', 'In Progress', 'Completed', 'Overdue'] as HodTaskBucket[]).map(
                        renderBucket,
                    )}
                </div>
            </Card>

            <Card
                header={{ content: 'Delegation summary', bordered: false }}
                className="border border-gray-100 dark:border-gray-800 shadow-sm"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 dark:text-gray-400">
                                <th className="py-2 pr-4">Staff</th>
                                <th className="py-2 pr-4">Task</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">E-sign</th>
                                <th className="py-2 pr-4">Due</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {delegation.map((row) => (
                                <tr key={`${row.staff}-${row.task}`}>
                                    <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-gray-50">
                                        {row.staff}
                                    </td>
                                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-200">
                                        {row.task}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <Tag
                                            className={classNames(
                                                'text-[11px] font-semibold',
                                                bucketTone[row.status],
                                            )}
                                        >
                                            {row.status}
                                        </Tag>
                                    </td>
                                    <td className="py-3 pr-4">
                                        <Tag
                                            prefix
                                            className={classNames(
                                                'text-[11px] font-semibold',
                                                row.esign === 'Signed'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100',
                                            )}
                                        >
                                            {row.esign === 'Signed' ? (
                                                <PiCheckCircleDuotone />
                                            ) : (
                                                <PiWarningCircleDuotone />
                                            )}
                                            {row.esign}
                                        </Tag>
                                    </td>
                                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                                        {dayjs(row.dueDate).format('MMM D')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card
                header={{ content: 'Purchases', bordered: false }}
                className="border border-gray-100 dark:border-gray-800 shadow-sm"
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                            Shortcut for HODs to add purchases and see latest submissions.
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                icon={<PiClipboardTextDuotone />}
                                asElement="button"
                            >
                                Add Purchase
                            </Button>
                            <Tooltip title="Opens detailed purchase workspace">
                                <Link
                                    to="/purchases"
                                    className="text-xs font-semibold text-primary hover:underline"
                                >
                                    Go to purchase board
                                </Link>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {purchaseRows.map((purchase) => (
                            <div
                                key={purchase.id}
                                className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                                        {purchase.title}
                                    </span>
                                    <Tag className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100">
                                        {purchase.status}
                                    </Tag>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <span>{purchase.hod}</span>
                                    <span>{purchase.category}</span>
                                    <span>{dayjs(purchase.date).format('MMM D')}</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                                        {formatCurrency(purchase.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default HodDashboard
