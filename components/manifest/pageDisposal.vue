<template>
  <div id="head">
    <v-row>
      <v-col align-self="center">
        <h3 id="title_h" class="text-uppercase">
          1. ຜູ້ບໍາບັດ-ກຳຈັດສິ່ງເສດເຫຼືອ / Waste Disposal Information
        </h3>
      </v-col>
      <v-col cols="6">
        <table style="width: 100%">
          <tbody>
            <tr>
              <td id="emac_id_text">
                <span id="lable"
                  >ເລກປະຈໍາຕົວຜູ້ຄອບຄອງສິ່ງເສດເຫຼືອ / EMC ID
                </span>
              </td>
              <td id="emac_id">
                <b id="emac_id">
                  {{ data_wd.emac_id }}
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
          <span id="title"
            >ຊື່ອົງການຈັດຕັ້ງ ພາສາລາວ / ENTERPRISE NAME (LAO)</span
          >

          <div id="labels" align="center" dense color="primary" text>
            <b id="in_fill">
              {{ data_wd.dis_name_lo }}
            </b>
          </div>
          <span id="title">ທີ່ຕັ້ງ / ADDRESS</span>
          <div id="labels" align="center" dense color="primary" text>
            <b id="in_fill">
              {{ address }}
            </b>
          </div>
        </v-col>
        <v-col>
          <span id="title"
            >ຊື່ອົງການຈັດຕັ້ງ ພາສາອັງກິດ / ENTERPRISE NAME (ENG)</span
          >

          <div id="labels" align="center" dense color="primary" text>
            <b id="in_fill">
              {{ data_wd.dis_name }}
            </b>
          </div>
          <v-row>
            <v-col>
              <span id="title">ເບີໂທລະສັບ / OFFICE TELEPHONE</span>
              <div id="labels" align="center" dense color="primary" text>
                <b id="in_fill">
                  {{ this.tel }}
                </b>
              </div>
            </v-col>
            <v-col>
              <span id="title">ອີເມລ / EMAIL</span>
              <div id="labels" align="center" dense color="primary" text>
                <b id="in_fill">
                  {{ this.email }}
                </b>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <h3 class="mt-2 text-uppercase" id="title_h">2. ຂໍ້ມູນສິ່ງເສດເຫຼືອ / Waste Information</h3>
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
              {{ item.text2 }}
            </th>
          </thead>
        </template>

        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td width="3%">
                <span id="tb_result">
                  {{ index + 1 }}
                </span>
              </td>
              <td id="tb_code" width="8%">
                <span id="tb_result">
                  {{ formatWasteCode(item.catalog_operation.waste_category.code, item.catalog_operation.waste_category.entry_type) }}
                </span>
              </td>

              <td id="tb_des" width="20%">
                <span id="tb_result">
                  {{ item.catalog_operation.custom_description }}
                </span>
              </td>
              <td width="6%">
                <span id="tb_result">
                  {{ item.quantity }}
                </span>
              </td>
              <td id="tb_unit" width="10%">
                <span id="tb_result">
                  {{ item.unit }}
                </span>
              </td>
              <td id="tb_wei" width="12%">
                <span id="tb_result"> {{ item.weight_disposal }} KG </span>
              </td>
              <td width="8%">
                <span id="tb_result">
                  {{ item.element.name }}
                </span>
              </td>
              <td id="tb_r_d">
                <span id="tb_result">
                  {{ item.r_d.join(", ") }}
                </span>
              </td>
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
                    >ນ້ຳໜັກລວມ <br />
                    TOTAL</b
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
            ຂ້າພະເຈົ້າຂໍຮັບຮອງວ່າໄດ້ຮັບເອົາສິ່ງເສດເຫຼືອຈາກຜູ້ສ້າງສິ່ງເສດເຫຼືອ
            (WG) ທີ່ໄດ້ຂົນສົ່ງໂດຍຜູ້ຂົນສົ່ງ (WT) ຕາມທີ່ໄດ້ລະບຸໄວ້ຂ້າງເທິງແລ້ວ
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
                      </td>
                      <td v-if="wd_status == 0" class="status">
                        <b id="card_stt_result" class="text-uppercase">
                          Draft</b
                        >
                      </td>
                      <td v-else-if="wd_status == 1" class="status">
                        <b id="card_stt_result" class="text-uppercase"
                          >CONFIRMED</b
                        >
                      </td>
                      <td v-else-if="wd_status == 2" class="status">
                        <b id="card_stt_result" class="text-uppercase">
                          Process</b
                        >
                      </td>
                      <td v-else-if="wd_status == 3" class="status">
                        <b id="card_stt_result" class="text-uppercase">
                          Completed</b
                        >
                      </td>
                      <td v-else-if="wd_status == 100" class="status">
                        <b id="card_stt_result" class="text-uppercase"
                          >WS Denied</b
                        >
                      </td>
                    </tr>
                  </table>
                </td>

                <td id="status_detail_qr" rowspan="3">
                  <v-img
                    v-if="wd_status != 0 && wd_status != 1"
                    class="mx-auto"
                    id="card_img_qr"
                    :src="qr"
                  />
                  <v-img v-else class="mx-auto" id="card_img_qr" />
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
                        <b
                          v-if="wd_status != 0 && wd_status != 1"
                          id="detail_result_in"
                        >
                          {{ user }}
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td id="remove_border" style="width: 35px">
                        <b id="card_stt_detail">ວັນທີ</b>
                      </td>
                      <td class="status_detail">
                        <b
                          v-if="wd_status != 0 && wd_status != 1"
                          id="detail_result_in"
                        >
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
export default {
  props: {
    data_wd: {
      type: [Object, Array],
      default: () => {},
    },
    wd_status: {
      type: Number,
      default: 0,
    },
    waste_operations: {
      type: [Array, Object],
    },
    address: {
      type: String,
      default: "",
    },
    tracking: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: [],
      qr: "",
      url_gen: "",
      user: "",
      date: "",
      tel: "",
      id: this.$route.query.id,
      email: "",
      status_text_0: "Waiting for approval",
      status_text_1: "WD Approved",
      status_text_2: "WD Processing",
      status_text_3: "Completed",
      status_text_10: "WD Not approve",
      status_text_20: "WD Rejected",
      total: 0,
      headers: [
        {
          text: "ລໍາດັບ",
          text2: "NO",
          align: "start",
          sortable: false,
          value: "no",
        },
        {
          text: `ລະຫັດສິ່ງເສດເຫຼືອ`,
          text2: "WASTE CODE",
          value: "catalog_operation.waste_category.code",
        },
        {
          text: "ລາຍການສິ່ງເສດເຫຼືອ",
          text2: "WASTE DESCRIPTION",
          sortable: false,
          value: "description",
        },
        {
          text: "ຈໍານວນ",
          text2: "QUANTITY",
          sortable: false,
          value: "quantity",
        },
        {
          text: "ປະເພດບັນຈຸ",
          text2: "CONTAINER TYPE",
          sortable: false,
          value: "unit",
        },
        {
          text: "ນ້ຳໜັກ",
          text2: "WEIGHT",
          sortable: false,
          value: "weight_disposal",
        },
        {
          text: "ສະຖານະສິ່ງເສດເຫຼືອ",
          text2: "TYPE OF WASTE",
          sortable: false,
          value: "element.name",
        },
        {
          text: "ລະຫັດ ກຳຈັດແລະບໍາບັດ",
          text2: "R&D CODE",
          value: "catalog_operation.waste_category.code",
        },
      ],
    };
  },
  computed: {
    total_weight() {
      this.waste_operations.forEach((item) => {
        this.total += item.weight_disposal;
      });
      return this.total;
    },
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
          this.data = res.data.manifest[0];
          // console.log("res :>> ", res);
          this.date = res.data?.manifest[0]?.qr_codes[0]?.wd_date;
          this.date = moment(this.date).format("DD-MM-YYYY");
          // console.log("🚀 ~ file: pageDisposal.vue:334 ~ .then ~  this.date",  this.date)
          this.user = res.data?.manifest[0]?.wd?.name;
          this.tel =
            res.data?.manifest[0]?.wd == null
              ? "N/A"
              : res.data?.manifest[0]?.wd?.tel;
          this.email =
            res.data?.manifest[0]?.wd == null
              ? "N/A"
              : res.data?.manifest[0]?.wd?.email;
          this.url_gen =
            "https://emac-verify.netlify.app/manifest/?id=" +
            this.id +
            "&module=WD";
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
  mounted() {
    this.getInfo();
  },
};
</script>

<style scoped>
* {
  color: #0d47a1;
  font-family: "Phetsarath OT";
}
#labels {
  background-color: #e4e9f4;
  padding: 5px;
}
.default {
  cursor: default;
}
.status_detail {
  border-radius: 5px;
  border: none;
  background-color: #e4e9f4;
}
th {
  font-size: 12px;
  color: #000;
}
#remove_border {
  border: none;
}
th,
td {
  border: 0.1px solid #000;
}

#font {
  font-size: 12px;
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
.status {
  border: none;
  text-align: center;
  vertical-align: center;
}
.status_detail {
  border: none;
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
  background-color: #fff;
  border-radius: 5px;
  padding: 0px 10px 0px 10px;
}

#detail_result {
  font-size: 14px;
  background-color: #e4e9f4;
  color: #2b34a5;
  text-align: center;
}
#tb_result {
  color: #000;
}
#card_img_qr {
  width: 120px;
}
#status_detail_qr {
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
#detail_result_in {
  font-size: 12px;
}
@media print {
  * {
    font-size: 14px;
  }

  #head {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  #bottom_part {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  #title_h {
    font-size: 10px;
  }
  .print-break-page {
    page-break-after: always;
  }
  #card_img_qr {
    width: 60px;
  }
  #detail_result_in {
    font-size: 6px;
  }
  #card_stt_detail {
    font-size: 6px;
  }
  .status_detail {
    border: none;
  }
  th,
  td {
    font-size: 9px;
    border: 0.5px solid #717171;
    color: #717171;
    /* text-align: center; */
  }
  #emac_id {
    font-size: 10px;
  }
  #tb_result {
    font-size: 10px;
    color: #000;
  }
  #lable {
    font-size: 10px;
  }
  span {
    font-size: 14px;
  }
  #emac_id_text {
    font-size: 10px;
    width: 180px;
  }
  #title {
    font-size: 10px;
  }
  #in_fill {
    font-size: 10px;
  }
  #tb_r_d {
    width: 4%;
  }
  #tb_des {
    width: 9%;
  }
  #total {
    width: 150px;
  }
  #total_text {
    font-size: 10px;
  }
  #total_result {
    font-size: 12px;
  }
  #tb_wei {
    width: 10%;
  }
  #tb_code {
    width: 10%;
  }
  #tb_unit {
    width: 10%;
  }
  #bt_des {
    font-size: 10px;
  }

  #card_stt_result {
    font-size: 7px;
  }
  th,
  td,
  td,
  #card {
    page-break-inside: avoid;
    page-break-after: auto;
  }
}
</style>
