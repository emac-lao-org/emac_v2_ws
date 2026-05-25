<template>
  <div>
    <v-row>
      <v-col align-self="center">
        <h3 id="title_h">
          1. ລາຍລະອຽດຜູ້ສ້າງສິ່ງເສດເຫຼືອ / WASTE GENERATOR INFORMATION
        </h3>
      </v-col>
      <v-col cols="6">
        <table style="width: 100%">
          <tbody>
            <tr>
              <td id="emac_id_text">
                <span id="lable">{{ title[3].toUpperCase() }}</span>
              </td>
              <td id="emac_id">
                <b id="emac_id">
                  {{ data_wg.emac_id }}
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col cols="6">
          <span id="title">{{ title[0].toUpperCase() }}</span>

          <div
            id="labels"
            height="30"
            align="center"
            dense
            color="primary"
            text
          >
            <b id="in_fill">
              {{ data_wg.gen_name_lo }}
            </b>
          </div>

          <span id="title">{{ title[2].toUpperCase() }}</span>
          <div id="labels" align="center" dense color="primary" text>
            <b id="in_fill">
              {{ data_wg.custom_address }}
            </b>
          </div>
        </v-col>
        <v-col cols="6">
          <span id="title">{{ title[1].toUpperCase() }}</span>

          <div id="labels" align="center" dense color="primary" text>
            <b id="in_fill">
              {{ data_wg.gen_name }}
            </b>
          </div>
          <v-row>
            <v-col>
              <span id="title">{{ title[4].toUpperCase() }}</span>
              <div id="labels" align="center" dense color="primary" text>
                <b id="in_fill">
                  {{ this.tel }}
                </b>
              </div>
            </v-col>
            <v-col>
              <span id="title">{{ title[5].toUpperCase() }}</span>
              <div id="labels" align="center" dense color="primary" text>
                <b id="in_fill">
                  {{ this.email }}
                </b>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div id="print">
        <span id="title" class="text-uppercase mt-2">
          {{ title[6].toUpperCase() }}
        </span>
        <!-- {{data_wg}} -->
        <div id="labels" dense color="primary" text>
          <b id="in_fill">
            {{ note }}
          </b>
        </div>
      </div>
    </div>

    <h3 id="title_h" class="my-2 text-uppercase">
      2. ລາຍລະອຽດສິ່ງເສດເຫຼືອ / Waste Information
    </h3>
    <div>
      <table v-for="(item, index) in headers" :key="index"></table>
      <v-data-table
        :headers="headers"
        :items="waste_operations"
        hide-default-footer
        hide-default-header
        :items-per-page="15"
        dense
      >
        <template v-slot:header="{ props: { headers } }">
          <thead>
            <th v-for="(item, index) in headers" :key="index">
              {{ item.text }}
              <br />
              {{ item.text_en }}
            </th>
          </thead>
        </template>

        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td width="5%">
                <span id="tb_result">
                  {{ index + 1 }}
                </span>
              </td>
              <td id="tb_code" width="6%">
                <span id="tb_result">
                  {{ formatWasteCode(item.catalog_operation.waste_category.code, item.catalog_operation.waste_category.entry_type) }}
                </span>
              </td>
              <td id="tb_des" width="8%">
                <span id="tb_result">
                  {{ item.catalog_operation.custom_description }}
                </span>
              </td>
              <td id="tb_quan" width="15%">
                <span id="tb_result">
                  {{ item.quantity }}
                </span>
              </td>
              <td id="tb_unit" width="20%">
                <span id="tb_result">
                  {{ item.unit }}
                </span>
              </td>
              <td id="tb_wei" width="9%">
                <span id="tb_result"> {{ item.weight_generator }} KG </span>
              </td>
              <td id="table_ele" width="14%">
                <span id="tb_result">
                  {{ item.element.name }}
                </span>
              </td>
              <!-- <td width="14%">
                  {{ item.r_d.join(", ") }}
                </td> -->
            </tr>
          </tbody>
        </template>
      </v-data-table>

      <v-row id="bottom_part" class="mt-1">
        <v-col cols="3">
          <table id="total">
            <tbody>
              <tr>
                <td style="width: 195px">
                  <b id="total_text"
                    >ປະລິມານຄາດຄະເນລວມ <br />
                    Total Approximate Weight</b
                  >
                </td>
              </tr>
              <tr>
                <td style="width: 200px height: 45px">
                  <h4 id="total_result">{{ total_weight }} KG</h4>
                </td>
              </tr>
            </tbody>
          </table></v-col
        >
        <v-col cols="5">
          <p id="bt_des">
            ຂ້າພະເຈົ້າຂໍຮັບຮອງວ່າໄດ້ສົ່ງມອບສິ່ງເສດເຫຼືອຕາມທີ່ໄດ້ລະບຸໄວ້ຂ້າງເທິງ
            ໃຫ້ຜູ້ຂົນສົ່ງ (WT) ເພື່ອເຮັດການຂົນສົ່ງໄປຫາຜູ້ບໍາບັດ-ກຳຈັດ
            (WD)ທີ່ໄດ້ລະບຸໄວ້ໃນເອກະສານສະບັບນີ້ແລ້ວ
          </p>
        </v-col>
        <v-col cols="4">
          <v-card id="card" flat>
            <table id="card_content" class="pa-1" style="width: 100%">
              <tr>
                <td id="remove_border">
                  <table style="width: 100%">
                    <tr>
                      <td id="remove_border">
                        <b id="card_stt_detail">ສະຖານະ / STATUS</b>
                        <!-- {{wg_stt}} -->
                      </td>
                      <td v-if="wg_stt == 0" class="status">
                        <b id="card_stt_result">
                          {{ "DRAFT".toUpperCase() }}
                        </b>
                      </td>

                      <td v-else-if="wg_stt == 1" class="status">
                        <b id="card_stt_result">{{
                          "Requested".toUpperCase()
                        }}</b>
                      </td>
                      <td v-else-if="wg_stt == 2" class="status">
                        <b id="card_stt_result">
                          {{ "Process".toUpperCase() }}</b
                        >
                      </td>
                      <td v-else-if="wg_stt == 3" class="status">
                        <b id="card_stt_result">
                          {{ "Completed".toUpperCase() }}</b
                        >
                      </td>
                      <td v-else-if="wg_stt == 100" class="status">
                        <b id="card_stt_result">{{
                          "WS Denied".toUpperCase()
                        }}</b>
                      </td>
                    </tr>
                  </table>
                </td>

                <td id="status_detail_qr" rowspan="3">
                  <v-img
                    v-if="this.tracking == true"
                    id="card_img_qr"
                    class="mx-auto"
                    :src="qr"
                  />
                  <v-img class="mx-auto" v-else id="card_img_qr" />
                </td>
              </tr>
              <tr>
                <td id="card_details">
                  <table style="width: 100%">
                    <tr>
                      <td id="remove_border">
                        <b id="card_stt_detail">ຊື່</b>
                      </td>
                      <td class="status_detail">
                        <b v-if="this.tracking == true" id="detail_result_in">
                          {{ this.user }}
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td id="remove_border" style="width: 35px">
                        <b id="card_stt_detail">ວັນທີ</b>
                      </td>
                      <td class="status_detail">
                        <b v-if="this.tracking == true" id="detail_result_in">
                          {{ date }}
                        </b>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import moment from "moment";
// const CryptoJS = require("crypto-js");
// import { AES256CBC } from "cryptographic-js";
export default {
  props: {
    data_wg: {
      type: [Array, Object],
    },
    data_wg_user: {
      type: [Array, Object],
    },
    wg_stt: {
      type: Number,
    },
    waste_operations: {
      type: [Array, Object],
    },
    address: {
      type: String,
    },
    note: {
      type: String,
    },
    tracking: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      qr: "",
      id: this.$route.query.id,
      url_gen: "",
      paintext: "",
      user: "",
      tel: "",
      manifest_id: "",
      date: "",
      format: "",
      total: 0,
      email: "",
      headers: [
        {
          text: "ລໍາດັບ",
          text_en: "No",
          align: "start",
          sortable: false,
          value: "no",
        },
        {
          text: `ລະຫັດສິ່ງເສດເຫຼືອ`,
          text_en: "WASTE CODE",
          sortable: false,
          value: "catalog_operation.waste_category.code",
        },
        {
          text: "ລາຍການສິ່ງເສດເຫຼືອ",
          text_en: "WASTE DESCRIPTION",
          sortable: false,
          value: "description",
        },
        {
          text: "ຈໍານວນ",
          text_en: "QUANTITY",
          sortable: false,
          value: "quantity",
        },

        {
          text: "ປະເພດບັນຈຸ",
          text_en: "CONTAINER TYPE",
          sortable: false,
          value: "unit",
        },
        {
          text: "ປະລິມານຄາດຄະເນ",
          text_en: "GENERATOR WEIGHT",
          sortable: false,
          value: "weight_generator",
        },
        {
          text: "ສະຖານະສິ່ງເສດເຫຼືອ",
          text_en: "WASTE STATUS",
          sortable: false,
          value: "element.name",
        },
        // {
        //   text: "R&D CODE",
        //   sortable: false,
        //   value: ``,
        // },
      ],
      title: [
        "ຊື່ອົງການຈັດຕັ້ງ ພາສາລາວ/Enterprise name (Lao)",
        "ຊື່ອົງການຈັດຕັ້ງ ພາສາອັງກິດ/Enterprise name (Eng) ",
        "ທີ່ຕັ້ງ/Address",
        "ເລກປະຈໍາຕົວຜູ້ຄອບຄອງສິ່ງເສດເຫຼືອ/EMC ID :",
        "ເບີໂທລະສັບ/OFFICE TELEPHONE",
        "ອີເມລ/EMAIL",
        "ລາຍລະອຽດ/manifest description ",
      ],
      code: [],
      WgData: [],
    };
  },
  methods: {
    formatWasteCode(code, entryType) {
      const normalizedCode = (code || "").trim();
      if (!normalizedCode) return "";
      if ((entryType || "").trim().toUpperCase() !== "HZ") return normalizedCode;
      return normalizedCode.endsWith("*") ? normalizedCode : `${normalizedCode}*`;
    },
    async getInfo() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/manifest/getUserInfoManifest")
            .getUserInfoManifest,
          variables: {
            id: this.id,
          },
        })
        .then((res) => {
          // console.log('res :>> ', res);
          this.date = res.data?.manifest[0]?.qr_codes[0]?.created_at;
          // console.log("🚀 ~ file: pageGenerator.vue:391 ~ .then ~ this.date:", this.date)
          this.date = moment(this.date).format("DD-MM-YYYY");
          // console.log("🚀 ~ file: pageGenerator.vue:345 ~ .then ~  this.date",  this.date)
          this.user = res.data?.manifest[0]?.wg?.name;
          this.tel = res.data?.manifest[0]?.wg?.tel;
          this.email = res.data?.manifest[0]?.wg?.email;
          this.url_gen =
            "https://emac-verify.netlify.app/manifest/?id=" +
            this.id +
            "&module=WG";
          QRCode.toDataURL(this.url_gen, { errorCorrectionLevel: "H" })
            .then((url) => {
              this.qr = url;
              // console.log("this.url :>> ", this.qr);
            })
            .catch((err) => {
              console.error(err);
            });
        });
    },
  },
  computed: {
    total_weight() {
      this.waste_operations.forEach((item) => {
        this.total += item.weight_generator;
      });
      return this.total;
    },
  },
  created() {
    this.getInfo();
  },
};
</script>

<style scoped>
* {
  color: #0d47a1;
  font-family: "Phetsarath OT";
}

.print-break-page {
  page-break-after: always;
}
.default {
  cursor: default;
}
th {
  font-size: 12px;
}
th,
td {
  border-style: groove;
  border: 0.1px solid #000;
  color: #000;
  /* text-align: center; */
}
#tb_result {
  color: #000;
}
.status {
  border: none;
  text-align: center;
  vertical-align: center;
}

#detail_result {
  font-size: 14px;
  background-color: #e4e9f4;
  color: #2b34a5;
  text-align: center;
}
#emac_id_text {
  border: none;
}
#emac_id {
  background-color: #e4e9f4;
  border: none;
  text-align: center;
}
#card_stt_result {
  border-radius: 5px;
  background-color: #fff;
  padding: 0px 10px 0px 10px;
}

.status_detail {
  border-radius: 5px;
  border: none;
  background-color: #e4e9f4;
}
#card_img_qr {
  width: 120px;
}
#status_detail_qr {
  border: none;
}
#remove_border {
  border: none;
}
#card {
  background-color: #e4e9f4;
  text-align: center;
}
#card_details {
  background-color: #fff;
  border: none;
}
#total_text {
  color: #000;
}
#total_result {
  color: #000;
}
#total {
  border-collapse: collapse;
  text-align: center;
}
#detail_result_in {
  font-size: 12px;
}
#labels {
  background-color: #e4e9f4;
  padding: 5px;
}
@media print {
  #break_page {
    page-break-after: always;
  }
  #print {
    display: none;
  }
  * {
    font-size: 14px;
  }
  span {
    font-size: 14px;
  }
  th,
  td {
    border-style: ridge;
    border: 0.1px solid #717171;
    color: #000;
    font-size: 9px;
    /* text-align: center; */
  }
  #tb_des {
    width: 9%;
  }
  #tb_wei {
    width: 12%;
  }
  #tb_unit {
    width: 8%;
  }
  #tb_code {
    width: 8%;
  }
  #tb_quan {
    width: 6%;
  }
  #tb_unit {
    width: 15%;
  }
  #title_h {
    font-size: 10px;
  }
  #title {
    font-size: 10px;
  }
  #lable {
    font-size: 10px;
  }
  #emac_id_text {
    font-size: 10px;
    width: 100%;
  }
  #emac_id {
    font-size: 10px;
    padding: 0px 15px;
  }
  #in_fill {
    font-size: 10px;
  }
  #tb_result {
    font-size: 10px;
    color: #000;
  }
  #table_ele {
    width: 8%;
  }
  #bt_des {
    font-size: 10px;
  }
  #total {
    width: 150px;
  }
  #total_text {
    font-size: 10px;
    color: #000;
    text-align: center;
  }
  #total_result {
    font-size: 12px;
    color: #000;
  }
  #card_stt {
    font-size: 8px;
    background-color: #fff;
  }

  #card_stt_detail {
    font-size: 6px;
    padding-left: 10px;
    padding-right: 10px;
  }

  #card_stt_result {
    font-size: 7px;
  }
  #status_detail_qr {
    border: none;
  }
  #detail_result {
    height: 30px;
    font-size: 10px;
    background-color: #e4e9f4;
  }
  #detail_result_in {
    font-size: 6px;
  }
  .status_detail {
    width: 80%;
    border: none;
  }

  #card_img_qr {
    width: 60px;
  }
  #card_status_text {
    border: none;
  }
  table {
    display: block;
    page-break-inside: avoid;
  }
  tr,
  td {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  #bottom_part {
    page-break-inside: avoid;
    page-break-after: auto;
  }
}
</style>
