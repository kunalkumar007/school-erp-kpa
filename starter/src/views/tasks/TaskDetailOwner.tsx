import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Tag } from '@/components/ui'
import dayjs from 'dayjs'
import classNames from '@/utils/classNames'
import {
    PiArrowRightDuotone,
    PiCalendarDotsDuotone,
    PiCloudArrowUpDuotone,
    PiFlagBannerDuotone,
    PiQuestionDuotone,
    PiTargetDuotone,
} from 'react-icons/pi'

type TaskType = 'task' | 'question'
type Priority = 'Low' | 'Med' | 'High'

type AttachmentMeta = {
    name: string
    size: number
}

type TaskDetailState = {
    taskId?: string
    attachments?: AttachmentMeta[]
    form?: {
        departmentId: string
        departmentName?: string
        kraId: string
        kraTitle?: string
        taskType: TaskType
        title: string
        description: { html: string; text: string }
        priority: Priority
        startDate?: string
        dueDate?: string
    }
}

const priorityTone: Record<Priority, string> = {
    Low: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
    Med: 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100',
    High: 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950 dark:text-rose-100',
}

const formatSize = (size: number) => `${Math.round(size / 1000)} kb`

const TaskDetailOwner = () => {
    const navigate = useNavigate()
    const params = useParams<{ taskId: string }>()
    const location = useLocation()
    const state = (location.state as TaskDetailState) ?? {}

    const taskId = params.taskId ?? state.taskId ?? 'task'
    const form = state.form
    const attachments = state.attachments ?? []

    const startDate = form?.startDate ? dayjs(form.startDate) : null
    const dueDate = form?.dueDate ? dayjs(form.dueDate) : null

    const timelineLabel =
        startDate && dueDate
            ? `${startDate.format('MMM D, YYYY')} → ${dueDate.format('MMM D, YYYY')}`
            : 'Dates will appear after setting start and due'

    const renderEmptyState = () => (
        <Card className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Task detail not found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                This page expects data from the create flow. Start a new task or
                question and you will land back here with the full context.
            </p>
            <div className="flex gap-2">
                <Button
                    variant="solid"
                    icon={<PiArrowRightDuotone />}
                    onClick={() => navigate('/tasks/create')}
                >
                    Start a task
                </Button>
                <Button variant="default" onClick={() => navigate('/kras')}>
                    Back to KRAs
                </Button>
            </div>
        </Card>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Owner task detail
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        Task #{taskId}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Confirmation view with the scope, timing, and files you
                        just submitted.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Tag
                        prefix
                        className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <PiTargetDuotone className="text-base" />
                        Owner view
                    </Tag>
                    {form?.taskType && (
                        <Tag
                            prefix
                            className="bg-primary/10 text-primary border border-primary/30"
                        >
                            {form.taskType === 'task' ? (
                                <PiFlagBannerDuotone className="text-base" />
                            ) : (
                                <PiQuestionDuotone className="text-base" />
                            )}
                            {form.taskType === 'task' ? 'Task' : 'Question'}
                        </Tag>
                    )}
                    {form?.priority && (
                        <Tag
                            className={classNames(
                                'text-[11px] font-semibold',
                                priorityTone[form.priority],
                            )}
                        >
                            Priority: {form.priority}
                        </Tag>
                    )}
                </div>
            </div>

            {!form ? (
                renderEmptyState()
            ) : (
                <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
                    <Card>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Title
                                </p>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                    {form.title || 'Untitled'}
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Description
                                </p>
                                {form.description?.html ? (
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/60"
                                        dangerouslySetInnerHTML={{
                                            __html: form.description.html,
                                        }}
                                    />
                                ) : (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                                        No description captured.
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <Card>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-50">
                                        Scope
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Department and KRA routing.
                                    </p>
                                </div>
                                <Tag
                                    prefix
                                    className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-100"
                                >
                                    <PiTargetDuotone />
                                    KRA linked
                                </Tag>
                            </div>
                            <div className="mt-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/70">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Department
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {form.departmentName || form.departmentId}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/70">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        KRA
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {form.kraTitle || form.kraId}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/70">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Timeline
                                    </span>
                                    <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                                        <PiCalendarDotsDuotone className="text-lg text-primary" />
                                        {timelineLabel}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-50">
                                        Attachments
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        What you uploaded with this task.
                                    </p>
                                </div>
                                <Tag
                                    prefix
                                    className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100"
                                >
                                    <PiCloudArrowUpDuotone />
                                    {attachments.length} file
                                    {attachments.length === 1 ? '' : 's'}
                                </Tag>
                            </div>
                            <div className="mt-4 space-y-2">
                                {attachments.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                                        No attachments were added.
                                    </div>
                                ) : (
                                    attachments.map((file) => (
                                        <div
                                            key={file.name}
                                            className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-800"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {file.name}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatSize(file.size)}
                                                </p>
                                            </div>
                                            <Tag className="bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-100">
                                                Attached
                                            </Tag>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-50">
                                        Next steps
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Keep momentum after logging this item.
                                    </p>
                                </div>
                                <Tag
                                    prefix
                                    className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-100"
                                >
                                    <PiArrowRightDuotone />
                                    Owner actions
                                </Tag>
                            </div>
                            <div className="mt-4 flex flex-col gap-2">
                                <Button
                                    block
                                    variant="solid"
                                    icon={<PiArrowRightDuotone />}
                                    onClick={() =>
                                        navigate('/tasks/create', {
                                            state: {
                                                departmentId: form.departmentId,
                                                departmentName:
                                                    form.departmentName,
                                                kraId: form.kraId,
                                                kraTitle: form.kraTitle,
                                                taskType: form.taskType,
                                            },
                                        })
                                    }
                                >
                                    Create another with the same scope
                                </Button>
                                <Button
                                    block
                                    variant="default"
                                    onClick={() => navigate('/kras')}
                                >
                                    Back to KRA workspace
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskDetailOwner
