import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import Table from '@/components/ui/Table'
import Switcher from '@/components/ui/Switcher'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    PiArrowsClockwiseDuotone,
    PiChatsDuotone,
    PiClipboardTextDuotone,
    PiNotePencilDuotone,
    PiPlusCircleDuotone,
    PiTargetDuotone,
} from 'react-icons/pi'

type DepartmentOption = {
    value: string
    label: string
}

type Kra = {
    id: string
    title: string
    description: string
    departmentId: string
    owner: string
    lastUpdated: string
    active: boolean
    taskCount: number
    questionCount: number
}

type KraForm = z.infer<typeof kraSchema>

type KraModalProps = {
    open: boolean
    mode: 'create' | 'edit'
    departmentName: string
    initialValue?: Kra
    onClose: () => void
    onSave: (values: KraForm) => void
}

const { THead, TBody, Tr, Th, Td } = Table

const departments: DepartmentOption[] = [
    { value: 'academics', label: 'Academics' },
    { value: 'operations', label: 'Operations' },
    { value: 'library', label: 'Library' },
    { value: 'sports', label: 'Sports' },
]

const kraSchema = z.object({
    title: z
        .string({ required_error: 'KRA title is required' })
        .trim()
        .min(1, { message: 'KRA title is required' }),
    description: z
        .string({ required_error: 'Add a short description' })
        .trim()
        .min(10, { message: 'Add a short description' }),
    owner: z
        .string({ required_error: 'Assign an owner' })
        .trim()
        .min(1, { message: 'Assign an owner' }),
})

const seedKras: Kra[] = [
    {
        id: 'kra-1',
        title: 'Improve student outcomes',
        description: 'Raise average assessment scores by 10% with targeted remediation.',
        departmentId: 'academics',
        owner: 'A. Rao',
        lastUpdated: 'Today',
        active: true,
        taskCount: 12,
        questionCount: 3,
    },
    {
        id: 'kra-2',
        title: 'Teacher readiness',
        description: 'Ensure every teacher completes the new pedagogy training plan.',
        departmentId: 'academics',
        owner: 'L. Patel',
        lastUpdated: '2 days ago',
        active: true,
        taskCount: 7,
        questionCount: 2,
    },
    {
        id: 'kra-3',
        title: 'Bus safety compliance',
        description: 'Complete monthly bus safety drills and log incident responses.',
        departmentId: 'operations',
        owner: 'M. Sharma',
        lastUpdated: 'Yesterday',
        active: false,
        taskCount: 4,
        questionCount: 1,
    },
    {
        id: 'kra-4',
        title: 'Library engagement',
        description: 'Grow weekly student library visits by 20% via reading programs.',
        departmentId: 'library',
        owner: 'P. Iyer',
        lastUpdated: '4 days ago',
        active: true,
        taskCount: 5,
        questionCount: 0,
    },
    {
        id: 'kra-5',
        title: 'Athlete readiness',
        description: 'Prepare inter-school teams with verified medical and training logs.',
        departmentId: 'sports',
        owner: 'S. Mehta',
        lastUpdated: 'Today',
        active: true,
        taskCount: 9,
        questionCount: 4,
    },
]

const statusTone: Record<boolean, string> = {
    true: 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
    false: 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100',
}

const KraModal = ({
    open,
    mode,
    departmentName,
    initialValue,
    onClose,
    onSave,
}: KraModalProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<KraForm>({
        resolver: zodResolver(kraSchema),
        defaultValues: {
            title: initialValue?.title ?? '',
            description: initialValue?.description ?? '',
            owner: initialValue?.owner ?? '',
        },
    })

    useEffect(() => {
        if (open) {
            reset({
                title: initialValue?.title ?? '',
                description: initialValue?.description ?? '',
                owner: initialValue?.owner ?? '',
            })
        }
    }, [initialValue, open, reset])

    const onSubmit = (values: KraForm) => {
        onSave(values)
    }

    return (
        <Dialog isOpen={open} onClose={onClose} width={560}>
            <div className="px-6 pt-6 pb-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {mode === 'create' ? 'Create KRA' : 'Edit KRA'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Scope: {departmentName}
                </p>
            </div>
            <div className="px-6 pb-6">
                <Form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                                    placeholder="KRA title"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        asterisk
                        label="Short description"
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
                                    placeholder="Why this matters and the expected outcome"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        asterisk
                        label="Owner"
                        invalid={Boolean(errors.owner)}
                        errorMessage={errors.owner?.message}
                    >
                        <Controller
                            name="owner"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    placeholder="Who is accountable?"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            loading={isSubmitting}
                        >
                            {mode === 'create' ? 'Create' : 'Save changes'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

const KraManagement = () => {
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<
        string | null
    >(null)
    const [kras, setKras] = useState<Kra[]>(seedKras)
    const [selectedKraId, setSelectedKraId] = useState<string | null>(null)
    const [modalState, setModalState] = useState<{
        open: boolean
        mode: 'create' | 'edit'
        kraId?: string
    }>({
        open: false,
        mode: 'create',
    })

    const selectedDepartment = departments.find(
        (dept) => dept.value === selectedDepartmentId,
    )

    const filteredKras = useMemo(() => {
        if (!selectedDepartmentId) {
            return []
        }
        return kras
            .filter((kra) => kra.departmentId === selectedDepartmentId)
            .sort((a, b) => a.title.localeCompare(b.title))
    }, [kras, selectedDepartmentId])

    useEffect(() => {
        if (!selectedDepartmentId) {
            setSelectedKraId(null)
            return
        }

        if (
            filteredKras.length > 0 &&
            !filteredKras.some((kra) => kra.id === selectedKraId)
        ) {
            setSelectedKraId(filteredKras[0].id)
        }

        if (filteredKras.length === 0) {
            setSelectedKraId(null)
        }
    }, [filteredKras, selectedDepartmentId])

    const selectedKra = useMemo(
        () => kras.find((kra) => kra.id === selectedKraId),
        [kras, selectedKraId],
    )

    const handleToggleActive = (kraId: string) => {
        setKras((prev) =>
            prev.map((kra) =>
                kra.id === kraId ? { ...kra, active: !kra.active } : kra,
            ),
        )
    }

    const openCreateModal = () => {
        if (!selectedDepartmentId) {
            return
        }
        setModalState({ open: true, mode: 'create', kraId: undefined })
    }

    const openEditModal = (kraId: string) => {
        setModalState({ open: true, mode: 'edit', kraId })
    }

    const closeModal = () =>
        setModalState((prev) => ({ ...prev, open: false, kraId: undefined }))

    const handleSave = (values: KraForm) => {
        if (!selectedDepartmentId) {
            closeModal()
            return
        }
        if (modalState.mode === 'create') {
            const newKra: Kra = {
                id: `kra-${Date.now()}`,
                title: values.title.trim(),
                description: values.description.trim(),
                owner: values.owner.trim(),
                departmentId: selectedDepartmentId,
                lastUpdated: 'Just now',
                active: true,
                taskCount: 0,
                questionCount: 0,
            }
            setKras((prev) => [...prev, newKra])
            setSelectedKraId(newKra.id)
        } else if (modalState.mode === 'edit' && modalState.kraId) {
            setKras((prev) =>
                prev.map((kra) =>
                    kra.id === modalState.kraId
                        ? {
                              ...kra,
                              title: values.title.trim(),
                              description: values.description.trim(),
                              owner: values.owner.trim(),
                              lastUpdated: 'Just now',
                          }
                        : kra,
                ),
            )
        }
        closeModal()
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Owner workspace
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                            KRA Management
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Start by selecting a department to scope KRAs, then
                            manage activation, edits, and actions without
                            losing context.
                        </p>
                    </div>
                    <Button
                        variant="solid"
                        icon={<PiPlusCircleDuotone />}
                        disabled={!selectedDepartmentId}
                        onClick={openCreateModal}
                    >
                        Create KRA
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <div className="flex flex-col gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                    Department scope
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Choose a department to load its KRAs and keep
                                    list and detail in sync.
                                </p>
                            </div>
                            <div className="w-full md:w-72">
                                <Select
                                    value={selectedDepartment ?? null}
                                    options={departments}
                                    placeholder="Select department"
                                    isClearable={false}
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 50,
                                        }),
                                    }}
                                    onChange={(option) => {
                                        setSelectedDepartmentId(
                                            (option as DepartmentOption)
                                                ?.value ?? null,
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        {!selectedDepartmentId && (
                            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                                Select a department to view KRAs, toggle Active,
                                and drill into details.
                            </div>
                        )}
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <Table>
                            <THead>
                                <Tr>
                                    <Th className="w-1/2">KRA</Th>
                                    <Th>Active</Th>
                                    <Th className="text-right">Actions</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {filteredKras.length === 0 ? (
                                    <Tr>
                                        <Td colSpan={3}>
                                            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {selectedDepartmentId
                                                    ? 'No KRAs for this department yet.'
                                                    : 'Pick a department to get started.'}
                                            </div>
                                        </Td>
                                    </Tr>
                                ) : (
                                    filteredKras.map((kra) => (
                                        <Tr
                                            key={kra.id}
                                            className={`cursor-pointer transition ${
                                                selectedKraId === kra.id
                                                    ? 'bg-gray-50 dark:bg-gray-800/60'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                                            }`}
                                            onClick={() =>
                                                setSelectedKraId(kra.id)
                                            }
                                        >
                                            <Td>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                                                            {kra.title}
                                                        </span>
                                                        <Tag
                                                            className={`text-[11px] font-semibold ${statusTone[kra.active]}`}
                                                        >
                                                            {kra.active
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </Tag>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {kra.description}
                                                    </p>
                                                </div>
                                            </Td>
                                            <Td>
                                                <Switcher
                                                    checked={kra.active}
                                                    onChange={(_checked, e) => {
                                                        e.stopPropagation()
                                                        handleToggleActive(
                                                            kra.id,
                                                        )
                                                    }}
                                                />
                                            </Td>
                                            <Td className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    icon={<PiNotePencilDuotone />}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openEditModal(kra.id)
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))
                                )}
                            </TBody>
                        </Table>
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <div className="flex items-start justify-between gap-3 pb-2">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                KRA detail
                            </p>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                {selectedKra ? selectedKra.title : 'Select a KRA'}
                            </h3>
                        </div>
                        {selectedKra && (
                            <Switcher
                                checked={selectedKra.active}
                                onChange={(_checked, e) => {
                                    e.stopPropagation()
                                    handleToggleActive(selectedKra.id)
                                }}
                                checkedContent="Active"
                                unCheckedContent="Inactive"
                            />
                        )}
                    </div>

                    {!selectedKra ? (
                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                            Pick a department and KRA from the list to see tasks,
                            questions, and quick actions.
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {selectedKra.description}
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <div>
                                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Department
                                    </span>
                                    {selectedDepartment?.label}
                                </div>
                                <div>
                                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Owner
                                    </span>
                                    {selectedKra.owner}
                                </div>
                                <div>
                                    <span className="block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Last updated
                                    </span>
                                    {selectedKra.lastUpdated}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Tag
                                        className={`text-[11px] font-semibold ${statusTone[selectedKra.active]}`}
                                    >
                                        {selectedKra.active ? 'Active' : 'Inactive'}
                                    </Tag>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        State updates immediately on toggle
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Button
                                    variant="solid"
                                    icon={<PiClipboardTextDuotone />}
                                >
                                    Create Task
                                </Button>
                                <Button
                                    variant="default"
                                    icon={<PiChatsDuotone />}
                                >
                                    Ask Question
                                </Button>
                                <Button
                                    variant="default"
                                    icon={<PiArrowsClockwiseDuotone />}
                                    className="sm:col-span-2"
                                >
                                    View tasks for this KRA
                                </Button>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200">
                                <div className="flex items-center gap-2">
                                    <PiTargetDuotone className="text-lg text-primary" />
                                    <div>
                                        <div className="font-semibold">
                                            Quick pulse
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {selectedKra.taskCount} tasks • {selectedKra.questionCount} questions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <KraModal
                open={modalState.open}
                mode={modalState.mode}
                departmentName={selectedDepartment?.label ?? ''}
                initialValue={
                    modalState.mode === 'edit'
                        ? kras.find((kra) => kra.id === modalState.kraId)
                        : undefined
                }
                onClose={closeModal}
                onSave={handleSave}
            />
        </div>
    )
}

export default KraManagement
