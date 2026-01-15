import dayjs from 'dayjs'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'

type NotificationItem = {
    id: string
    title: string
    detail: string
    date: string
    type: 'task' | 'purchase' | 'system'
}

const notifications: NotificationItem[] = [
    {
        id: 'nt-1',
        title: '2 HOD tasks overdue',
        detail: 'Operations and Sports need your attention.',
        date: dayjs().toISOString(),
        type: 'task',
    },
    {
        id: 'nt-2',
        title: 'New purchase logged',
        detail: 'Transport diesel top-up recorded today.',
        date: dayjs().toISOString(),
        type: 'purchase',
    },
    {
        id: 'nt-3',
        title: 'Curriculum update shared',
        detail: 'Lesson plans uploaded by Academics HOD.',
        date: dayjs().subtract(1, 'day').toISOString(),
        type: 'task',
    },
    {
        id: 'nt-4',
        title: 'System reminder',
        detail: 'Confirm payroll release by 5 PM.',
        date: dayjs().subtract(2, 'day').toISOString(),
        type: 'system',
    },
]

const typeTone: Record<NotificationItem['type'], string> = {
    task: 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100',
    purchase:
        'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
    system:
        'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100',
}

const Notifications = () => {
    return (
        <div className="space-y-4">
            <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Notifications
                </p>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    Inbox
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Latest updates from tasks and purchases.
                </p>
            </div>
            <Card>
                <div className="space-y-4">
                    {notifications.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col gap-1 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 dark:border-gray-800"
                        >
                            <div className="flex items-center gap-2">
                                <Tag
                                    className={`text-xs font-semibold ${typeTone[item.type]}`}
                                >
                                    {item.type}
                                </Tag>
                                <span className="font-semibold text-gray-900 dark:text-gray-50">
                                    {item.title}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                {item.detail}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {dayjs(item.date).format('MMM D, YYYY • h:mm A')}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default Notifications
