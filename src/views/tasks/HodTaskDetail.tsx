import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import {
    Button,
    Card,
    DatePicker,
    Dialog,
    Form,
    FormItem,
    Input,
    Notification,
    Select,
    Tag,
    Upload,
    toast,
} from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import classNames from '@/utils/classNames'
import {
    PiArrowRightDuotone,
    PiCheckCircleDuotone,
    PiCloudArrowUpDuotone,
    PiClockCountdownDuotone,
    PiHandPointingDuotone,
    PiPlusCircleDuotone,
    PiSignatureDuotone,
    PiUserCircleDuotone,
} from 'react-icons/pi'

type HodTaskStatus = 'Not started' | 'In progress' | 'On hold' | 'Completed'

type HodTaskDetail = {
    id: string
    title: string
    description: string
    department: string
    kra: string
    dueDate: string
    priority: 'High' | 'Medium' | 'Low'
    status: HodTaskStatus
}

type ProgressNote = {
    id: string
    text: string
    attachments: string[]
    createdAt: string
}

type DelegationForm = {
    staffName: string
    notes: string
    internalDue: Date | null
}

type SignatureRecord = {
    name: string
    image: string
    timestamp: string
}

type SelectOption = { value: string; label: string }

type SignatureCaptureModalProps = {
    open: boolean
    staffName: string
    onClose: () => void
    onSave: (record: SignatureRecord) => void
}

const delegationSchema = z.object({
    staffName: z
        .string({ required_error: 'Staff name is required' })
        .trim()
        .min(1, { message: 'Staff name is required' }),
    notes: z.string().trim().optional(),
    internalDue: z.date().nullable(),
})

const noteSchema = z.object({
    note: z
        .string({ required_error: 'Add a quick note' })
        .trim()
        .min(1, { message: 'Add a quick note' }),
})

const priorityTone: Record<HodTaskDetail['priority'], string> = {
    High: 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950 dark:text-rose-100',
    Medium:
        'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100',
    Low: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
}

const statusTone: Record<HodTaskStatus, string> = {
    'Not started':
        'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-100',
    'In progress':
        'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100',
    'On hold':
        'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950 dark:text-amber-100',
    Completed:
        'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
}

const statusOptions: SelectOption[] = [
    { value: 'Not started', label: 'Not started' },
    { value: 'In progress', label: 'In progress' },
    { value: 'On hold', label: 'On hold' },
    { value: 'Completed', label: 'Completed' },
]

const SignatureCaptureModal = ({
    open,
    staffName,
    onClose,
    onSave,
}: SignatureCaptureModalProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [localName, setLocalName] = useState(staffName)
    const [isDrawing, setIsDrawing] = useState(false)

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const setCanvasSize = () => {
        const canvas = canvasRef.current
        if (canvas) {
            canvas.width = canvas.offsetWidth
            canvas.height = 220
        }
    }

    const getPoint = (event: PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        }
    }

    const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
        setIsDrawing(true)
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return
        const { x, y } = getPoint(event)
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return
        const { x, y } = getPoint(event)
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#0f172a'
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    const handlePointerUp = () => {
        setIsDrawing(false)
    }

    const saveSignature = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const image = canvas.toDataURL('image/png')
        onSave({
            name: localName?.trim() || staffName,
            image,
            timestamp: new Date().toISOString(),
        })
        onClose()
    }

    useEffect(() => {
        setLocalName(staffName)
        setTimeout(setCanvasSize, 0)
    }, [staffName, open])

    return (
        <Dialog isOpen={open} width={760} onClose={onClose}>
            <div className="px-6 pt-6 pb-2">
                <div className="flex items-center gap-2">
                    <PiSignatureDuotone className="text-xl text-primary" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Capture e-sign
                    </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stores signature image + timestamp + staff name
                </p>
            </div>
            <div className="space-y-4 px-6 pb-6">
                <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Staff name
                    </p>
                    <Input
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        placeholder="Name for the signature record"
                        prefix={<PiUserCircleDuotone />}
                    />
                </div>
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/70">
                    <canvas
                        ref={canvasRef}
                        className="h-[220px] w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 touch-none"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    />
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <PiHandPointingDuotone />
                        Sign with mouse or touch. Clear if you need to restart.
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="plain" onClick={clearCanvas}>
                        Clear
                    </Button>
                    <Button variant="solid" icon={<PiSignatureDuotone />} onClick={saveSignature}>
                        Save
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

const HodTaskDetail = () => {
    const params = useParams<{ taskId: string }>()
    const location = useLocation()
    const taskFromState = (location.state as { task?: HodTaskDetail })?.task

    const defaultTask = useMemo<HodTaskDetail>(
        () => ({
            id: params.taskId ?? 'hod-task',
            title: 'Science lab readiness review',
            description:
                'Check the equipment uptime, recent incident logs, and certify vendors before the practical exam week.',
            department: 'Academics',
            kra: 'Safety & compliance',
            dueDate: dayjs().add(1, 'day').toISOString(),
            priority: 'High',
            status: 'Not started',
        }),
        [params.taskId],
    )

    const [task, setTask] = useState<HodTaskDetail>(taskFromState ?? defaultTask)
    const [accepted, setAccepted] = useState(false)
    const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([])
    const [noteFiles, setNoteFiles] = useState<File[]>([])
    const [delegations, setDelegations] = useState<DelegationForm[]>([])
    const [signatureRecord, setSignatureRecord] = useState<SignatureRecord | null>(null)
    const [showSignatureModal, setShowSignatureModal] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<{ note: string }>({
        resolver: zodResolver(noteSchema),
        defaultValues: { note: '' },
    })

    const {
        control: delegationControl,
        handleSubmit: handleDelegationSubmit,
        reset: resetDelegation,
        formState: { errors: delegationErrors },
    } = useForm<DelegationForm>({
        resolver: zodResolver(delegationSchema),
        defaultValues: {
            staffName: '',
            notes: '',
            internalDue: null,
        },
    })

    const acceptTask = () => {
        setAccepted(true)
        toast.push(
            <Notification title="Task accepted" type="success">
                Status stays editable while you log progress.
            </Notification>,
            { placement: 'top-center' },
        )
    }

    const updateStatus = (status: HodTaskStatus) => {
        setTask((prev) => ({ ...prev, status }))
    }

    const addProgressNote = ({ note }: { note: string }) => {
        const attachments = noteFiles.map((file) => file.name)
        const newNote: ProgressNote = {
            id: `pn-${Math.floor(Math.random() * 9000 + 1000)}`,
            text: note,
            attachments,
            createdAt: new Date().toISOString(),
        }
        setProgressNotes((prev) => [newNote, ...prev])
        setNoteFiles([])
        reset({ note: '' })
    }

    const delegateTask = (values: DelegationForm) => {
        setDelegations((prev) => [...prev, values])
        resetDelegation({
            staffName: '',
            notes: '',
            internalDue: null,
        })
        toast.push(
            <Notification title="Delegated" type="success">
                Add e-sign to lock delegation.
            </Notification>,
            { placement: 'top-center' },
        )
    }

    const priorityLabel = priorityTone[task.priority]
    const statusLabel = statusTone[task.status]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        HOD Task Detail
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {task.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Core info, acceptance, status, and daily progress notes.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Tag className={classNames('text-[11px] font-semibold', priorityLabel)}>
                        Priority: {task.priority}
                    </Tag>
                    <Tag className={classNames('text-[11px] font-semibold', statusLabel)}>
                        Status: {task.status}
                    </Tag>
                    {accepted && (
                        <Tag
                            prefix
                            className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100"
                        >
                            <PiCheckCircleDuotone />
                            Accepted
                        </Tag>
                    )}
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/60">
                                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Department
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-gray-50">
                                    {task.department}
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/60">
                                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    KRA
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-gray-50">
                                    {task.kra}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-100">
                                <PiClockCountdownDuotone />
                                Due {dayjs(task.dueDate).format('MMM D, YYYY • h:mm A')}
                            </div>
                            <Select
                                classNamePrefix="select"
                                value={statusOptions.find((option) => option.value === task.status)}
                                options={statusOptions}
                                onChange={(option) =>
                                    updateStatus((option as SelectOption).value as HodTaskStatus)
                                }
                                placeholder="Status"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Description
                            </p>
                            <p className="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100">
                                {task.description}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="solid"
                                icon={<PiCheckCircleDuotone />}
                                onClick={acceptTask}
                                disabled={accepted}
                            >
                                Accept task
                            </Button>
                            <Button
                                variant="default"
                                icon={<PiArrowRightDuotone />}
                                onClick={() => updateStatus('In progress')}
                            >
                                Mark In progress
                            </Button>
                            <Button variant="plain" onClick={() => updateStatus('Completed')}>
                                Mark Completed
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{ content: 'Daily progress', bordered: false }}
                >
                    <Form className="space-y-3" onSubmit={handleSubmit(addProgressNote)}>
                        <FormItem
                            asterisk
                            label="Add note"
                            invalid={Boolean(errors.note)}
                            errorMessage={errors.note?.message}
                        >
                            <Controller
                                name="note"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={2}
                                        placeholder="Log what moved, blockers, next action"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <Upload
                            multiple
                            showList
                            onChange={(files) => setNoteFiles(files)}
                            uploadLimit={4}
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <PiCloudArrowUpDuotone />
                                Attachments
                            </div>
                        </Upload>
                        <Button
                            type="submit"
                            variant="solid"
                            icon={<PiPlusCircleDuotone />}
                        >
                            Add progress note
                        </Button>
                    </Form>
                    <div className="mt-4 space-y-3">
                        {progressNotes.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                No notes logged yet.
                            </div>
                        ) : (
                            progressNotes.map((note) => (
                                <div
                                    key={note.id}
                                    className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {dayjs(note.createdAt).format('MMM D, h:mm A')}
                                        </span>
                                        <Tag className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100">
                                            Progress
                                        </Tag>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-100">
                                        {note.text}
                                    </p>
                                    {note.attachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                                            {note.attachments.map((file) => (
                                                <Tag
                                                    key={file}
                                                    prefix
                                                    className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100"
                                                >
                                                    <PiCloudArrowUpDuotone />
                                                    {file}
                                                </Tag>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.05fr,0.95fr]">
                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{ content: 'Delegation', bordered: false }}
                >
                    <Form
                        className="space-y-3"
                        onSubmit={handleDelegationSubmit(delegateTask)}
                    >
                        <FormItem
                            asterisk
                            label="Delegate to"
                            invalid={Boolean(delegationErrors.staffName)}
                            errorMessage={delegationErrors.staffName?.message}
                        >
                            <Controller
                                name="staffName"
                                control={delegationControl}
                                render={({ field }) => (
                                    <Input
                                        autoComplete="off"
                                        prefix={<PiUserCircleDuotone />}
                                        placeholder="Staff name"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Notes"
                            invalid={Boolean(delegationErrors.notes)}
                            errorMessage={delegationErrors.notes?.message}
                        >
                            <Controller
                                name="notes"
                                control={delegationControl}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={2}
                                        placeholder="Clarify expectations or blockers"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Internal due date">
                            <Controller
                                name="internalDue"
                                control={delegationControl}
                                render={({ field }) => (
                                    <DatePicker
                                        value={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        placeholder="Pick date"
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="submit"
                                variant="solid"
                                icon={<PiHandPointingDuotone />}
                            >
                                Delegate task
                            </Button>
                            <Button
                                type="button"
                                variant="default"
                                icon={<PiSignatureDuotone />}
                                onClick={() => setShowSignatureModal(true)}
                            >
                                Capture e-sign
                            </Button>
                        </div>
                    </Form>
                    <div className="mt-4 space-y-3">
                        {delegations.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                Delegations will appear here.
                            </div>
                        ) : (
                            delegations.map((delegate, index) => (
                                <div
                                    key={`${delegate.staffName}-${index}`}
                                    className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-gray-900 dark:text-gray-50">
                                                {delegate.staffName}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {delegate.notes || 'No notes added'}
                                            </p>
                                        </div>
                                        <Tag className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100">
                                            Due{' '}
                                            {delegate.internalDue
                                                ? dayjs(delegate.internalDue).format('MMM D')
                                                : 'Not set'}
                                        </Tag>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{ content: 'E-sign capture', bordered: false }}
                >
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Capture signatures for staff acknowledgment. Store image + timestamp +
                            staff name.
                        </p>
                        <Button
                            icon={<PiSignatureDuotone />}
                            variant="solid"
                            onClick={() => setShowSignatureModal(true)}
                        >
                            Open signature canvas
                        </Button>
                        {signatureRecord ? (
                            <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                                            {signatureRecord.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Saved {dayjs(signatureRecord.timestamp).format('MMM D, h:mm A')}
                                        </p>
                                    </div>
                                    <Tag
                                        prefix
                                        className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100"
                                    >
                                        <PiSignatureDuotone />
                                        Signed
                                    </Tag>
                                </div>
                                <img
                                    src={signatureRecord.image}
                                    alt="Signature preview"
                                    className="h-28 w-full rounded-md border border-gray-200 object-contain dark:border-gray-700"
                                />
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                No signature saved yet.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <SignatureCaptureModal
                open={showSignatureModal}
                staffName={
                    delegations.length > 0
                        ? delegations[delegations.length - 1].staffName
                        : task.department
                }
                onClose={() => setShowSignatureModal(false)}
                onSave={(record) => {
                    setSignatureRecord(record)
                }}
            />
        </div>
    )
}

export default HodTaskDetail
