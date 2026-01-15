import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
    Button,
    Card,
    DatePicker,
    Form,
    FormItem,
    Input,
    Notification,
    Segment,
    Select,
    Tag,
    toast,
} from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import classNames from '@/utils/classNames'
import {
    PiCalendarCheckDuotone,
    PiClockCountdownDuotone,
    PiFlagBannerDuotone,
    PiLightningDuotone,
    PiNotePencilDuotone,
    PiPlusCircleDuotone,
    PiTimerDuotone,
} from 'react-icons/pi'

type SelfTaskStatus = 'Not started' | 'In progress' | 'Completed'
type SelfTaskPriority = 'Low' | 'Medium' | 'High'

type SelfTask = {
    id: string
    title: string
    description: string
    dueAt: string
    priority: SelfTaskPriority
    tags: string[]
    status: SelfTaskStatus
    createdAt: string
}

type SelectOption = { value: string; label: string }

const selfTaskSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .trim()
        .min(1, { message: 'Title is required' }),
    description: z
        .string({ required_error: 'Description is required' })
        .trim()
        .min(1, { message: 'Description is required' }),
    dueAt: z.date({ invalid_type_error: 'Due date and time is required' }).nullable(),
    priority: z.enum(['Low', 'Medium', 'High']),
    tags: z.array(z.string()).default([]),
})

type SelfTaskForm = z.infer<typeof selfTaskSchema>

const priorityTone: Record<SelfTaskPriority, string> = {
    Low: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
    Medium: 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100',
    High: 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950 dark:text-rose-100',
}

const statusTone: Record<SelfTaskStatus, string> = {
    'Not started':
        'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-100',
    'In progress':
        'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100',
    Completed:
        'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
}

const tagOptions: SelectOption[] = [
    { value: 'Approvals', label: 'Approvals' },
    { value: 'Finance', label: 'Finance' },
    { value: 'People', label: 'People' },
    { value: 'Calls', label: 'Calls' },
    { value: 'Deep work', label: 'Deep work' },
    { value: 'Follow-ups', label: 'Follow-ups' },
]

const statusSteps: SelfTaskStatus[] = ['Not started', 'In progress', 'Completed']

const OwnerSelfTasks = () => {
    const now = useMemo(() => dayjs(), [])

    const initialTasks = useMemo<SelfTask[]>(
        () => [
            {
                id: 'st-201',
                title: 'Prep talking points for parent townhall',
                description:
                    'Outline the wins, acknowledge pain points, and list 3 asks for the PTA core.',
                dueAt: now.add(2, 'hour').toISOString(),
                priority: 'High',
                tags: ['Approvals', 'Calls'],
                status: 'In progress',
                createdAt: now.toISOString(),
            },
            {
                id: 'st-202',
                title: 'Sign transport vendor addendum',
                description: 'Cross-check clauses 4 and 7, then sign and archive.',
                dueAt: now.add(1, 'day').toISOString(),
                priority: 'Medium',
                tags: ['Finance'],
                status: 'Not started',
                createdAt: now.subtract(1, 'day').toISOString(),
            },
            {
                id: 'st-203',
                title: 'Schedule call with Sports HOD',
                description: 'Align on tournament budget asks and set next review date.',
                dueAt: now.subtract(1, 'day').hour(17).minute(0).toISOString(),
                priority: 'Low',
                tags: ['People', 'Calls'],
                status: 'Not started',
                createdAt: now.subtract(2, 'day').toISOString(),
            },
            {
                id: 'st-204',
                title: 'Reflect on fee waiver policy',
                description:
                    'List non-negotiables and where flexibility is allowed before board meeting.',
                dueAt: now.subtract(3, 'day').toISOString(),
                priority: 'Medium',
                tags: ['Deep work'],
                status: 'Completed',
                createdAt: now.subtract(4, 'day').toISOString(),
            },
        ],
        [now],
    )

    const [tasks, setTasks] = useState<SelfTask[]>(initialTasks)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
        initialTasks[0]?.id ?? null,
    )

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SelfTaskForm>({
        resolver: zodResolver(selfTaskSchema),
        defaultValues: {
            title: '',
            description: '',
            dueAt: null,
            priority: 'Medium',
            tags: ['Deep work'],
        },
    })

    const selectedTask = useMemo(
        () => tasks.find((task) => task.id === selectedTaskId) ?? null,
        [selectedTaskId, tasks],
    )

    const groupedTasks = useMemo(() => {
        const today: SelfTask[] = []
        const upcoming: SelfTask[] = []
        const overdue: SelfTask[] = []
        const completed: SelfTask[] = []

        tasks.forEach((task) => {
            const due = dayjs(task.dueAt)
            if (task.status === 'Completed') {
                completed.push(task)
                return
            }

            if (due.isSame(now, 'day')) {
                today.push(task)
            } else if (due.isBefore(now, 'day')) {
                overdue.push(task)
            } else {
                upcoming.push(task)
            }
        })

        return { today, upcoming, overdue, completed }
    }, [now, tasks])

    const createTask = (values: SelfTaskForm) => {
        if (!values.dueAt) return

        const newTask: SelfTask = {
            id: `st-${Math.floor(Math.random() * 9000 + 1000)}`,
            title: values.title,
            description: values.description,
            dueAt: values.dueAt.toISOString(),
            priority: values.priority,
            tags: values.tags,
            status: 'Not started',
            createdAt: new Date().toISOString(),
        }

        setTasks((prev) => [newTask, ...prev])
        setSelectedTaskId(newTask.id)

        toast.push(
            <Notification title="Self task created" type="success">
                Tracked under Today/Upcoming based on due date.
            </Notification>,
            { placement: 'top-center' },
        )

        reset({
            title: '',
            description: '',
            dueAt: null,
            priority: 'Medium',
            tags: values.tags,
        })
    }

    const setStatus = (taskId: string, status: SelfTaskStatus) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId ? { ...task, status } : task,
            ),
        )
    }

    const cycleStatus = (taskId: string) => {
        setTasks((prev) =>
            prev.map((task) => {
                if (task.id !== taskId) return task
                const currentIndex = statusSteps.indexOf(task.status)
                const nextStatus = statusSteps[(currentIndex + 1) % statusSteps.length]
                return { ...task, status: nextStatus }
            }),
        )
    }

    const renderTaskTag = (label: string, tone: string, key?: string) => (
        <Tag
            key={key ?? label}
            className={classNames('text-[11px] font-semibold', tone)}
        >
            {label}
        </Tag>
    )

    const renderTaskCard = (task: SelfTask) => (
        <button
            key={task.id}
            type="button"
            onClick={() => setSelectedTaskId(task.id)}
            className={classNames(
                'w-full rounded-xl border px-3 py-3 text-left transition shadow-sm dark:border-gray-800',
                selectedTaskId === task.id
                    ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 bg-white hover:border-primary/40 dark:border-gray-800 dark:bg-gray-800',
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-50">
                            {task.title}
                        </p>
                        {renderTaskTag(
                            task.priority,
                            priorityTone[task.priority],
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Due {dayjs(task.dueAt).format('MMM D, h:mm A')}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        {task.tags.map((tag) =>
                            renderTaskTag(
                                tag,
                                'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100',
                                `${task.id}-${tag}`,
                            ),
                        )}
                    </div>
                </div>
                {renderTaskTag(task.status, statusTone[task.status])}
            </div>
        </button>
    )

    const renderBucket = (title: string, tasksList: SelfTask[], accent?: string) => (
        <Card
            header={{
                content: (
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {tasksList.length} task(s)
                        </span>
                    </div>
                ),
                bordered: false,
            }}
            className={classNames(
                'border border-gray-100 dark:border-gray-800 shadow-sm',
                accent,
            )}
        >
            <div className="space-y-3">
                {tasksList.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        Nothing here right now.
                    </div>
                ) : (
                    tasksList.map(renderTaskCard)
                )}
            </div>
        </Card>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Owner self tasks
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        Personal queue
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quick capture with Today, Upcoming, Overdue, and Completed lanes.
                    </p>
                </div>
                <Tag
                    prefix
                    className="bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-50"
                >
                    <PiLightningDuotone />
                    Focused view
                </Tag>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Create self task',
                        bordered: false,
                    }}
                >
                    <Form
                        className="space-y-4"
                        onSubmit={handleSubmit(createTask)}
                    >
                        <FormItem
                            asterisk
                            label="Title"
                            invalid={Boolean(errors.title)}
                            errorMessage={errors.title?.message}
                        >
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        autoComplete="off"
                                        placeholder="What do you need to get done?"
                                        prefix={<PiFlagBannerDuotone />}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            asterisk
                            label="Description"
                            invalid={Boolean(errors.description)}
                            errorMessage={errors.description?.message}
                        >
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={3}
                                        placeholder="Add context, links, or expected output"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="grid gap-3 md:grid-cols-2">
                            <FormItem
                                asterisk
                                label="Due date & time"
                                invalid={Boolean(errors.dueAt)}
                                errorMessage={errors.dueAt?.message}
                            >
                                <Controller
                                    name="dueAt"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker.DateTimepicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            inputFormat="DD MMM, YYYY hh:mm a"
                                            placeholder="Pick when this is due"
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Priority"
                                invalid={Boolean(errors.priority)}
                                errorMessage={errors.priority?.message}
                            >
                                <Controller
                                    name="priority"
                                    control={control}
                                    render={({ field }) => (
                                        <Segment
                                            value={field.value}
                                            onChange={(value) =>
                                                field.onChange(
                                                    value as SelfTaskPriority,
                                                )
                                            }
                                        >
                                            <Segment.Item value="Low">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    Low
                                                </div>
                                            </Segment.Item>
                                            <Segment.Item value="Medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                    Medium
                                                </div>
                                            </Segment.Item>
                                            <Segment.Item value="High">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                                                    High
                                                </div>
                                            </Segment.Item>
                                        </Segment>
                                    )}
                                />
                            </FormItem>
                        </div>
                        <FormItem label="Tags">
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        classNamePrefix="select"
                                        options={tagOptions}
                                        value={tagOptions.filter((option) =>
                                            field.value.includes(option.value),
                                        )}
                                        onChange={(options) =>
                                            field.onChange(
                                                (options as SelectOption[] | null)?.map(
                                                    (option) => option.value,
                                                ) ?? [],
                                            )
                                        }
                                        placeholder="Add tags to group work"
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 50,
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                            icon={<PiPlusCircleDuotone />}
                        >
                            Save to self tasks
                        </Button>
                    </Form>
                </Card>

                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{ content: 'Self task detail', bordered: false }}
                >
                    {selectedTask ? (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Title
                                    </p>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                        {selectedTask.title}
                                    </h3>
                                </div>
                                {renderTaskTag(
                                    selectedTask.status,
                                    statusTone[selectedTask.status],
                                )}
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/60">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
                                        <PiTimerDuotone />
                                        Due{' '}
                                        {dayjs(selectedTask.dueAt).format(
                                            'MMM D, YYYY • h:mm A',
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/60">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
                                        <PiClockCountdownDuotone />
                                        Created{' '}
                                        {dayjs(selectedTask.createdAt).format(
                                            'MMM D, YYYY',
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Description
                                </p>
                                <p className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100">
                                    {selectedTask.description}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {renderTaskTag(
                                    `Priority: ${selectedTask.priority}`,
                                    priorityTone[selectedTask.priority],
                                )}
                                {selectedTask.tags.map((tag) =>
                                    renderTaskTag(
                                        tag,
                                        'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100',
                                        `${selectedTask.id}-${tag}`,
                                    ),
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    variant="solid"
                                    icon={<PiCalendarCheckDuotone />}
                                    onClick={() => cycleStatus(selectedTask.id)}
                                >
                                    Advance status
                                </Button>
                                <Button
                                    size="sm"
                                    variant="default"
                                    icon={<PiNotePencilDuotone />}
                                    onClick={() =>
                                        setStatus(selectedTask.id, 'In progress')
                                    }
                                >
                                    Mark in progress
                                </Button>
                                <Button
                                    size="sm"
                                    variant="plain"
                                    onClick={() =>
                                        setStatus(selectedTask.id, 'Completed')
                                    }
                                >
                                    Mark completed
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            Select a task from the lists to see details.
                        </div>
                    )}
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {renderBucket('Today', groupedTasks.today, 'bg-primary/5')}
                {renderBucket('Upcoming', groupedTasks.upcoming)}
                {renderBucket(
                    'Overdue',
                    groupedTasks.overdue,
                    'ring-1 ring-rose-100',
                )}
                {renderBucket('Completed', groupedTasks.completed)}
            </div>
        </div>
    )
}

export default OwnerSelfTasks
