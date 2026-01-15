import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
    Upload,
    toast,
} from '@/components/ui'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    PiArrowRightDuotone,
    PiCalendarDotsDuotone,
    PiCloudArrowUpDuotone,
    PiFlagBannerDuotone,
    PiQuestionDuotone,
    PiTargetDuotone,
} from 'react-icons/pi'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'

type TaskType = 'task' | 'question'

type DepartmentOption = {
    value: string
    label: string
}

type KraOption = {
    value: string
    label: string
    departmentId: string
}

type LocationState = {
    departmentId?: string
    departmentName?: string
    kraId?: string
    kraTitle?: string
    taskType?: TaskType
}

type AttachmentMeta = {
    name: string
    size: number
}

const departmentOptions: DepartmentOption[] = [
    { value: 'academics', label: 'Academics' },
    { value: 'operations', label: 'Operations' },
    { value: 'library', label: 'Library' },
    { value: 'sports', label: 'Sports' },
]

const kraOptions: KraOption[] = [
    {
        value: 'kra-1',
        label: 'Improve student outcomes',
        departmentId: 'academics',
    },
    {
        value: 'kra-2',
        label: 'Teacher readiness',
        departmentId: 'academics',
    },
    {
        value: 'kra-3',
        label: 'Bus safety compliance',
        departmentId: 'operations',
    },
    {
        value: 'kra-4',
        label: 'Library engagement',
        departmentId: 'library',
    },
    {
        value: 'kra-5',
        label: 'Athlete readiness',
        departmentId: 'sports',
    },
]

const taskSchema = z
    .object({
        departmentId: z
            .string({ required_error: 'Select a department' })
            .min(1, { message: 'Select a department' }),
        kraId: z
            .string({ required_error: 'Select a KRA' })
            .min(1, { message: 'Select a KRA' }),
        taskType: z.enum(['task', 'question']),
        title: z
            .string({ required_error: 'Title is required' })
            .trim()
            .min(1, { message: 'Title is required' }),
        description: z.object({
            html: z.string(),
            text: z
                .string({ required_error: 'Description is required' })
                .trim()
                .min(1, { message: 'Description is required' }),
        }),
        priority: z.enum(['Low', 'Med', 'High']),
        startDate: z
            .date({ invalid_type_error: 'Start date is required' })
            .nullable(),
        dueDate: z
            .date({ invalid_type_error: 'Due date is required' })
            .nullable(),
    })
    .superRefine((data, ctx) => {
        if (!data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['startDate'],
                message: 'Start date is required',
            })
        }

        if (!data.dueDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['dueDate'],
                message: 'Due date is required',
            })
        }

        if (
            data.startDate &&
            data.dueDate &&
            dayjs(data.startDate).isAfter(data.dueDate, 'day')
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['startDate'],
                message: 'Start date cannot be after due date',
            })
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['dueDate'],
                message: 'Due date cannot be before start date',
            })
        }
    })

type TaskFormValues = z.infer<typeof taskSchema>

const priorityTone: Record<TaskFormValues['priority'], string> = {
    Low: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
    Med: 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100',
    High: 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950 dark:text-rose-100',
}

const TaskCreate = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const locationState = (location.state as LocationState) ?? {}

    const [attachments, setAttachments] = useState<File[]>([])

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            departmentId: locationState.departmentId ?? '',
            kraId: locationState.kraId ?? '',
            taskType: locationState.taskType ?? 'task',
            title: '',
            description: { html: '', text: '' },
            priority: 'Med',
            startDate: null,
            dueDate: null,
        },
    })

    const selectedDepartmentId = watch('departmentId')
    const selectedKraId = watch('kraId')
    const selectedPriority = watch('priority')
    const selectedTaskType = watch('taskType')
    const startDate = watch('startDate')
    const dueDate = watch('dueDate')

    const availableKras = useMemo(
        () =>
            kraOptions.filter((option) =>
                selectedDepartmentId
                    ? option.departmentId === selectedDepartmentId
                    : true,
            ),
        [selectedDepartmentId],
    )

    useEffect(() => {
        if (
            selectedKraId &&
            !availableKras.some((option) => option.value === selectedKraId)
        ) {
            setValue('kraId', '')
        }
    }, [availableKras, selectedKraId, setValue])

    const onSubmit = (values: TaskFormValues) => {
        if (!values.startDate || !values.dueDate) return

        const newTaskId = `task-${Math.floor(Math.random() * 90000 + 10000)}`
        const attachmentMeta: AttachmentMeta[] = attachments.map((file) => ({
            name: file.name,
            size: file.size,
        }))

        toast.push(
            <Notification title="Saved to Owner tasks" type="success">
                {values.taskType === 'task'
                    ? 'Task created for your KRA.'
                    : 'Question submitted to the owner queue.'}
            </Notification>,
            { placement: 'top-center' },
        )

        setTimeout(() => {
            navigate(`/tasks/${newTaskId}`, {
                state: {
                    taskId: newTaskId,
                    attachments: attachmentMeta,
                    form: {
                        ...values,
                        startDate: values.startDate?.toISOString(),
                        dueDate: values.dueDate?.toISOString(),
                        kraTitle:
                            kraOptions.find(
                                (kra) => kra.value === values.kraId,
                            )?.label ?? '',
                        departmentName:
                            departmentOptions.find(
                                (dept) => dept.value === values.departmentId,
                            )?.label ?? '',
                    },
                },
            })
        }, 650)
    }

    const currentDepartment = departmentOptions.find(
        (dept) => dept.value === selectedDepartmentId,
    )
    const currentKra = kraOptions.find((kra) => kra.value === selectedKraId)

    const summaryItems = [
        {
            label: 'Department',
            value: currentDepartment?.label || 'Not selected',
        },
        {
            label: 'KRA',
            value: currentKra?.label || 'Link a KRA',
        },
        {
            label: 'Priority',
            value: selectedPriority,
            tone: priorityTone[selectedPriority],
        },
        {
            label: 'Window',
            value:
                startDate && dueDate
                    ? `${dayjs(startDate).format('MMM D')} → ${dayjs(dueDate).format('MMM D')}`
                    : 'Add start and due dates',
        },
    ]

    const descriptionHelper =
        selectedTaskType === 'task'
            ? 'Describe the expected outcome, acceptance criteria, and owners.'
            : 'Clarify what you need answered and the context the HOD should know.'

    const renderPrefillBanner = () => {
        if (!locationState.departmentId && !locationState.kraId) return null

        const departmentLabel =
            locationState.departmentName ??
            departmentOptions.find(
                (dept) => dept.value === locationState.departmentId,
            )?.label

        return (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-sm text-primary">
                <PiTargetDuotone className="text-lg" />
                <div>
                    <div className="font-semibold">
                        Scoped from KRA workspace
                    </div>
                    <p className="text-primary/80">
                        {departmentLabel
                            ? `Department: ${departmentLabel}`
                            : 'Department shared from previous screen'}
                        {locationState.kraTitle
                            ? ` • KRA: ${locationState.kraTitle}`
                            : ''}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Owner workspace
                </p>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                            Create Task / Ask Question
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Route work to the right department and KRA with a
                            clear scope, dates, and attachments.
                        </p>
                    </div>
                    <Tag
                        prefix
                        className="text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-100"
                    >
                        Owner only
                    </Tag>
                </div>
                {renderPrefillBanner()}
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
                    <div className="space-y-6">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                        Scope & type
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Anchor the task to a department and KRA
                                        so it stays accountable.
                                    </p>
                                </div>
                                <Tag
                                    prefix
                                    className="bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100"
                                >
                                    <PiQuestionDuotone className="text-base" />
                                    Task or Question
                                </Tag>
                            </div>
                            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                <FormItem
                                    asterisk
                                    label="Department"
                                    invalid={Boolean(errors.departmentId)}
                                    errorMessage={errors.departmentId?.message}
                                >
                                    <Controller
                                        name="departmentId"
                                        control={control}
                                        render={({ field }) => {
                                            const selected =
                                                departmentOptions.find(
                                                    (option) =>
                                                        option.value ===
                                                        field.value,
                                                ) ?? null
                                            return (
                                                <Select
                                                    {...field}
                                                    isClearable
                                                    value={selected}
                                                    options={departmentOptions}
                                                    placeholder="Choose department"
                                                    menuPortalTarget={
                                                        document.body
                                                    }
                                                    styles={{
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 50,
                                                        }),
                                                    }}
                                                    onChange={(option) =>
                                                        field.onChange(
                                                            (option as {
                                                                value: string
                                                            })?.value ?? '',
                                                        )
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="KRA"
                                    invalid={Boolean(errors.kraId)}
                                    errorMessage={errors.kraId?.message}
                                >
                                    <Controller
                                        name="kraId"
                                        control={control}
                                        render={({ field }) => {
                                            const options = availableKras.map(
                                                (kra) => ({
                                                    value: kra.value,
                                                    label: kra.label,
                                                }),
                                            )
                                            const selected =
                                                options.find(
                                                    (option) =>
                                                        option.value ===
                                                        field.value,
                                                ) ?? null
                                            return (
                                                <Select
                                                    {...field}
                                                    isClearable
                                                    value={selected}
                                                    options={options}
                                                    placeholder={
                                                        selectedDepartmentId
                                                            ? 'Choose a KRA'
                                                            : 'Select a department first'
                                                    }
                                                    isDisabled={
                                                        !selectedDepartmentId
                                                    }
                                                    menuPortalTarget={
                                                        document.body
                                                    }
                                                    styles={{
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 50,
                                                        }),
                                                    }}
                                                    onChange={(option) =>
                                                        field.onChange(
                                                            (option as {
                                                                value: string
                                                            })?.value ?? '',
                                                        )
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                </FormItem>
                            </div>
                            <FormItem
                                label="Task type"
                                invalid={Boolean(errors.taskType)}
                                errorMessage={errors.taskType?.message}
                            >
                                <Controller
                                    name="taskType"
                                    control={control}
                                    render={({ field }) => (
                                        <Segment
                                            value={field.value}
                                            className={classNames(
                                                'p-1',
                                                errors.taskType &&
                                                    'ring-1 ring-error border-error',
                                            )}
                                            onChange={(value) =>
                                                field.onChange(value as TaskType)
                                            }
                                        >
                                            <Segment.Item value="task">
                                                <div className="flex items-center gap-2">
                                                    <PiFlagBannerDuotone />
                                                    <div>
                                                        <div className="font-semibold">
                                                            Task
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Action with owners
                                                            and dates
                                                        </p>
                                                    </div>
                                                </div>
                                            </Segment.Item>
                                            <Segment.Item value="question">
                                                <div className="flex items-center gap-2">
                                                    <PiQuestionDuotone />
                                                    <div>
                                                        <div className="font-semibold">
                                                            Question
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Quick clarification
                                                            for this KRA
                                                        </p>
                                                    </div>
                                                </div>
                                            </Segment.Item>
                                        </Segment>
                                    )}
                                />
                            </FormItem>
                        </Card>

                        <Card>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                        Details
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Title and description support markdown
                                        and formatting.
                                    </p>
                                </div>
                                <Tag
                                    prefix
                                    className="bg-primary/10 text-primary border border-primary/30"
                                >
                                    <PiArrowRightDuotone />
                                    Required
                                </Tag>
                            </div>
                            <div className="mt-5 space-y-4">
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
                                                {...field}
                                                autoComplete="off"
                                                placeholder="e.g. Publish remediation plan for grade 9 math"
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Description"
                                    extra={descriptionHelper}
                                    invalid={Boolean(errors.description)}
                                    errorMessage={
                                        errors.description?.text?.message
                                    }
                                >
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <RichTextEditor
                                                content={field.value.html}
                                                invalid={Boolean(
                                                    errors.description,
                                                )}
                                                editorContentClass="min-h-[180px]"
                                                onChange={(content) =>
                                                    field.onChange({
                                                        html: content.html,
                                                        text: content.text,
                                                    })
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                        Timing & priority
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Keep start and due dates within range;
                                        default priority is Medium.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <FormItem
                                    asterisk
                                    label="Start date"
                                    invalid={Boolean(errors.startDate)}
                                    errorMessage={errors.startDate?.message}
                                >
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                value={
                                                    field.value
                                                        ? new Date(field.value)
                                                        : null
                                                }
                                                clearable={false}
                                                maxDate={dueDate ?? undefined}
                                                placeholder="Select start"
                                                suffix={
                                                    <PiCalendarDotsDuotone />
                                                }
                                                onChange={(date) =>
                                                    field.onChange(date)
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Due date"
                                    invalid={Boolean(errors.dueDate)}
                                    errorMessage={errors.dueDate?.message}
                                >
                                    <Controller
                                        name="dueDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                value={
                                                    field.value
                                                        ? new Date(field.value)
                                                        : null
                                                }
                                                clearable={false}
                                                minDate={startDate ?? undefined}
                                                placeholder="Select due"
                                                suffix={
                                                    <PiCalendarDotsDuotone />
                                                }
                                                onChange={(date) =>
                                                    field.onChange(date)
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <FormItem label="Priority">
                                <Controller
                                    name="priority"
                                    control={control}
                                    render={({ field }) => (
                                        <Segment
                                            value={field.value}
                                            className="p-1"
                                            onChange={(value) =>
                                                field.onChange(
                                                    value as TaskFormValues['priority'],
                                                )
                                            }
                                        >
                                            <Segment.Item value="Low">
                                                <div className="flex items-center gap-2">
                                                    <Tag
                                                        className={
                                                            priorityTone['Low']
                                                        }
                                                    >
                                                        Low
                                                    </Tag>
                                                    <span className="text-xs text-gray-600 dark:text-gray-300">
                                                        Monitor
                                                    </span>
                                                </div>
                                            </Segment.Item>
                                            <Segment.Item value="Med">
                                                <div className="flex items-center gap-2">
                                                    <Tag
                                                        className={
                                                            priorityTone['Med']
                                                        }
                                                    >
                                                        Med
                                                    </Tag>
                                                    <span className="text-xs text-gray-600 dark:text-gray-300">
                                                        Default
                                                    </span>
                                                </div>
                                            </Segment.Item>
                                            <Segment.Item value="High">
                                                <div className="flex items-center gap-2">
                                                    <Tag
                                                        className={
                                                            priorityTone['High']
                                                        }
                                                    >
                                                        High
                                                    </Tag>
                                                    <span className="text-xs text-gray-600 dark:text-gray-300">
                                                        Escalate
                                                    </span>
                                                </div>
                                            </Segment.Item>
                                        </Segment>
                                    )}
                                />
                            </FormItem>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                        Attachments
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Upload multiple files, confirm list, and
                                        remove if needed.
                                    </p>
                                </div>
                                <Tag
                                    prefix
                                    className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100"
                                >
                                    <PiCloudArrowUpDuotone />
                                    Supports multiple
                                </Tag>
                            </div>
                            <div className="mt-4">
                                <Upload
                                    draggable
                                    multiple
                                    fileList={attachments}
                                    className="border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-6"
                                    tip={
                                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                            Include briefs, rubrics, or context
                                            docs. File names and sizes show
                                            below.
                                        </p>
                                    }
                                    onChange={(files) => setAttachments(files)}
                                    onFileRemove={(files) =>
                                        setAttachments(files)
                                    }
                                >
                                    <div className="flex flex-col items-center gap-2 text-center text-gray-600 dark:text-gray-200">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary ring-1 ring-primary/20 dark:bg-gray-900">
                                            <PiCloudArrowUpDuotone className="text-xl" />
                                        </div>
                                        <div className="text-sm font-semibold">
                                            Drop files here or click to upload
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PDF, docs, images — we keep the
                                            filenames and size
                                        </p>
                                    </div>
                                </Upload>
                            </div>
                        </Card>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Start date cannot be after the due date; both
                                are required before submission.
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="default"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="solid"
                                    loading={isSubmitting}
                                    icon={<PiArrowRightDuotone />}
                                >
                                    Create & go to detail
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-50">
                                        Quick summary
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Live view of your selections before you
                                        submit.
                                    </p>
                                </div>
                                <Tag
                                    prefix
                                    className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-100"
                                >
                                    <PiCalendarDotsDuotone />
                                    {selectedTaskType === 'task'
                                        ? 'Task'
                                        : 'Question'}
                                </Tag>
                            </div>
                            <div className="mt-4 space-y-3">
                                {summaryItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-800/70"
                                    >
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {item.label}
                                        </span>
                                        {item.tone ? (
                                            <Tag
                                                className={classNames(
                                                    'text-[11px] font-semibold',
                                                    item.tone,
                                                )}
                                            >
                                                {item.value}
                                            </Tag>
                                        ) : (
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {item.value}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-50">
                                        Attachment list
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Confirm uploads before sending.
                                    </p>
                                </div>
                                <Tag
                                    prefix
                                    className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-100"
                                >
                                    <PiCloudArrowUpDuotone />
                                    {attachments.length} file
                                    {attachments.length === 1 ? '' : 's'}
                                </Tag>
                            </div>
                            <div className="mt-4 space-y-2">
                                {attachments.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                                        No attachments added yet.
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
                                                    {Math.round(file.size / 1000)}{' '}
                                                    kb
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
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default TaskCreate
