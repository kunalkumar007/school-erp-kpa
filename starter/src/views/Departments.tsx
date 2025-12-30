import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Table from '@/components/ui/Table'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    PiPencilSimpleDuotone,
    PiPlusCircleDuotone,
    PiPowerDuotone,
} from 'react-icons/pi'

type DepartmentStatus = 'Active' | 'Inactive'

type Department = {
    id: string
    name: string
    hod: string
    status: DepartmentStatus
}

type StatusFilter = 'all' | DepartmentStatus

type DepartmentForm = z.infer<typeof departmentSchema>

type DepartmentModalProps = {
    initialValue?: Department
    mode: 'add' | 'edit'
    onCancel: () => void
    onSave: (values: DepartmentForm) => void
    open: boolean
}

const { TBody, THead, Tr, Th, Td, Sorter } = Table

const departmentSchema = z.object({
    name: z
        .string({ required_error: 'Department name is required' })
        .trim()
        .min(1, { message: 'Department name is required' }),
    hod: z
        .string({ required_error: 'Assign a HOD' })
        .min(1, { message: 'Assign a HOD' }),
})

const hodOptions = [
    { value: 'R. Singh', label: 'R. Singh' },
    { value: 'L. Patel', label: 'L. Patel' },
    { value: 'A. Menon', label: 'A. Menon' },
    { value: 'S. Rao', label: 'S. Rao' },
    { value: 'D. Khanna', label: 'D. Khanna' },
]

const statusTone: Record<DepartmentStatus, string> = {
    Active:
        'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100',
    Inactive:
        'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100',
}

const DepartmentModal = ({
    initialValue,
    mode,
    onCancel,
    onSave,
    open,
}: DepartmentModalProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<DepartmentForm>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            name: initialValue?.name ?? '',
            hod: initialValue?.hod ?? '',
        },
    })

    useEffect(() => {
        if (open) {
            reset({
                name: initialValue?.name ?? '',
                hod: initialValue?.hod ?? '',
            })
        }
    }, [initialValue, open, reset])

    const onSubmit = (values: DepartmentForm) => {
        onSave(values)
    }

    return (
        <Dialog isOpen={open} onClose={onCancel} width={520}>
            <div className="px-6 pt-6 pb-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {mode === 'add' ? 'Add Department' : 'Edit Department'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Set the department name and assign a head of department.
                </p>
            </div>
            <div className="px-6 pb-6">
                <Form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        asterisk
                        label="Department name"
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    placeholder="e.g. Academics"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        asterisk
                        label="Assign HOD"
                        invalid={Boolean(errors.hod)}
                        errorMessage={errors.hod?.message}
                    >
                        <Controller
                            name="hod"
                            control={control}
                            render={({ field }) => {
                                const selected = hodOptions.find(
                                    (option) => option.value === field.value,
                                )
                                return (
                                    <Select
                                        {...field}
                                        value={selected}
                                        options={hodOptions}
                                        placeholder="Select HOD"
                                        isClearable={false}
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 50,
                                            }),
                                        }}
                                        onChange={(option) =>
                                            field.onChange(
                                                (option as { value: string })
                                                    ?.value ?? '',
                                            )
                                        }
                                    />
                                )
                            }}
                        />
                    </FormItem>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            loading={isSubmitting}
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

const seedDepartments: Department[] = [
    { id: 'dept-1', name: 'Academics', hod: 'R. Singh', status: 'Active' },
    { id: 'dept-2', name: 'Operations', hod: 'L. Patel', status: 'Active' },
    { id: 'dept-3', name: 'Library', hod: 'A. Menon', status: 'Inactive' },
    { id: 'dept-4', name: 'Sports', hod: 'S. Rao', status: 'Active' },
    { id: 'dept-5', name: 'Transport', hod: 'D. Khanna', status: 'Inactive' },
]

const Departments = () => {
    const [departments, setDepartments] = useState<Department[]>(() =>
        [...seedDepartments].sort((a, b) => a.name.localeCompare(b.name)),
    )
    const [filter, setFilter] = useState<StatusFilter>('all')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [modalState, setModalState] = useState<{
        mode: 'add' | 'edit'
        open: boolean
        current?: Department
    }>({
        mode: 'add',
        open: false,
    })

    const filteredDepartments = useMemo(() => {
        const sorted = [...departments].sort((a, b) =>
            sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name),
        )
        if (filter === 'all') {
            return sorted
        }
        return sorted.filter((dept) => dept.status === filter)
    }, [departments, filter, sortOrder])

    const openAddModal = () =>
        setModalState({ mode: 'add', open: true, current: undefined })

    const openEditModal = (department: Department) =>
        setModalState({ mode: 'edit', open: true, current: department })

    const closeModal = () =>
        setModalState((prev) => ({ ...prev, open: false, current: undefined }))

    const handleSave = (values: DepartmentForm) => {
        if (modalState.mode === 'add') {
            const newDepartment: Department = {
                id: `dept-${Date.now()}`,
                name: values.name.trim(),
                hod: values.hod,
                status: 'Active',
            }
            setDepartments((prev) => [...prev, newDepartment])
        } else if (modalState.current) {
            setDepartments((prev) =>
                prev.map((dept) =>
                    dept.id === modalState.current?.id
                        ? {
                              ...dept,
                              name: values.name.trim(),
                              hod: values.hod,
                          }
                        : dept,
                ),
            )
        }
        closeModal()
    }

    const handleToggleStatus = (id: string) => {
        setDepartments((prev) =>
            prev.map((dept) =>
                dept.id === id
                    ? {
                          ...dept,
                          status: dept.status === 'Active'
                              ? 'Inactive'
                              : 'Active',
                      }
                    : dept,
            ),
        )
    }

    const toggleSort = () =>
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))

    const activeFilterButtons: { label: string; value: StatusFilter }[] = [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Departments
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        Owner view
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Track departments, assign HODs, and control activation
                        in one place.
                    </p>
                </div>
                <Button
                    icon={<PiPlusCircleDuotone />}
                    variant="solid"
                    onClick={openAddModal}
                >
                    Add Department
                </Button>
            </div>

            <Card>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap items-center gap-2">
                        {activeFilterButtons.map((option) => (
                            <Button
                                key={option.value}
                                size="sm"
                                variant={
                                    filter === option.value
                                        ? 'solid'
                                        : 'default'
                                }
                                active={filter === option.value}
                                onClick={() => setFilter(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Sorted by department name ({sortOrder === 'asc'
                            ? 'A → Z'
                            : 'Z → A'}
                        )
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <THead>
                            <Tr>
                                <Th
                                    className="w-1/3"
                                    onClick={toggleSort}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="flex items-center gap-1">
                                        <span>Department</span>
                                        <Sorter sort={sortOrder} />
                                    </div>
                                </Th>
                                <Th>HOD</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Actions</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {filteredDepartments.length === 0 ? (
                                <Tr>
                                    <Td colSpan={4}>
                                        <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {filter === 'all'
                                                ? 'No departments added yet.'
                                                : 'No departments match this status.'}
                                        </div>
                                    </Td>
                                </Tr>
                            ) : (
                                filteredDepartments.map((department) => (
                                    <Tr key={department.id}>
                                        <Td className="font-semibold text-gray-900 dark:text-gray-50">
                                            {department.name}
                                        </Td>
                                        <Td className="text-gray-700 dark:text-gray-200">
                                            {department.hod}
                                        </Td>
                                        <Td>
                                            <Tag
                                                className={`text-xs font-semibold ${statusTone[department.status]}`}
                                            >
                                                {department.status}
                                            </Tag>
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    icon={
                                                        <PiPencilSimpleDuotone />
                                                    }
                                                    onClick={() =>
                                                        openEditModal(department)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={
                                                        department.status ===
                                                        'Active'
                                                            ? 'plain'
                                                            : 'solid'
                                                    }
                                                    icon={<PiPowerDuotone />}
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            department.id,
                                                        )
                                                    }
                                                >
                                                    {department.status ===
                                                    'Active'
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </Button>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </TBody>
                    </Table>
                </div>
            </Card>

            <DepartmentModal
                open={modalState.open}
                mode={modalState.mode}
                initialValue={modalState.current}
                onSave={handleSave}
                onCancel={closeModal}
            />
        </div>
    )
}

export default Departments
