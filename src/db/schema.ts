import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const roles = sqliteTable(
  "roles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    permissionsJson: text("permissions_json"),
    level: integer("level").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(1),
    ...timestamps,
  },
  (table) => [uniqueIndex("roles_code_uq").on(table.code)]
);

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    roleId: integer("role_id").notNull().references(() => roles.id),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    passwordHash: text("password_hash").notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    lastLoginAt: text("last_login_at"),
    timezone: text("timezone").notNull().default("America/Santiago"),
    locale: text("locale").notNull().default("es-CL"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_email_uq").on(table.email),
    index("users_role_active_idx").on(table.roleId, table.isActive),
  ]
);

export const clients = sqliteTable(
  "clients",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    legalName: text("legal_name").notNull(),
    tradeName: text("trade_name").notNull(),
    rut: text("rut").notNull(),
    giro: text("giro"),
    address: text("address"),
    city: text("city").notNull().default("Temuco"),
    region: text("region").notNull().default("Araucanía"),
    country: text("country").notNull().default("CL"),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    paymentTermsDays: integer("payment_terms_days").notNull().default(30),
    isRetainer: integer("is_retainer", { mode: "boolean" }).notNull().default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("clients_rut_uq").on(table.rut),
    index("clients_trade_name_idx").on(table.tradeName),
    index("clients_active_idx").on(table.isActive),
  ]
);

export const clientContacts = sqliteTable(
  "client_contacts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    clientId: integer("client_id")
      .notNull()
      .references(() => clients.id),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    role: text("role"),
    isMain: integer("is_main", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (table) => [index("client_contacts_client_idx").on(table.clientId)]
);


export const leads = sqliteTable(
  "leads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    clientName: text("client_name").notNull(),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    source: text("source").notNull().default("web"),
    serviceInterest: text("service_interest").notNull(),
    estimatedBudgetClp: real("estimated_budget_clp").notNull().default(0),
    status: text("status").notNull().default("new"),
    ownerUserId: integer("owner_user_id").references(() => users.id),
    expectedCloseDate: text("expected_close_date"),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [
    index("leads_status_owner_idx").on(table.status, table.ownerUserId),
    index("leads_expected_close_idx").on(table.expectedCloseDate),
  ]
);

export const quotes = sqliteTable(
  "quotes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    quoteNumber: text("quote_number").notNull(),
    clientId: integer("client_id").notNull().references(() => clients.id),
    leadId: integer("lead_id").references(() => leads.id),
    issueDate: text("issue_date").notNull(),
    validUntil: text("valid_until").notNull(),
    currencyCode: text("currency_code").notNull().default("CLP"),
    subtotalClp: real("subtotal_clp").notNull().default(0),
    discountClp: real("discount_clp").notNull().default(0),
    taxClp: real("tax_clp").notNull().default(0),
    totalClp: real("total_clp").notNull().default(0),
    status: text("status").notNull().default("draft"),
    salesUserId: integer("sales_user_id").references(() => users.id),
    termsText: text("terms_text"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("quotes_number_uq").on(table.quoteNumber),
    index("quotes_client_status_idx").on(table.clientId, table.status),
  ]
);

export const quoteItems = sqliteTable(
  "quote_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    quoteId: integer("quote_id").notNull().references(() => quotes.id),
    lineNo: integer("line_no").notNull().default(1),
    itemType: text("item_type").notNull().default("service"),
    serviceCategory: text("service_category").notNull(),
    description: text("description").notNull(),
    qty: real("qty").notNull().default(1),
    unit: text("unit").notNull().default("unit"),
    unitPriceClp: real("unit_price_clp").notNull().default(0),
    hoursEstimated: real("hours_estimated").notNull().default(0),
    materialEstimatedCostClp: real("material_estimated_cost_clp").notNull().default(0),
    setupCostClp: real("setup_cost_clp").notNull().default(0),
    lineTotalClp: real("line_total_clp").notNull().default(0),
    specsJson: text("specs_json"),
    dueDate: text("due_date"),
  },
  (table) => [index("quote_items_quote_line_idx").on(table.quoteId, table.lineNo)]
);

export const projects = sqliteTable(
  "projects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectCode: text("project_code").notNull(),
    clientId: integer("client_id").notNull().references(() => clients.id),
    quoteId: integer("quote_id").references(() => quotes.id),
    name: text("name").notNull(),
    serviceType: text("service_type").notNull(),
    startDate: text("start_date"),
    dueDate: text("due_date"),
    status: text("status").notNull().default("planning"),
    priority: text("priority").notNull().default("normal"),
    projectManagerId: integer("project_manager_id").references(() => users.id),
    budgetRevenueClp: real("budget_revenue_clp").notNull().default(0),
    budgetCostClp: real("budget_cost_clp").notNull().default(0),
    expectedMarginPct: real("expected_margin_pct").notNull().default(0),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("projects_code_uq").on(table.projectCode),
    index("projects_status_due_idx").on(table.status, table.dueDate),
  ]
);

export const projectBriefs = sqliteTable(
  "project_briefs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().references(() => projects.id),
    objective: text("objective"),
    targetAudience: text("target_audience"),
    brandGuidelines: text("brand_guidelines"),
    dimensionsSpecs: text("dimensions_specs"),
    printSpecs: text("print_specs"),
    finishingSpecs: text("finishing_specs"),
    colorProfile: text("color_profile"),
    deliveryRequirements: text("delivery_requirements"),
    approvalNotes: text("approval_notes"),
    approvedByClientAt: text("approved_by_client_at"),
    createdByUserId: integer("created_by_user_id").references(() => users.id),
    technicalSheetJson: text("technical_sheet_json"),
    ...timestamps,
  },
  (table) => [uniqueIndex("project_briefs_project_uq").on(table.projectId)]
);

export const projectPhases = sqliteTable(
  "project_phases",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().references(() => projects.id),
    phaseName: text("phase_name").notNull(),
    phaseOrder: integer("phase_order").notNull().default(1),
    plannedStart: text("planned_start"),
    plannedEnd: text("planned_end"),
    actualStart: text("actual_start"),
    actualEnd: text("actual_end"),
    status: text("status").notNull().default("pending"),
    progressPct: integer("progress_pct").notNull().default(0),
    ownerUserId: integer("owner_user_id").references(() => users.id),
    plannedHours: real("planned_hours").notNull().default(0),
    actualHours: real("actual_hours").notNull().default(0),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [
    index("project_phases_project_order_idx").on(table.projectId, table.phaseOrder),
    index("project_phases_status_idx").on(table.status),
  ]
);

export const tasks = sqliteTable(
  "tasks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().references(() => projects.id),
    phaseId: integer("phase_id").references(() => projectPhases.id),
    title: text("title").notNull(),
    description: text("description"),
    assigneeUserId: integer("assignee_user_id").references(() => users.id),
    taskType: text("task_type").notNull().default("design"),
    status: text("status").notNull().default("todo"),
    priority: text("priority").notNull().default("normal"),
    estimatedHours: real("estimated_hours").notNull().default(0),
    actualHours: real("actual_hours").notNull().default(0),
    startAt: text("start_at"),
    dueAt: text("due_at"),
    completedAt: text("completed_at"),
    ...timestamps,
  },
  (table) => [
    index("tasks_assignee_status_idx").on(table.assigneeUserId, table.status),
    index("tasks_project_phase_idx").on(table.projectId, table.phaseId),
  ]
);

export const timesheets = sqliteTable(
  "timesheets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    projectId: integer("project_id").notNull().references(() => projects.id),
    taskId: integer("task_id").references(() => tasks.id),
    workDate: text("work_date").notNull(),
    hours: real("hours").notNull().default(0),
    hourlyCostClp: real("hourly_cost_clp").notNull().default(0),
    overtimeHours: real("overtime_hours").notNull().default(0),
    overtimeRateClp: real("overtime_rate_clp").notNull().default(0),
    totalCostClp: real("total_cost_clp").notNull().default(0),
    billable: integer("billable", { mode: "boolean" }).notNull().default(true),
    notes: text("notes"),
    approvedByUserId: integer("approved_by_user_id").references(() => users.id),
    ...timestamps,
  },
  (table) => [
    index("timesheets_project_workdate_idx").on(table.projectId, table.workDate),
    index("timesheets_user_workdate_idx").on(table.userId, table.workDate),
  ]
);

export const suppliers = sqliteTable(
  "suppliers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    legalName: text("legal_name").notNull(),
    tradeName: text("trade_name").notNull(),
    rut: text("rut").notNull(),
    country: text("country").notNull().default("CL"),
    city: text("city").notNull().default("Temuco"),
    address: text("address"),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    leadTimeDays: integer("lead_time_days").notNull().default(5),
    paymentTermsDays: integer("payment_terms_days").notNull().default(30),
    currencyPreference: text("currency_preference").notNull().default("CLP"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("suppliers_rut_uq").on(table.rut),
    index("suppliers_active_idx").on(table.isActive),
  ]
);

export const materials = sqliteTable(
  "materials",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    sku: text("sku").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    baseUnit: text("base_unit").notNull().default("unit"),
    brand: text("brand"),
    model: text("model"),
    color: text("color"),
    widthMm: real("width_mm"),
    grammageGsm: real("grammage_gsm"),
    durabilityLevel: text("durability_level"),
    defaultWastePct: real("default_waste_pct").notNull().default(5),
    reorderPoint: real("reorder_point").notNull().default(0),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("materials_sku_uq").on(table.sku),
    index("materials_category_name_idx").on(table.category, table.name),
  ]
);

export const materialVariants = sqliteTable(
  "material_variants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    materialId: integer("material_id").notNull().references(() => materials.id),
    variantCode: text("variant_code").notNull(),
    sizeLabel: text("size_label"),
    thicknessMicrons: real("thickness_microns"),
    finishType: text("finish_type"),
    rollLengthMl: real("roll_length_ml"),
    sheetWidthMm: real("sheet_width_mm"),
    sheetHeightMm: real("sheet_height_mm"),
    packQty: real("pack_qty"),
    unitConversionFactor: real("unit_conversion_factor").notNull().default(1),
    barcode: text("barcode"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex("material_variants_uq").on(table.materialId, table.variantCode)]
);

export const supplierMaterialPrices = sqliteTable(
  "supplier_material_prices",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
    materialId: integer("material_id").notNull().references(() => materials.id),
    variantId: integer("variant_id").references(() => materialVariants.id),
    priceClp: real("price_clp").notNull().default(0),
    priceUnit: text("price_unit").notNull().default("unit"),
    minOrderQty: real("min_order_qty").notNull().default(1),
    leadTimeDays: integer("lead_time_days").notNull().default(5),
    validFrom: text("valid_from").notNull(),
    validTo: text("valid_to"),
    incoterm: text("incoterm"),
    freightClp: real("freight_clp").notNull().default(0),
    isCurrent: integer("is_current", { mode: "boolean" }).notNull().default(true),
    sourceDocRef: text("source_doc_ref"),
    ...timestamps,
  },
  (table) => [
    index("supplier_material_prices_material_current_idx").on(table.materialId, table.isCurrent),
    index("supplier_material_prices_supplier_valid_idx").on(table.supplierId, table.validFrom),
  ]
);

export const inventoryTransactions = sqliteTable(
  "inventory_transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    materialId: integer("material_id").notNull().references(() => materials.id),
    variantId: integer("variant_id").references(() => materialVariants.id),
    warehouse: text("warehouse").notNull().default("principal"),
    txnType: text("txn_type").notNull(),
    referenceType: text("reference_type").notNull(),
    referenceId: integer("reference_id"),
    qtyIn: real("qty_in").notNull().default(0),
    qtyOut: real("qty_out").notNull().default(0),
    unitCostClp: real("unit_cost_clp").notNull().default(0),
    totalCostClp: real("total_cost_clp").notNull().default(0),
    stockAfter: real("stock_after").notNull().default(0),
    txnDate: text("txn_date").notNull(),
    batchLot: text("batch_lot"),
    createdByUserId: integer("created_by_user_id").references(() => users.id),
  },
  (table) => [
    index("inventory_transactions_material_date_idx").on(table.materialId, table.txnDate),
    index("inventory_transactions_reference_idx").on(table.referenceType, table.referenceId),
  ]
);

export const purchaseOrders = sqliteTable(
  "purchase_orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    poNumber: text("po_number").notNull(),
    supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
    requesterUserId: integer("requester_user_id").references(() => users.id),
    issueDate: text("issue_date").notNull(),
    expectedDate: text("expected_date"),
    status: text("status").notNull().default("draft"),
    subtotalClp: real("subtotal_clp").notNull().default(0),
    discountClp: real("discount_clp").notNull().default(0),
    taxClp: real("tax_clp").notNull().default(0),
    shippingClp: real("shipping_clp").notNull().default(0),
    totalClp: real("total_clp").notNull().default(0),
    paymentTermsDays: integer("payment_terms_days").notNull().default(30),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("purchase_orders_number_uq").on(table.poNumber),
    index("purchase_orders_supplier_status_idx").on(table.supplierId, table.status),
  ]
);

export const purchaseOrderItems = sqliteTable(
  "purchase_order_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    purchaseOrderId: integer("purchase_order_id").notNull().references(() => purchaseOrders.id),
    lineNo: integer("line_no").notNull().default(1),
    materialId: integer("material_id").notNull().references(() => materials.id),
    variantId: integer("variant_id").references(() => materialVariants.id),
    description: text("description"),
    qty: real("qty").notNull().default(0),
    unit: text("unit").notNull().default("unit"),
    unitPriceClp: real("unit_price_clp").notNull().default(0),
    lineDiscountClp: real("line_discount_clp").notNull().default(0),
    lineTaxClp: real("line_tax_clp").notNull().default(0),
    lineTotalClp: real("line_total_clp").notNull().default(0),
    expectedDate: text("expected_date"),
    receivedQty: real("received_qty").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("purchase_order_items_order_line_idx").on(table.purchaseOrderId, table.lineNo)]
);

export const materialConsumptions = sqliteTable(
  "material_consumptions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").notNull().references(() => projects.id),
    taskId: integer("task_id").references(() => tasks.id),
    materialId: integer("material_id").notNull().references(() => materials.id),
    variantId: integer("variant_id").references(() => materialVariants.id),
    qtyPlanned: real("qty_planned").notNull().default(0),
    qtyUsed: real("qty_used").notNull().default(0),
    wasteQty: real("waste_qty").notNull().default(0),
    wastePct: real("waste_pct").notNull().default(0),
    unitCostClp: real("unit_cost_clp").notNull().default(0),
    totalCostClp: real("total_cost_clp").notNull().default(0),
    consumptionDate: text("consumption_date").notNull(),
    operatorUserId: integer("operator_user_id").references(() => users.id),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [
    index("material_consumptions_project_date_idx").on(table.projectId, table.consumptionDate),
    index("material_consumptions_task_idx").on(table.taskId),
  ]
);

export const invoices = sqliteTable(
  "invoices",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    invoiceNumber: text("invoice_number").notNull(),
    siiFolio: text("sii_folio"),
    clientId: integer("client_id").notNull().references(() => clients.id),
    projectId: integer("project_id").references(() => projects.id),
    quoteId: integer("quote_id").references(() => quotes.id),
    issueDate: text("issue_date").notNull(),
    dueDate: text("due_date"),
    currencyCode: text("currency_code").notNull().default("CLP"),
    subtotalClp: real("subtotal_clp").notNull().default(0),
    taxClp: real("tax_clp").notNull().default(0),
    totalClp: real("total_clp").notNull().default(0),
    status: text("status").notNull().default("issued"),
    pdfUrl: text("pdf_url"),
    createdByUserId: integer("created_by_user_id").references(() => users.id),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("invoices_number_uq").on(table.invoiceNumber),
    index("invoices_client_status_due_idx").on(table.clientId, table.status, table.dueDate),
  ]
);

export const payments = sqliteTable(
  "payments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    invoiceId: integer("invoice_id").notNull().references(() => invoices.id),
    paymentDate: text("payment_date").notNull(),
    amountClp: real("amount_clp").notNull().default(0),
    method: text("method").notNull().default("transfer"),
    bankReference: text("bank_reference"),
    status: text("status").notNull().default("confirmed"),
    exchangeRate: real("exchange_rate").notNull().default(1),
    feesClp: real("fees_clp").notNull().default(0),
    collectedByUserId: integer("collected_by_user_id").references(() => users.id),
    notes: text("notes"),
    receiptUrl: text("receipt_url"),
    ...timestamps,
  },
  (table) => [
    index("payments_invoice_date_idx").on(table.invoiceId, table.paymentDate),
    index("payments_status_idx").on(table.status),
  ]
);

export const attachments = sqliteTable(
  "attachments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    entityType: text("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    docType: text("doc_type").notNull(),
    fileName: text("file_name").notNull(),
    blobUrl: text("blob_url").notNull(),
    mimeType: text("mime_type").notNull(),
    fileSizeKb: integer("file_size_kb").notNull().default(0),
    uploadedByUserId: integer("uploaded_by_user_id").references(() => users.id),
    uploadedAt: text("uploaded_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    checksum: text("checksum"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    tagsJson: text("tags_json"),
    notes: text("notes"),
    expiresAt: text("expires_at"),
  },
  (table) => [
    index("attachments_entity_idx").on(table.entityType, table.entityId),
    index("attachments_doc_uploaded_idx").on(table.docType, table.uploadedAt),
  ]
);

export const activityLog = sqliteTable(
  "activity_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    action: text("action").notNull(), // 'create', 'update', 'delete', 'view', 'export'
    entityType: text("entity_type").notNull(), // 'quote', 'project', 'invoice', 'purchase_order', etc
    entityId: integer("entity_id"),
    entityName: text("entity_name"), // quoteNumber, projectCode, invoiceNumber, etc
    oldValue: text("old_value"), // JSON stringified old value
    newValue: text("new_value"), // JSON stringified new value
    changes: text("changes"), // JSON array of changed fields
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: text("metadata"), // JSON additional context
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("activity_log_user_created_idx").on(table.userId, table.createdAt),
    index("activity_log_entity_idx").on(table.entityType, table.entityId),
    index("activity_log_action_idx").on(table.action),
  ]
);

export const userPreferences = sqliteTable(
  "user_preferences",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().unique().references(() => users.id),
    themeDarkMode: integer("theme_dark_mode", { mode: "boolean" }).notNull().default(false),
    themeHighContrast: integer("theme_high_contrast", { mode: "boolean" }).notNull().default(false),
    notifyInventoryAlerts: integer("notify_inventory_alerts", { mode: "boolean" }).notNull().default(true),
    notifySalesAlerts: integer("notify_sales_alerts", { mode: "boolean" }).notNull().default(true),
    notifyDailySummary: integer("notify_daily_summary", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("user_preferences_user_id_uq").on(table.userId),
  ]
);

export const loginSessions = sqliteTable(
  "login_sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    device: text("device"), // 'mobile', 'desktop', 'tablet'
    browser: text("browser"),
    os: text("os"),
    city: text("city"),
    country: text("country"),
    loginAt: text("login_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    lastActivityAt: text("last_activity_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  },
  (table) => [
    index("login_sessions_user_idx").on(table.userId),
    index("login_sessions_active_idx").on(table.isActive, table.lastActivityAt),
  ]
);

export const companySettings = sqliteTable(
  "company_settings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    key: text("key").notNull().unique(),
    value: text("value").notNull(),
    description: text("description"),
    isEditable: integer("is_editable", { mode: "boolean" }).notNull().default(false),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("company_settings_key_uq").on(table.key),
  ]
);

export const workOrders = sqliteTable(
  "work_orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    orderNumber: text("order_number").notNull(),
    projectId: integer("project_id").notNull().references(() => projects.id),
    description: text("description").notNull(),
    operatorId: integer("operator_id").references(() => users.id),
    status: text("status").notNull().default("pending"),
    dueDate: text("due_date"),
    technicalSpecsJson: text("technical_specs_json"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("work_orders_number_uq").on(table.orderNumber),
    index("work_orders_project_idx").on(table.projectId),
    index("work_orders_operator_idx").on(table.operatorId),
  ]
);

export const extraExpenses = sqliteTable(
  "extra_expenses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").references(() => projects.id),
    userId: integer("user_id").notNull().references(() => users.id),
    amountClp: real("amount_clp").notNull().default(0),
    category: text("category").notNull(), // 'Peaje', 'Comida', 'Bencina', 'Otros'
    description: text("description").notNull(),
    expenseDate: text("expense_date").notNull(),
    status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
    receiptUrl: text("receipt_url"),
    ...timestamps,
  },
  (table) => [
    index("extra_expenses_project_idx").on(table.projectId),
    index("extra_expenses_user_date_idx").on(table.userId, table.expenseDate),
    index("extra_expenses_status_idx").on(table.status),
  ]
);

