# การใช้งาน GraphQL Subscription ในโปรเจกต์ EMAC-WS

เอกสารนี้สรุปการทำงานของ GraphQL Subscription ใน 5 จุดสำคัญของโปรเจกต์ พร้อมคำแนะนำเตรียมความพร้อมหากต้องการเปลี่ยนไปใช้ `Query` ธรรมดา (Polling/Refetching)

## ภาพรวมของการใช้ Subscription ปัจจุบัน
ในโปรเจกต์นี้ใช้ Subscription ผ่าน `$apollo.subscribe()` หน้าที่หลักคือ **การดึงข้อมูลมาแสดงผลใน Data Table ทันทีที่มีการเปลี่ยนแปลงในฐานข้อมูล** (Real-time updates) โดยไม่มีการกดปุ่ม Refresh 

---

## สรุป 5 จุดที่มีการใช้งาน

### 1. `request_to_add_categories.vue` (การรออนุมัติหมวดหมู่ขยะ)
- **ไฟล์ Query:** `gql/queries/waste_categories/wasteCatagoriesExtend.gql`
- **ชื่อ Subscription:** `wasteCatagoriesExtendSub`
- **การทำงาน:** หน้าจอนี้ใช้ดึงข้อมูลตาราง "รายการขอเพิ่ม/ขยายเวลาหมวดหมู่ขยะ" ที่มี Status เป็น `0` (Draft/Pending) เข้ามาแสดงผล 
- **โค้ดที่ทำต่อ (Next):** เมื่อมี Data ใหม่เข้ามา จะทำการ map ข้อมูล `generator` ออกมาเก็บไว้ และอัปเดตตัวแปร `this.data` ทำให้ตารางในหน้าเว็บอัปเดตทันที
- **หากเปลี่ยนเป็น Query:** สามารถเรียกใช้ `wasteCatagoriesExtend` (มีเขียนเตรียมไว้แล้วในไฟล์ `.gql` เดียวกัน) 

### 2. `components/manifest/tableManifestCP.vue` (ตาราง Manifest สิทธิ์บริษัท)
- **ไฟล์ Query:** `gql/queries/manifest/getManifest.gql`
- **ชื่อ Subscription:** `getManifestCP`
- **การทำงาน:** ดึงข้อมูล Manifest ที่ระบุ Status เจาะจงสำหรับฝั่งบริษัท (เช่น `wg_stt: 3`, `wt_stt: 3`, `wd_stt: 3`) 
- **โค้ดที่ทำต่อ (Next):** นำข้อมูลมาวนลูป (Map) เพื่อจัดการ array ของ `transporters` และคำนวณ `manifest_stt` (สถานะรวม) จากนั้นยัดกลับเข้าไปใน `this.data` เพื่อวาดตาราง

### 3. `components/manifest/tableManifest.vue` (ตาราง Manifest หลักของระบบ)
- **ไฟล์ Query:** `gql/queries/manifest/getManifest.gql`
- **ชื่อ Subscription:** `getManifestSub`
- **การทำงาน:** เป็นตารางใหญ่สุดที่ดึงข้อมูล Manifest ทั้งหมดที่ `wg_stt` ยืนยันแล้ว (ไม่เท่ากับ 0) สังเกตว่าหน้าเว็บนี้มี Filter และ Tab (Tracking, Uncompleted, History) ค่อนข้างเยอะ
- **โค้ดที่ทำต่อ (Next):** 
  - คำนวณสถานะ `manifest_stt` แบบละเอียด (เอา `wg_stt + wt_stt + wd_stt + wr_stt` มาบวกกันแล้วตีความหมายเป็น Text ว่า Processing, Completed, Rejected ฯลฯ)
  - แมพข้อมูล `quantity` ทั้งฝั่ง Generator และ Disposal
  - คัดกรองข้อมูลเข้า Tab ต่างๆ ผ่านเงื่อนไข `this.page == 'History'` เป็นต้น
- **หากเปลี่ยนเป็น Query:** มี `query getManifest` เตรียมไว้อยู่บ้าง แต่ Field อาจจะยังดึงมาไม่ครบเท่าตัว Sub ต้องทำการคัดลอก Field จาก `getManifestSub` ไปสร้างเป็น Query ใหม่

### 4. `components/company_management/manifestPer/tableManifestPer.vue` (ตาราง Manifest ส่วนบุคคล/Generator)
- **ไฟล์ Query:** `gql/queries/manifest/getManifest.gql`
- **ชื่อ Subscription:** `getManifestSubPer`
- **การทำงาน:** คล้ายข้อ 3 แต่มีการส่งตัวแปร `$id` เข้าไปเพื่อ Fetch เฉพาะรายการที่ Generator ID ตรงกับพารามิเตอร์ (ดึงเฉพาะของบริษัทนั้นๆ)

### 5. `mixins/controllerDataTableWT.js` (การแสดงผลรายชื่อ Transporter)
- **ไฟล์ Query:** `gql/queries/getTransporter.gql`
- **ชื่อ Subscription:** `getTransportersNeqSub`
- **การทำงาน:** หน้าจอนำรายชื่อบริษัทขนส่ง (Transporter) ทั้งหมดที่สถานะไม่เท่ากับ 4 (ไม่ได้โดนลบ) มาแสดงในตาราง
- **โค้ดที่ทำต่อ (Next):** 
  - คล้ายกับที่อื่นคือเอา Data มา Map `tos` (Type of service), จัด Format ที่อยู่ (Village, District), และเก็บลง `this.data`
- **หากเปลี่ยนเป็น Query:** ในไฟล์มีการเขียน `query getTransportersNeq` เตรียมเอาไว้ให้ใช้แทนได้ทันที

---

## 🛠 คำแนะนำหากต้องการเปลี่ยนจาก Subscription เป็น Query ปกติ

เมื่อเปลี่ยนจากการรอรับข้อมูล Real-time เป็นการเรียกยิงผ่าน Query สิ่งที่ต้องปรับปรุงในโค้ดคือ:

1. **เปลี่ยน Syntax การเรียก API:**
   จากเดิม:
   ```javascript
   const res = await this.$apollo.subscribe({
     query: require('...').[Sub_Name]
   })
   res.subscribe({ next: (data) => { ... } })
   ```
   เปลี่ยนเป็น:
   ```javascript
   const res = await this.$apollo.query({
     query: require('...').[Query_Name],
     fetchPolicy: 'network-only' // บังคับให้โหลดจาก Server ใหม่เสมอไม่แคช
   })
   // โค้ดที่เคยอยู่ใน next: (data) ให้ย้ายมาทำตรงนี้ต่อ
   this.data = res.data.xxx
   ```

2. **เพิ่มระบบ Refetch หรือ Polling (ถ้ายังอยากให้ข้อมูลอัปเดตอัตโนมัติ):**
   หากไม่อยากให้ผู้ใช้ต้องกด Refresh หน้าเว็บตลอด จะต้องใช้เทคนิค Polling (ยิง Query ซ้ำทุกๆ x วินาที) โดยตั้งค่าใน Apollo ได้เช่น `pollInterval: 5000` (ทุก 5 วินาที) 
   หรือใช้ `setInterval` เรียกฟังก์ชันเดิมซ้ำๆ (ระวังเรื่อง Performance)

3. **อัปเดตไฟล์ `.gql`:**
   เช็คว่ามี `query` ที่ชื่อและโครงสร้าง Field ตรงกับ `subscription` เดิมครบทุกตัว ถ้าไม่มีให้สร้างใหม่ เช่น `query getManifestQuery { ... }` โดยก๊อปปี้ Field ข้างในมาจาก Subscription ได้เลย
