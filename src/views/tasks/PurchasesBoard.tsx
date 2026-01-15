import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
    Button,
    Card,
    DatePicker,
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
    PiCalendarDotsDuotone,
    PiChartLineDuotone,
    PiCloudArrowUpDuotone,
    PiDownloadSimpleDuotone,
    PiFunnelSimpleDuotone,
    PiMagnifyingGlassDuotone,
    PiNotebookDuotone,
    PiPlusCircleDuotone,
    PiReceiptDuotone,
    PiTagDuotone,
} from 'react-icons/pi'

type HodPurchase = {
    id: string
    date: string
    category: string
    vendor: string
    amount: number
    purpose: string
    link?: string
    attachments: string[]
}

type OwnerAttachment = {
    name: string
    type: 'pdf' | 'image'
    preview?: string
}

type OwnerReviewRow = {
    id: string
    dept: string
    hod: string
    amount: number
    category: string
    vendor: string
    date: string
    submittedAt: string
    attachments: OwnerAttachment[]
    notes?: string
    status?: 'Reviewed' | 'Pending'
}

type HodFormValues = {
    date: Date | null
    category: string
    vendor: string
    amount: number
    purpose: string
    link?: string
}

type SelectOption = { value: string; label: string }

const hodPurchaseSchema = z.object({
    date: z.date({ invalid_type_error: 'Pick a date' }).nullable(),
    category: z
        .string({ required_error: 'Category is required' })
        .trim()
        .min(1, { message: 'Category is required' }),
    vendor: z
        .string({ required_error: 'Vendor is required' })
        .trim()
        .min(1, { message: 'Vendor is required' }),
    amount: z
        .number({ required_error: 'Amount is required' })
        .min(1, { message: 'Amount is required' }),
    purpose: z
        .string({ required_error: 'Purpose is required' })
        .trim()
        .min(1, { message: 'Purpose is required' }),
    link: z.string().optional(),
})

const categoryOptions: SelectOption[] = [
    { value: 'Transport', label: 'Transport' },
    { value: 'Lab', label: 'Lab' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Cafeteria', label: 'Cafeteria' },
    { value: 'Compliance', label: 'Compliance' },
]

const deptOptions: SelectOption[] = [
    { value: 'Academics', label: 'Academics' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Finance', label: 'Finance' },
]

const vendorOptions: SelectOption[] = [
    { value: 'Sharma Supplies', label: 'Sharma Supplies' },
    { value: 'SafeRoute Motors', label: 'SafeRoute Motors' },
    { value: 'FreshCart', label: 'FreshCart' },
    { value: 'Zephyr Sports', label: 'Zephyr Sports' },
]

const imagePlaceholder =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><rect width="360" height="200" fill="%23eef2ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%235a67d8">Bill preview</text></svg>'

const PurchasesBoard = () => {
    const today = useMemo(() => dayjs(), [])

    const initialHodPurchases = useMemo<HodPurchase[]>(
        () => [
            {
                id: 'hp-01',
                date: today.toISOString(),
                category: 'Lab',
                vendor: 'Sharma Supplies',
                amount: 42000,
                purpose: 'Chemicals and glassware restock',
                link: 'Task: Lab safety',
                attachments: ['invoice-lab.pdf', 'store-receipt.png'],
            },
            {
                id: 'hp-02',
                date: today.subtract(1, 'day').toISOString(),
                category: 'Transport',
                vendor: 'SafeRoute Motors',
                amount: 58000,
                purpose: 'Tyre replacements for route 3 buses',
                attachments: ['tyre-bill.pdf'],
            },
            {
                id: 'hp-03',
                date: today.subtract(3, 'day').toISOString(),
                category: 'Sports',
                vendor: 'Zephyr Sports',
                amount: 18600,
                purpose: 'Jerseys for inter-school teams',
                link: 'KRA: Athlete readiness',
                attachments: ['sports-jerseys.pdf', 'mockup.png'],
            },
        ],
        [today],
    )

    const initialOwnerReviews = useMemo<OwnerReviewRow[]>(
        () => [
            {
                id: 'or-01',
                dept: 'Transport',
                hod: 'L. Patel',
                amount: 58000,
                category: 'Transport',
                vendor: 'SafeRoute Motors',
                date: today.subtract(1, 'day').toISOString(),
                submittedAt: today.toISOString(),
                attachments: [
                    { name: 'tyre-bill.pdf', type: 'pdf' },
                    { name: 'tyre-photo.png', type: 'image', preview: imagePlaceholder },
                ],
                notes: 'Signed by transport HOD, waiting on owner review.',
                status: 'Pending',
            },
            {
                id: 'or-02',
                dept: 'Academics',
                hod: 'R. Singh',
                amount: 42000,
                category: 'Lab',
                vendor: 'Sharma Supplies',
                date: today.toISOString(),
                submittedAt: today.toISOString(),
                attachments: [
                    { name: 'invoice-lab.pdf', type: 'pdf' },
                    { name: 'receipt.jpg', type: 'image', preview: imagePlaceholder },
                ],
                notes: 'Linked to lab readiness task.',
                status: 'Reviewed',
            },
            {
                id: 'or-03',
                dept: 'Sports',
                hod: 'S. Rao',
                amount: 18600,
                category: 'Sports',
                vendor: 'Zephyr Sports',
                date: today.subtract(2, 'day').toISOString(),
                submittedAt: today.subtract(1, 'day').toISOString(),
                attachments: [
                    { name: 'sports-jerseys.pdf', type: 'pdf' },
                    { name: 'mockup.png', type: 'image', preview: imagePlaceholder },
                ],
                status: 'Pending',
            },
        ],
        [today],
    )

    const [hodPurchases, setHodPurchases] = useState<HodPurchase[]>(initialHodPurchases)
    const [hodFiles, setHodFiles] = useState<File[]>([])
    const [hodCategory, setHodCategory] = useState<SelectOption | null>(null)
    const [hodDateRange, setHodDateRange] = useState<[Date | null, Date | null]>([null, null])

    const [ownerReviews] = useState<OwnerReviewRow[]>(initialOwnerReviews)
    const [ownerFilters, setOwnerFilters] = useState({
        dept: 'all',
        category: 'all',
        vendor: 'all',
        minAmount: '',
        maxAmount: '',
        dateRange: [null, null] as [Date | null, Date | null],
    })
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(
        initialOwnerReviews[0]?.id ?? null,
    )

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<HodFormValues>({
        resolver: zodResolver(hodPurchaseSchema),
        defaultValues: {
            date: null,
            category: '',
            vendor: '',
            amount: 0,
            purpose: '',
            link: '',
        },
    })

    const filteredHodPurchases = useMemo(
        () =>
            hodPurchases.filter((purchase) => {
                const matchesCategory =
                    !hodCategory || hodCategory.value === purchase.category
                const [start, end] = hodDateRange
                const purchaseDate = dayjs(purchase.date)
                const matchesDate =
                    (!start || purchaseDate.isAfter(dayjs(start).subtract(1, 'day'))) &&
                    (!end || purchaseDate.isBefore(dayjs(end).add(1, 'day')))

                return matchesCategory && matchesDate
            }),
        [hodCategory, hodDateRange, hodPurchases],
    )

    const filteredOwnerReviews = useMemo(() => {
        return ownerReviews.filter((review) => {
            const matchesDept = ownerFilters.dept === 'all' || review.dept === ownerFilters.dept
            const matchesCategory =
                ownerFilters.category === 'all' || review.category === ownerFilters.category
            const matchesVendor =
                ownerFilters.vendor === 'all' || review.vendor === ownerFilters.vendor
            const [start, end] = ownerFilters.dateRange
            const reviewDate = dayjs(review.date)
            const matchesDate =
                (!start || reviewDate.isAfter(dayjs(start).subtract(1, 'day'))) &&
                (!end || reviewDate.isBefore(dayjs(end).add(1, 'day')))
            const minAmount = ownerFilters.minAmount ? Number(ownerFilters.minAmount) : null
            const maxAmount = ownerFilters.maxAmount ? Number(ownerFilters.maxAmount) : null
            const matchesAmount =
                (minAmount === null || review.amount >= minAmount) &&
                (maxAmount === null || review.amount <= maxAmount)

            return (
                matchesDept &&
                matchesCategory &&
                matchesVendor &&
                matchesDate &&
                matchesAmount
            )
        })
    }, [ownerFilters, ownerReviews])

    useEffect(() => {
        if (!selectedReviewId && ownerReviews.length > 0) {
            setSelectedReviewId(ownerReviews[0].id)
        }
    }, [ownerReviews, selectedReviewId])

    useEffect(() => {
        if (
            filteredOwnerReviews.length > 0 &&
            !filteredOwnerReviews.some((review) => review.id === selectedReviewId)
        ) {
            setSelectedReviewId(filteredOwnerReviews[0].id)
        }
    }, [filteredOwnerReviews, selectedReviewId])

    const selectedReview = filteredOwnerReviews.find(
        (review) => review.id === selectedReviewId,
    )

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount)

    const addPurchase = (values: HodFormValues) => {
        if (!values.date) return

        const newPurchase: HodPurchase = {
            id: `hp-${Math.floor(Math.random() * 9000 + 1000)}`,
            date: values.date.toISOString(),
            category: values.category,
            vendor: values.vendor,
            amount: values.amount,
            purpose: values.purpose,
            link: values.link,
            attachments: hodFiles.map((file) => file.name),
        }

        setHodPurchases((prev) => [newPurchase, ...prev])
        setHodFiles([])
        reset({
            date: null,
            category: '',
            vendor: '',
            amount: 0,
            purpose: '',
            link: '',
        })
        toast.push(
            <Notification title="Purchase added" type="success">
                Logged under HOD purchase history.
            </Notification>,
            { placement: 'top-center' },
        )
    }

    const renderFilterSelect = (
        label: string,
        value: string,
        options: SelectOption[],
        onChange: (value: string) => void,
    ) => (
        <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {label}
            </div>
            <Select
                classNamePrefix="select"
                isClearable={false}
                isSearchable={false}
                value={{ value, label: value === 'all' ? 'All' : value }}
                options={[{ value: 'all', label: 'All' }, ...options]}
                onChange={(option) => onChange((option as SelectOption).value)}
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 50 }),
                }}
            />
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Purchases workspace
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        HOD submissions & Owner review
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add Purchase + purchase history for HODs and owner filters with bill previews.
                    </p>
                </div>
                <Tag
                    prefix
                    className="bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-50"
                >
                    <PiReceiptDuotone />
                    Purchases
                </Tag>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
                <Card
                    header={{ content: 'Add Purchase (HOD)', bordered: false }}
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <Form className="space-y-3" onSubmit={handleSubmit(addPurchase)}>
                        <div className="grid gap-3 md:grid-cols-2">
                            <FormItem
                                asterisk
                                label="Date"
                                invalid={Boolean(errors.date)}
                                errorMessage={errors.date?.message as string}
                            >
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            placeholder="Purchase date"
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Category"
                                invalid={Boolean(errors.category)}
                                errorMessage={errors.category?.message}
                            >
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            classNamePrefix="select"
                                            options={categoryOptions}
                                            value={categoryOptions.find(
                                                (option) => option.value === field.value,
                                            )}
                                            onChange={(option) =>
                                                field.onChange((option as SelectOption).value)
                                            }
                                            placeholder="Select category"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <FormItem
                                asterisk
                                label="Vendor"
                                invalid={Boolean(errors.vendor)}
                                errorMessage={errors.vendor?.message}
                            >
                                <Controller
                                    name="vendor"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            autoComplete="off"
                                            placeholder="Vendor name"
                                            prefix={<PiNotebookDuotone />}
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Amount"
                                invalid={Boolean(errors.amount)}
                                errorMessage={errors.amount?.message as string}
                            >
                                <Controller
                                    name="amount"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            prefix={<PiTagDuotone />}
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <FormItem
                            asterisk
                            label="Purpose / remarks"
                            invalid={Boolean(errors.purpose)}
                            errorMessage={errors.purpose?.message}
                        >
                            <Controller
                                name="purpose"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        textArea
                                        rows={3}
                                        placeholder="Why this purchase is needed"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Link to Task/KRA (optional)">
                            <Controller
                                name="link"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        autoComplete="off"
                                        placeholder="Task or KRA reference"
                                        prefix={<PiChartLineDuotone />}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <div className="space-y-2">
                            <Upload
                                multiple
                                showList
                                onChange={(files) => setHodFiles(files)}
                                uploadLimit={5}
                            >
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <PiCloudArrowUpDuotone />
                                    Upload bills (multi files, image/PDF)
                                </div>
                            </Upload>
                        </div>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                            icon={<PiPlusCircleDuotone />}
                        >
                            Submit
                        </Button>
                    </Form>
                </Card>

                <Card
                    header={{ content: 'Purchase history (HOD)', bordered: false }}
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Category
                            </div>
                            <Select
                                classNamePrefix="select"
                                isClearable
                                placeholder="All"
                                options={categoryOptions}
                                value={hodCategory}
                                onChange={(option) => setHodCategory(option as SelectOption)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Date range
                            </div>
                            <DatePicker.DatePickerRange
                                value={hodDateRange}
                                onChange={(range) => setHodDateRange(range)}
                            />
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        {filteredHodPurchases.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                No purchases match the filters.
                            </div>
                        ) : (
                            filteredHodPurchases.map((purchase) => (
                                <div
                                    key={purchase.id}
                                    className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900 dark:text-gray-50">
                                                    {purchase.vendor}
                                                </p>
                                                <Tag className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100">
                                                    {purchase.category}
                                                </Tag>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {purchase.purpose}
                                            </p>
                                            {purchase.link && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {purchase.link}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>
                                                    {dayjs(purchase.date).format('MMM D, YYYY')}
                                                </span>
                                                <span>•</span>
                                                <span className="font-semibold text-gray-900 dark:text-gray-50">
                                                    {formatCurrency(purchase.amount)}
                                                </span>
                                            </div>
                                        </div>
                                        <Tag
                                            prefix
                                            className="bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950 dark:text-blue-100"
                                        >
                                            <PiCalendarDotsDuotone />
                                            Logged
                                        </Tag>
                                    </div>
                                    {purchase.attachments.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                                            {purchase.attachments.map((file) => (
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

            <Card
                header={{ content: 'Owner review', bordered: false }}
                className="border border-gray-100 dark:border-gray-800 shadow-sm"
            >
                <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/60">
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                <PiFunnelSimpleDuotone />
                                Filters: dept, date range, amount, category, vendor
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                            {renderFilterSelect(
                                'Department',
                                ownerFilters.dept,
                                deptOptions,
                                (value) =>
                                    setOwnerFilters((prev) => ({ ...prev, dept: value })),
                            )}
                            {renderFilterSelect(
                                'Category',
                                ownerFilters.category,
                                categoryOptions,
                                (value) =>
                                    setOwnerFilters((prev) => ({ ...prev, category: value })),
                            )}
                            {renderFilterSelect(
                                'Vendor',
                                ownerFilters.vendor,
                                vendorOptions,
                                (value) =>
                                    setOwnerFilters((prev) => ({ ...prev, vendor: value })),
                            )}
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="space-y-1">
                                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Date range
                                </div>
                                <DatePicker.DatePickerRange
                                    value={ownerFilters.dateRange}
                                    onChange={(range) =>
                                        setOwnerFilters((prev) => ({ ...prev, dateRange: range }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Min amount
                                </div>
                                <Input
                                    type="number"
                                    value={ownerFilters.minAmount}
                                    onChange={(e) =>
                                        setOwnerFilters((prev) => ({
                                            ...prev,
                                            minAmount: e.target.value,
                                        }))
                                    }
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Max amount
                                </div>
                                <Input
                                    type="number"
                                    value={ownerFilters.maxAmount}
                                    onChange={(e) =>
                                        setOwnerFilters((prev) => ({
                                            ...prev,
                                            maxAmount: e.target.value,
                                        }))
                                    }
                                    placeholder="Any"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                    Results
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {filteredOwnerReviews.length} submission(s)
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 dark:text-gray-400">
                                            <th className="py-2 pr-3">Dept</th>
                                            <th className="py-2 pr-3">HOD</th>
                                            <th className="py-2 pr-3">Amount</th>
                                            <th className="py-2 pr-3">Category</th>
                                            <th className="py-2 pr-3">Date</th>
                                            <th className="py-2 pr-3">Submitted at</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {filteredOwnerReviews.map((row) => (
                                            <tr
                                                key={row.id}
                                                className={classNames(
                                                    'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/70',
                                                    selectedReviewId === row.id &&
                                                        'bg-primary/5 dark:bg-primary/10',
                                                )}
                                                onClick={() => setSelectedReviewId(row.id)}
                                            >
                                                <td className="py-3 pr-3 font-semibold text-gray-900 dark:text-gray-50">
                                                    {row.dept}
                                                </td>
                                                <td className="py-3 pr-3 text-gray-700 dark:text-gray-200">
                                                    {row.hod}
                                                </td>
                                                <td className="py-3 pr-3 font-semibold text-gray-900 dark:text-gray-50">
                                                    {formatCurrency(row.amount)}
                                                </td>
                                                <td className="py-3 pr-3 text-gray-700 dark:text-gray-200">
                                                    {row.category}
                                                </td>
                                                <td className="py-3 pr-3 text-gray-600 dark:text-gray-300">
                                                    {dayjs(row.date).format('MMM D')}
                                                </td>
                                                <td className="py-3 pr-3 text-gray-600 dark:text-gray-300">
                                                    {dayjs(row.submittedAt).format('MMM D, h:mm A')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Card
                            bordered
                            header={{
                                content: 'Detail',
                                bordered: false,
                            }}
                        >
                            {selectedReview ? (
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                {selectedReview.dept} • {selectedReview.hod}
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                                {selectedReview.vendor} — {selectedReview.category}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {dayjs(selectedReview.date).format('MMM D, YYYY')} |
                                                Submitted at {dayjs(selectedReview.submittedAt).format('h:mm A')}
                                            </p>
                                        </div>
                                        <Tag className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100">
                                            {selectedReview.status || 'Pending'}
                                        </Tag>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                        <PiMagnifyingGlassDuotone />
                                        Bills preview (PDF viewer + image gallery)
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {selectedReview.attachments.map((file) =>
                                            file.type === 'image' ? (
                                                <div
                                                    key={file.name}
                                                    className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                                                >
                                                    <img
                                                        src={file.preview || imagePlaceholder}
                                                        alt={file.name}
                                                        className="h-36 w-full rounded-md object-cover"
                                                    />
                                                    <div className="mt-2 flex items-center justify-between text-xs text-gray-700 dark:text-gray-200">
                                                        <span>{file.name}</span>
                                                        <Button
                                                            size="xs"
                                                            variant="plain"
                                                            icon={<PiDownloadSimpleDuotone />}
                                                        >
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    key={file.name}
                                                    className="flex flex-col justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-800/60"
                                                >
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                                                            {file.name}
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            PDF viewer placeholder
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <Tag className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100">
                                                            PDF
                                                        </Tag>
                                                        <Button
                                                            size="xs"
                                                            variant="plain"
                                                            icon={<PiDownloadSimpleDuotone />}
                                                        >
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Tag className="bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-100">
                                            {formatCurrency(selectedReview.amount)}
                                        </Tag>
                                        <Tag className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-100">
                                            Dept: {selectedReview.dept}
                                        </Tag>
                                        <Tag className="bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-100">
                                            HOD: {selectedReview.hod}
                                        </Tag>
                                    </div>
                                    {selectedReview.notes && (
                                        <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100">
                                            {selectedReview.notes}
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant="solid" icon={<PiReceiptDuotone />}>
                                            Download attachments
                                        </Button>
                                        <Button size="sm" variant="plain" icon={<PiNotebookDuotone />}>
                                            Mark Reviewed
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Select a submission to view details.
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default PurchasesBoard
