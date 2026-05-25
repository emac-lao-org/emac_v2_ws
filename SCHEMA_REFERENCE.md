# EMAC System — Database Schema Reference
> Auto-generated from `postgres_backup.sql` + Hasura metadata (backup-26-08-2025)
> Schema name: `emac`  |  Backend: PostgreSQL + Hasura GraphQL Engine

---

## System Overview

EMAC (Environmental Management and Control) is a Lao waste-management platform.
It tracks the full lifecycle of hazardous waste from a **Generator (WG)** through
a **Transporter (WT)** to a **Disposal facility (WD)**, supervised by a
**Regulator (WR)**.

### User Roles
| Role | Description | User table |
|------|-------------|------------|
| `generator` | Waste-producing business | `emac.wg_users` → `emac.generators` |
| `transporter` | Waste-transport company | `emac.wt_users` → `emac.transporters` |
| `disposal` | Waste-disposal facility | `emac.wd_users` → `emac.disposals` |
| `regulator` | Regulatory authority | `emac.wr_users` → `emac.regulators` |
| `staff` | System admin / staff | `emac.users` |
| `guest` | Public read-only | — |

---

## Core Entity Tables

### emac.generators
Waste-producing businesses registered in the system.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `gen_name` | text | Business name |
| `gen_name_lo` | text | Lao name |
| `email` | text | |
| `tel` | text | |
| `emac_id` | text | Unique EMAC registration ID |
| `enterprise_no` | text | |
| `objectives` | text | |
| `custom_address` | text | |
| `vill_id` | integer → `emac.villages` | |
| `latlng` | text | "lat, lng" string |
| `industry_type_id` | uuid → `emac.industry_types` | |
| `level_id` | uuid → `emac.levels` | |
| `status` | integer | 0=inactive, 1=active |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Relationships:** `wg_users`, `catalogs`, `storages`, `catalog_operations` (via catalogs)

---

### emac.transporters
Waste-transport companies.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `tran_name` | text | |
| `tran_name_lo` | text | |
| `email` | text | |
| `tel` | text | |
| `emac_id` | text | |
| `enterprise_no` | text | |
| `custom_address` | text | |
| `vill_id` | integer → `emac.villages` | |
| `latlng` | text | |
| `level` | uuid → `emac.levels` | |
| `status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Relationships:** `wt_users`, `vehicles`, `drivers`, `type_operations`, `transporter_operations`, `catalog_wt_operations`

---

### emac.disposals
Waste-disposal (treatment) facilities.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `dis_name` | text | |
| `dis_name_lo` | text | |
| `email` | text | |
| `tel` | text | |
| `emac_id` | text | |
| `license_no` | text | |
| `enterprise_no` | text | |
| `custom_address` | text | |
| `vill_id` | integer → `emac.villages` | |
| `latlng` | text | |
| `level` | uuid → `emac.levels` | |
| `status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Relationships:** `wd_users`, `disposal_facilities`, `disposal_type_operations`, `catalog_wd_operations`, `manifests` (as disposal_id)

---

### emac.regulators
Regulatory/government authorities.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `regulator_name` | text | |
| `regulator_name_lo` | text | |
| `email` | text | |
| `tel` | text | |
| `emac_id` | text | |
| `enterprise_no` | text | |
| `custom_address` | text | |
| `vill_id` | integer → `emac.villages` | |
| `latlng` | text | |
| `level_opt_id` | uuid → `emac.level_operations` | |
| `status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Relationships:** `wr_users`

---

## Authentication / User Tables

### emac.users (staff)
| Column | Type | Notes |
|--------|------|-------|
| `id` | text PK | Firebase UID |
| `email` | text | |
| `name` | text | |
| `tel` | text | |
| `emc_id` | text | |
| `verification_status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.wg_users (generator users)
| Column | Type | Notes |
|--------|------|-------|
| `id` | text PK | Firebase UID |
| `name` | text | |
| `email` | text | |
| `tel` | text | |
| `generator_id` | uuid → `emac.generators` | |
| `verification_status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.wt_users (transporter users)
| Column | Type | Notes |
|--------|------|-------|
| `id` | text PK | Firebase UID |
| `name` | text | |
| `email` | text | |
| `tel` | text | |
| `transporter_id` | uuid → `emac.transporters` | |
| `verification_status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.wd_users (disposal users)
| Column | Type | Notes |
|--------|------|-------|
| `id` | text PK | Firebase UID |
| `name` | text | |
| `email` | text | |
| `tel` | text | |
| `disposal_id` | uuid → `emac.disposals` | |
| `verification_status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.wr_users (regulator users)
| Column | Type | Notes |
|--------|------|-------|
| `id` | text PK | Firebase UID |
| `name` | text | |
| `email` | text | |
| `tel` | text | |
| `address` | text | |
| `regulator_id` | uuid → `emac.regulators` | |
| `verification_status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## Manifest (Waste Shipment) Flow

### emac.manifests  ⭐ Central Table
The waste-movement document linking generator → transporter → disposal.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `manifest_no` | text | Human-readable document number |
| `manifest_date` | date | |
| `expected_relocate_date` | date | Planned pickup date |
| `relocate_date` | date | Actual pickup date |
| `security_seal` | text | |
| `note` | text | |
| `message` | text | |
| `reference_number` | text | |
| `gen_id` | uuid → `emac.generators` | Who created the manifest |
| `disposal_id` | uuid → `emac.disposals` | Assigned disposal facility |
| `type_id` | uuid → `emac.type_of_services` | Waste service type |
| `status` | integer | Overall status |
| `wg_stt` | integer | Generator approval status |
| `wt_stt` | integer | Transporter status |
| `wd_stt` | integer | Disposal status |
| `wr_stt` | integer | Regulator status |
| `wg_user` | text | Generator user who acted |
| `wd_user` | text | Disposal user who acted |
| `wr_user` | text | Regulator user who acted |
| `ws_user` | text | Staff user who acted |
| `created_at` | timestamptz | |
| `updated_at` | date | |

**Array relationships:** `waste_operations`, `transporter_operations`, `entry_logs`, `qr_codes`, `transactions`

**Event Trigger:** `update_catalog_amount` fires on `wd_stt` update

---

### emac.waste_operations
Individual waste line items on a manifest.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `manifest_id` | uuid → `emac.manifests` | |
| `cat_opt_id` | uuid → `emac.catalog_operations` | Waste catalog entry |
| `element_id` | uuid → `emac.elements` | Chemical element |
| `unit` | text | Unit of measurement |
| `quantity` | numeric | |
| `description` | text | |
| `weight_generator` | numeric | Weight confirmed by generator |
| `weight_disposal` | numeric | Weight confirmed by disposal |
| `disposal_assign_date` | date | |
| `created_at` | timestamptz | |
| `updated_at` | date | |

---

### emac.transporter_operations
Transporter assignment for a manifest.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `manifest_id` | uuid → `emac.manifests` | |
| `transporter_id` | uuid → `emac.transporters` | |
| `driver_id` | uuid → `emac.drivers` | |
| `veh_id` | uuid → `emac.vehicles` | |
| `transport_order` | text | |
| `instruction` | text | |
| `pickup_description` | text | |
| `wt_status` | integer | 0=pending, 1=accepted, etc. |
| `wt_user` | text | WT user who acted |
| `user_name` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### emac.qr_codes
QR code timestamps linked to a manifest.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `manifest_id` | uuid → `emac.manifests` | |
| `note` | text | |
| `wr_date` | timestamp | Regulator scan date |
| `wt_date` | timestamp | Transporter scan date |
| `wd_date` | timestamp | Disposal scan date |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### emac.entry_logs
Audit log for manifest changes.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `manifest_id` | uuid → `emac.manifests` | |
| `name` | text | User who made change |
| `log_date` | timestamp | |
| `description` | text | What changed |
| `old_metadata` | text | |
| `new_metadata` | text | |
| `updated_at` | timestamptz | |

---

## Catalog (Waste License) System

### emac.catalogs
Waste license/permit for a generator.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `catalog_no` | text | License number |
| `name` | text | |
| `description` | text | |
| `gen_id` | uuid → `emac.generators` | |
| `type_id` | uuid → `emac.type_of_services` | |
| `expire_date` | timestamp | |
| `status` | integer | |
| `old_metadata` | text | |
| `new_metadata` | text | |
| `created_at` | date | |
| `updated_at` | timestamptz | |

**Array relationships:** `catalog_operations`, `catalog_wt_operations`, `catalog_wd_operations`

---

### emac.catalog_operations
Individual waste-type entries within a catalog (license line items).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `cat_id` | uuid → `emac.catalogs` | Parent catalog |
| `waste_cat_id` | uuid → `emac.waste_categories` | Waste classification |
| `cat_name` | text | |
| `cat_date` | date | |
| `expire_date` | date | |
| `custom_description` | text | |
| `penalize_stt` | text | |
| `quota_amount` | numeric | Total allowed quantity |
| `remaining_amount` | numeric | Remaining quota |
| `summary_amount` | numeric | Used amount |
| `status` | integer | |
| `created_at` | date | |
| `updated_at` | timestamptz | |

**Array relationships:** `waste_operations`, `extension_operations`, `quota_operations`, `expire_logs`, `catalog_logs`, `r_d_code_operations`

---

### emac.catalog_wt_operations
Links a catalog to authorized transporters.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `catalog_id` | uuid → `emac.catalogs` | |
| `transporter_id` | uuid → `emac.transporters` | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### emac.catalog_wd_operations
Links a catalog to authorized disposal facilities.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `catalog_id` | uuid → `emac.catalogs` | |
| `disposal_id` | uuid → `emac.disposals` | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### emac.catalog_logs
Activity log for catalog operations.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `cat_opt_id` | uuid → `emac.catalog_operations` | |
| `log_name` | text | |
| `description` | text | |
| `log_date` | timestamp | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## Waste Classification Tables

### emac.waste_categories
Hierarchical waste classification (UN hazardous waste codes).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `code` | text | Waste code (e.g. H01, D001) |
| `entry_type` | text | Level of classification |
| `description_2` | text | Level-2 description (English) |
| `description_2_lo` | text | Lao |
| `description_4` | text | Level-4 description (English) |
| `description_4_lo` | text | Lao |
| `description_6` | text | Level-6 description (English) |
| `description_6_lo` | text | Lao |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### emac.r_d_code
R/D (Recovery/Disposal) treatment codes.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `code` | text | e.g. R1, D1 |
| `description` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.r_d_code_operations
Links R/D codes to waste_operations entries.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `r_d_id` | uuid → `emac.r_d_code` | |
| `waste_opt_id` | uuid → `emac.waste_operations` | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### emac.elements
Chemical elements/compounds in waste.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `name` | text | |
| `note` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## Service Type Tables

### emac.type_of_services
Waste management service types (linked to catalogs and manifests).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `name` | text | |
| `name_short` | text | |
| `name_for_dis` | text | Name shown to disposal side |
| `note` | text | |
| `last_code` | integer | Auto-increment counter |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.type_of_disposal_services
Disposal-specific service types.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `name` | text | |
| `name_eng` | text | |
| `note` | text | |
| `last_code` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.type_operations
Links transporters to service types they support.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `tran_id` | uuid → `emac.transporters` | |
| `type_id` | uuid → `emac.type_of_services` | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.disposal_type_operations
Links disposal facilities to service types.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `dis_id` | uuid → `emac.disposals` | |
| `type_id` | uuid → `emac.type_of_disposal_services` | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.disposal_type_service_operations
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `disposal_id` | uuid → `emac.disposals` | |
| `type_id` | uuid → `emac.type_of_disposal_services` | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## Transport Assets

### emac.vehicles
Vehicles belonging to a transporter.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `tran_id` | uuid → `emac.transporters` | |
| `vehicle_model` | text | |
| `registration_plate` | text | |
| `license` | text | |
| `color` | text | |
| `contrainer` | text | Container type |
| `gps_no` | text | |
| `note` | text | |
| `status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.drivers
Drivers belonging to a transporter.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `tran_id` | uuid → `emac.transporters` | |
| `drive_name` | text | |
| `tel` | text | |
| `license` | text | Driver license number |
| `note` | text | |
| `status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## Storage & Facilities

### emac.storages
On-site waste storage areas at a generator.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `generator_id` | uuid → `emac.generators` | |
| `storage_name` | text | |
| `area` | numeric | m² |
| `quantity` | numeric | |
| `note` | text | |
| `status` | boolean | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Array relationships:** `storage_operations`, `facility_operations`

### emac.storage_operations
Links storages to types and service categories.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `storage_id` | uuid → `emac.storages` | |
| `storage_type_id` | uuid → `emac.storage_types` | |
| `type_id` | uuid → `emac.type_of_services` | |

### emac.storage_types
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `type_name` | text | |
| `type_name_lo` | text | |

### emac.storage_extensions
Extensions/additions to generator storage.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `gen_id` | uuid → `emac.generators` | |
| `name` | text | |
| `storage` | text | Storage info |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.facilities
Facility types available at generators.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `name` | text | |

### emac.facility_operations
Links generators' storages to facilities.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `storage_id` | uuid → `emac.storages` | |
| `fac_id` | uuid → `emac.facilities` | |
| `description` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.generator_facilities
Types of generator facilities.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `name` | text | |
| `name_lo` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.disposal_facilities
Sub-facilities within a disposal site.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `dis_id` | uuid → `emac.disposals` | |
| `name` | text | |
| `description` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.disposal_facility_operations
Links disposal facilities to R/D codes.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `dis_fac_id` | uuid → `emac.disposal_facilities` | |
| `r_d_code_id` | uuid → `emac.r_d_code` | |

### emac.disposal_operations
Tracking disposal assignments per manifest.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `manifest_id` | uuid → `emac.manifests` | |
| `dis_id` | uuid → `emac.disposals` | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## Quota & Extension Tables

### emac.extension_operations
Records of quota or time extensions for catalog operations.

| Column | Type | Notes |
|--------|------|-------|
| `id` | integer PK | |
| `cat_opt_id` | uuid → `emac.catalog_operations` | |
| `generator_id` | uuid → `emac.generators` | |
| `extended_type` | text | 'quota' or 'time' |
| `quota_extended` | numeric | Additional quota granted |
| `time_extended` | integer | Days extended |
| `extented_time` | integer | |
| `old_date` | timestamp | Previous expiry |
| `old_quota` | numeric | Previous quota |
| `status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.quota_operations
Log of quota usage events.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `cat_opt_id` | uuid → `emac.catalog_operations` | |
| `type` | text | |
| `description` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.expire_logs
Expiration event logs for catalog operations.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `cat_opt_id` | uuid → `emac.catalog_operations` | |
| `name` | text | |
| `log_date` | date | |
| `description` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## Financial Tables

### emac.transactions
Credits/debits between manifests and disposal accounts.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `type` | text | |
| `credit_amount` | numeric | |
| `debit_amount` | numeric | |
| `credit_to` | uuid → `emac.manifests` | |
| `debit_from` | uuid → `emac.manifests` | |
| `status` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.topup_requests
Balance top-up requests from disposal facilities.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `disposal_id` | uuid → `emac.disposals` | |
| `amount` | numeric | |
| `remark` | text | |
| `attachment` | text | File URL |
| `request_date` | timestamp | |
| `approve_date` | timestamp | |
| `status` | integer | 0=pending, 1=approved, 2=rejected |
| `wd_request` | text | WD user who requested |
| `ws_approve` | text | Staff who approved |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.manifest_fees
Fee schedule for manifests.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `name` | text | |
| `manifest_fee` | numeric | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## Geographic Reference Tables

### emac.provinces
| Column | Type | Notes |
|--------|------|-------|
| `pr_id` | integer PK | |
| `pr_name` | text | |
| `pr_name_lo` | text | |
| `pr_code` | text | |
| `last_code` | integer | |
| `is_special` | integer | |

### emac.districts
| Column | Type | Notes |
|--------|------|-------|
| `dr_id` | integer PK | |
| `pr_id` | integer → `emac.provinces` | |
| `dr_name` | text | |
| `dr_name_lo` | text | |

### emac.villages
| Column | Type | Notes |
|--------|------|-------|
| `vill_id` | integer PK | |
| `dr_id` | integer → `emac.districts` | |
| `vill_name` | text | |
| `vill_name_lo` | text | |

---

## Level / Category Reference Tables

### emac.levels
Operator classification levels.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `level_name` | text | |
| `level_name_lo` | text | |
| `level_order` | integer | Display order |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.level_operations
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `level_id` | uuid → `emac.levels` | |
| `level_name` | text | |
| `level_name_lo` | text | |
| `level_order` | integer | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.industry_types
Types of industries for generators.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `type_name` | text | |
| `type_name_lo` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### emac.weight_disposal
Summary table of daily disposal weights.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `manifest_date` | date | |
| `weight_sum` | bigint | |

---

## Hasura Metadata Summary

### GraphQL Roles & Access
- **generator**: Can create/update manifests, catalogs, storages for own generator_id
- **transporter**: Can view/update transporter_operations for own transporter_id
- **disposal**: Can view manifests assigned to own disposal facility; can update wd_stt
- **regulator**: Read-only access to most tables, can update wr_stt on manifests
- **staff**: Full read/write on all tables
- **guest**: Read-only on manifests (id, manifest_no, status fields only)

### Key Hasura Relationships
```
manifests
  ├── generator       (object → generators)
  ├── disposal        (object → disposals)
  ├── type            (object → type_of_services)
  ├── waste_operations(array)
  ├── transporter_operations (array)
  ├── entry_logs      (array)
  ├── qr_codes        (array)
  └── transactions    (array, via debit_from)

generators
  ├── wg_users        (array)
  ├── catalogs        (array)
  └── storages        (array)

catalogs
  ├── generator       (object)
  ├── catalog_operations (array)
  ├── catalog_wt_operations (array)
  └── catalog_wd_operations (array)

catalog_operations
  ├── catalog         (object)
  ├── waste_category  (object → waste_categories)
  ├── waste_operations(array)
  ├── extension_operations (array)
  └── quota_operations     (array)

transporters
  ├── wt_users        (array)
  ├── vehicles        (array)
  ├── drivers         (array)
  └── type_operations (array)
```

### Hasura Functions (Custom Queries)
| Function | Description |
|----------|-------------|
| `get_manifest_waste_code` | Waste codes per manifest |
| `get_manifest_most_create_waste` | Top waste types |
| `get_manifest_sum_created_waste_wg` | Sum waste by generator |
| `get_manifest_weight_code_wg` | Weight by code for generator |
| `get_weight_disposal_level` | Weight by level |
| `get_weight_disposal_of_wt` | Weight by transporter |
| `get_weight_disposal_of_wt_by_id` | Weight by specific transporter |
| `getdisposalsumtypev2` | Disposal sum by type |
| `getdisposalweightsum` | Total disposal weight |
| `get_sum_create_waste` | Total waste created |
| `get_most_treat_wastes` | Most treated waste types |
| `get_treat_waste_codes` | Treatment codes |
| `get_alert_qouta_extend` | Alert when quota near limit |
| `get_alert_time_extension` | Alert when time near expiry |

### Event Triggers
| Trigger | Table | Event | Webhook |
|---------|-------|-------|---------|
| `update_catalog_amount` | `manifests` | UPDATE `wd_stt` | `netlify/functions/update_catalog_amount` |

---

## Manifest Status Flow

```
wg_stt (Generator status)
  0 = Draft / Pending
  1 = Submitted / Approved

wt_stt (Transporter status)
  0 = Not assigned
  1 = Assigned/In transit

wd_stt (Disposal status)
  0 = Not received
  1 = Received / Processed

wr_stt (Regulator status)
  0 = Not reviewed
  1 = Reviewed/Approved
```

---

*Generated: 2026-03-27 | Source: postgres_backup.sql + Hasura metadata YAML*
