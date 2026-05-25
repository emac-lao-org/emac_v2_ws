<template>
  <div>
    <v-row>
      <v-col align-self="center">
        <h3 id="title_h" class="text-uppercase">
          {{ this.order + 1 }}.1 ລາຍລະອຽດຜູ້ຂົນສົ່ງສິ່ງເສດເຫຼືອ / Waste
          Transporter Information
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
                  {{ data_wt[this.order].transporter.emac_id }}
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <div>
      <v-row class="mt-4">
        <v-col cols="6">
          <span id="title">{{ title[0] }}</span>
          <div align="center" id="labels" dense color="primary" text>
            <b id="in_fill">
              {{ data_wt[this.order].transporter.tran_name_lo }}
            </b>
          </div>

          <span id="title">{{ title[2] }}</span>

          <div align="center" id="labels" dense color="primary" text>
            <b>
              <span id="in_fill" v-if="this.address == '1'">
                {{ data_vill_wt }}
              </span>
              <span id="in_fill" v-else-if="this.address == '2'">
                {{ data_vill_wt2 }}
              </span>
              <span id="in_fill" v-else>
                {{ data_vill_wt3 }}
              </span>
            </b>
          </div>
        </v-col>
        <v-col cols="6">
          <span id="title">{{ title[1] }}</span>

          <div align="center" id="labels" dense color="primary" text>
            <b id="in_fill">
              {{ data_wt[this.order].transporter.tran_name }}
            </b>
          </div>

          <v-row>
            <v-col>
              <span id="title">{{ title[4] }}</span>
              <div align="center" id="labels" dense color="primary" text>
                <b id="in_fill">
                  {{ wtData[this.order]?.wtUserByWtUser?.tel || "N/A" }}
                </b>
              </div>
            </v-col>
            <v-col>
              <span id="title">{{ title[5] }}</span>
              <div align="center" id="labels" dense color="primary" text>
                <b id="in_fill">
                  {{ wtData[this.order]?.wtUserByWtUser?.email || "N/A" }}
                </b>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <h3 class="mt-2 text-uppercase" id="title_h">
      {{ this.order + 1 }}.2 ລາຍລະອຽດພາຫະນະ / Vehicle Information
    </h3>
    <div>
      <!-- {{ vehicles_0 }} -->
      <table v-for="(item, index) in headers" :key="index"></table>
      <v-data-table
        :headers="headers"
        :items="
          this.vehicles_order == 0
            ? vehicles_0
            : this.vehicles_order === 1
            ? vehicles_1
            : vehicles_2
        "
        hide-default-footer
        hide-default-header
        :items-per-page="15"
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
              <td id="tb_result">{{ index + 1 }}</td>
              <td id="tb_result">{{ item.vehicle.contrainer }}</td>
              <td id="tb_result">{{ item.driver.drive_name }}</td>
              <td id="tb_result">
                {{ item.vehicle.registration_plate }}
              </td>
              <td id="tb_result">
                {{
                  item.driver.transporter_operations[0].manifest.security_seal
                }}/
                {{ item.vehicle.gps_no }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
      <v-row id="bottom_part" class="mt-1">
        <v-col cols="8">
          <p id="bt_des">
            ຂ້າພະເຈົ້າຂໍຮັບຮອງວ່າໄດ້ຮັບເອົາສິ່ງເສດເຫຼືອຕາມທີ່ໄດ້ລະບຸໄວ້ຂ້າງເທິງຈາກຜູ້ສ້າງສິ່ງເສດເຫຼືອ
            (WG) ເພື່ອເຮັດການຂົນສົ່ງໄປ ໃຫ້ຜູ້ບໍາບັດ-ກຳຈັດ (WD)
            ທີ່ໄດ້ລະບຸໄວ້ໃນເອກະສານສະບັບນີ້ແລ້ວ
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
                      <!-- {{this.wt_status + data_wt[this.order].wt_status}}
                      {{this.wt_status}}
                      {{data_wt[this.order].wt_status}} -->
                      <td
                        class="status"
                        v-if="
                          this.wt_status + data_wt[this.order].wt_status == 0
                        "
                      >
                        <b id="card_stt_result" class="text-uppercase">
                          {{ status_text_0 }}
                        </b>
                      </td>
                      <td
                        color="#7864CC"
                        class="status"
                        v-else-if="
                          this.wt_status + data_wt[this.order].wt_status == 2
                        "
                      >
                        <b id="card_stt_result" class="text-uppercase">
                          {{ status_text_1 }}
                        </b>
                      </td>
                      <td
                        color="#7864CC"
                        class="status"
                        v-else-if="
                          this.wt_status + data_wt[this.order].wt_status == 3
                        "
                      >
                        <b id="card_stt_result" class="text-uppercase">
                          {{ status_text_2 }}
                        </b>
                      </td>
                      <td
                        color="success"
                        class="status"
                        v-else-if="
                          this.wt_status + data_wt[this.order].wt_status === 4
                        "
                      >
                        <b id="card_stt_result" class="text-uppercase">
                          {{ status_text_3 }}
                        </b>
                      </td>
                      <td
                        color="error"
                        class="status"
                        v-else-if="
                          this.wt_status + data_wt[this.order].wt_status === 20
                        "
                      >
                        <b id="card_stt_result" class="text-uppercase">
                          {{ status_text_10 }}
                        </b>
                      </td>
                      <td
                        color="error"
                        class="status"
                        v-else-if="
                          this.wt_status + data_wt[this.order].wt_status === 40
                        "
                      >
                        <b id="card_stt_result" class="text-uppercase">
                          {{ status_text_100 }}
                        </b>
                      </td>
                    </tr>
                  </table>
                </td>
                <td id="status_detail_qr" rowspan="3">
                  <v-img
                    v-if="
                      data_wt[this.order].wt_status + this.wt_status == 3 ||
                      data_wt[this.order].wt_status + this.wt_status == 4
                    "
                    class="mx-auto"
                    id="card_img_qr"
                    :src="
                      this.vehicles_order == 0
                        ? this.qr1
                        : this.vehicles_order === 1
                        ? this.qr2
                        : this.qr3
                    "
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
                          v-if="
                            data_wt[this.order].wt_status + this.wt_status ==
                              3 ||
                            data_wt[this.order].wt_status + this.wt_status == 4
                          "
                          id="detail_result_in"
                        >
                          <span
                            id="card_stt_detail_in"
                            v-if="this.vehicles_order == 0"
                          >
                            {{ this.user1 }}
                          </span>
                          <span
                            id="card_stt_detail_in"
                            v-else-if="this.vehicles_order == 1"
                          >
                            {{ this.user2 }}
                          </span>
                          <span id="card_stt_detail_in" v-else>
                            {{ this.user3 }}
                          </span>
                        </b>
                      </td>
                    </tr>
                    <tr>
                      <td id="remove_border" style="width: 35px">
                        <b id="card_stt_detail">ວັນທີ</b>
                      </td>
                      <td class="status_detail">
                        <b
                          v-if="
                            data_wt[this.order].wt_status + this.wt_status ==
                              3 ||
                            data_wt[this.order].wt_status + this.wt_status == 4
                          "
                          id="detail_result_in"
                        >
                          <span
                            id="card_stt_detail_in"
                            v-if="this.vehicles_order == 0"
                          >
                            {{ this.date1 }}
                          </span>
                          <span
                            id="card_stt_detail_in"
                            v-else-if="this.vehicles_order == 1"
                          >
                            {{ this.date2 }}
                          </span>
                          <span id="card_stt_detail_in" v-else>
                            {{ this.date3 }}
                          </span>
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
    data_wt: {
      type: [Array, Object],
      default: () => [],
    },
    wt_status: {
      type: [String, Number],
    },
    order: {
      type: [String, Number],
    },
    vehicles_order: {
      type: [String, Number],
    },

    address: {
      type: String,
      default: "No data",
    },
    data_vill_wt: {
      type: String,
      default: "No data",
    },

    data_vill_wt2: {
      type: String,
      default: "No data",
    },

    data_vill_wt3: {
      type: String,
      default: "No data",
    },
    security_seal: {
      type: String,
      default: "No data",
    },
  },
  data() {
    return {
      id: this.$route.query.id,
      url_gen1: "",
      url_gen2: "",
      url_gen3: "",
      qr1: "",
      qr2: "",
      qr3: "",
      wtData: [],
      vehicles: [],
      vehicles_0: [],
      vehicles_1: [],
      vehicles_2: [],
      driver_0: [],
      driver_1: [],
      driver_2: [],
      test: [],
      user1: "",
      user2: "",
      user3: "",
      date1: "",
      date2: "",
      date3: "",
      headers: [
        {
          text: "ລໍາດັບ",
          text2: "ORDER",
          align: "start",
          sortable: false,
          value: "no",
        },
        {
          text: "ປະເພດພາຫະນະ",
          text2: "VEHICLE TYPE",
          align: "start",
          sortable: false,
          value: "vehicle.contrainer",
        },
        { text: "ຊື່ຄົນຂັບ", text2: "DRIVER NAME", value: "driver.drive_name" },
        {
          text: "ປ້າຍລົດ",
          text2: "LICENSE PLATE",
          value: "vehicle.registration_plate",
        },
        {
          text: "SECURITY SEAL /",
          text2: "GPS NUMBER",
          value: "driver.transporter_operations[0].manifest.security_seal",
        },
      ],
      status_text_0: "Draft",
      status_text_1: "CONFIRMED",
      status_text_2: "Process",
      status_text_3: "Completed",
      status_text_10: "WT Not approve",
      status_text_100: "Not Delivery",
      title: [
        "ຊື່ອົງການຈັດຕັ້ງ ພາສາລາວ/ENTERPRISE NAME (LAO)",
        "ຊື່ອົງການຈັດຕັ້ງ ພາສາອັງກິດ/ENTERPRISE NAME (ENG)",
        "ທີ່ຕັ້ງ/ADDRESS",
        "ເລກປະຈໍາຕົວຜູ້ຄອບຄອງສິ່ງເສດເຫຼືອ/EMC ID : ",
        "ເບີໂທລະສັບ/OFFICE TELEPHONE",
        "ອີເມລ/EMAIL",
      ],
    };
  },
  methods: {
    async getVehicle() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/manifest/getManifestVehicle")
            .getManifestVehicle,
          variables: {
            id: this.id,
          },
        })
        .then((data) => {
          this.vehicles = data.data.emac_manifests[0].transporter_operations;
          console.log("🚀 ~ file: pageTran.vue:437 ~ .then ~  this.vehicles:",  this.vehicles)
     

          if (this.vehicles.length == 1) {
            this.getWT_1();
          } else if (this.vehicles.length == 2) {
            this.getWT_1();
            this.getWT_2();
          } else if (this.vehicles.length == 3) {
            this.getWT_1();
            this.getWT_2();
            this.getWT_3();
          }
        })
        .catch((err) => {
          // console.log("err :>> ", err);
          // let text = "There's no transportors";
          // if (confirm(text) == true) {
          //   this.$router.push("/manifest/manifest_management");
          // } else {
          //   return false;
          // }
        });
    },
    getWT_1() {
      this.driver_0 = this.vehicles[0].driver.drive_name;
      this.vehicles_0 = this.vehicles[0];
      this.vehicles_0 = [this.vehicles_0];
      // console.log("this.driver_0 :>> ", this.driver_0);
      // console.log("this.vehicles_0 :>>", this.vehicles_0);
    },
    getWT_2() {
      this.driver_1 = this.vehicles[1].driver.drive_name;
      this.vehicles_1 = this.vehicles[1];
      this.vehicles_1 = [this.vehicles_1];
      // this.vehicles_1[0].driver_name = this.driver_1
      // console.log("this.driver_1 :>> ", this.driver_1);
      // console.log("this.vehicles_1 :>>", this.vehicles_1);
    },
    getWT_3() {
      this.driver_2 = this.vehicles[2].driver.drive_name;
      this.vehicles_2 = this.vehicles[2];
      this.vehicles_2 = [this.vehicles_2];
      // console.log("this.driver_2 :>> ", this.driver_2);
      // console.log("this.driver_2 :>>", this.vehicles_2);
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
          this.wtData = res.data.manifest[0].wt;
          // console.log("🚀 ~ file: pageTran.vue:520 ~ .then ~ this.wtData:", this.wtData)
          // console.log(
          //   "res.data.manifests[0].wt.length :>> ",
          //   res.data.manifests
          // );
          this.user1 = res.data.manifest[0].wt[0].user_name;
          this.date1 = res.data.manifest[0].wt[0].updated_at;
          this.date1 = moment(this.date1).format("DD-MM-YYYY");
          if (this.data_wt.length == 2) {
            this.user2 = res.data.manifest[0].wt[1].user_name;
            this.date2 = res.data.manifest[0].wt[1].updated_at;
            this.date2 = moment(this.date2).format("DD-MM-YYYY");
          }

          if (this.data_wt.length == 3) {
            this.user3 = res.data.manifest[0].wt[2].user_name;
            this.date3 = res.data.manifest[0].wt[2].updated_at;
            this.date3 = moment(this.date3).format("DD-MM-YYYY");
          }
          this.url_gen1 =
            "https://emac-verify.netlify.app/manifest/?id=" +
            this.id +
            "&module=WT_1";
          this.url_gen2 =
            "https://emac-verify.netlify.app/manifest/?id=" +
            this.id +
            "&module=WT_2";
          this.url_gen3 =
            "https://emac-verify.netlify.app/manifest/?id=" +
            this.id +
            "&module=WT_3";

          QRCode.toDataURL(this.url_gen1, { errorCorrectionLevel: "H" })
            .then((url) => {
              this.qr1 = url;
              // console.log(
              //   "🚀 ~ file: pageTransporter.vue ~ line 1551 ~ .then ~ this.qr1",
              //   this.qr1
              // );
            })
            .catch((err) => {
              console.error(err);
            });
          QRCode.toDataURL(this.url_gen2, { errorCorrectionLevel: "H" })
            .then((url) => {
              this.qr2 = url;
              // console.log(
              //   "🚀 ~ file: pageTransporter.vue ~ line 1567 ~ .then ~  this.qr2",
              //   this.qr2
              // );
            })
            .catch((err) => {
              console.error(err);
            });
          QRCode.toDataURL(this.url_gen3, { errorCorrectionLevel: "H" })
            .then((url) => {
              this.qr3 = url;
              // console.log(
              //   "🚀 ~ file: pageTransporter.vue ~ line 1576 ~ .then ~ this.qr3 ",
              //   this.qr3
              // );
            })
            .catch((err) => {
              console.error(err);
            });
        });
    },
  },
  created() {
    this.getVehicle();
    this.getInfo();
  },
};
</script>

<style scoped>
* {
  color: #0d47a1;
  font-family: "Phetsarath OT";
}
#card_img_qr {
  width: 120px;
}
.default {
  cursor: default;
}
#remove_border {
  border: none;
}
.status {
  border: none;
  text-align: center;
  vertical-align: center;
}
#card {
  background-color: #e4e9f4;
  text-align: center;
}
#card_details {
  background-color: #fff;
  border: none;
}
#card_stt_result {
  background-color: #fff;
  border-radius: 5px;
  padding: 0px 10px 0px 10px;
}
th {
  font-size: 12px;
}
th,
td {
  border: 0.1px solid #000;
  color: #000;
  /* text-align: center; */
}

.status {
  border: none;
  text-align: center;
  vertical-align: center;
}
#emac_id_text {
  border: none;
}
#emac_id {
  background-color: #e4e9f4;
  border: none;
  text-align: center;
}
#detail_result {
  font-size: 14px;
  background-color: #e4e9f4;
  color: #2b34a5;
  text-align: center;
}
.status_detail {
  border-radius: 5px;
  border: none;
  background-color: #e4e9f4;
}
#status_detail_qr {
  border: none;
}
#detail_result_in {
  font-size: 12px;
}
#labels {
  padding: 5px;
  background-color: #e4e9f4;
}
#bottom_part {
  page-break-inside: avoid;
  page-break-after: auto;
}
@media print {
  table {
    page-break-after: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  td {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  .head {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  * {
    font-size: 14px;
  }
  .print_break {
    page-break-after: always;
  }
  #status_detail_qr {
    border: none;
  }
  #card_img_qr {
    width: 60px;
  }
  span {
    font-size: 14px;
  }

  #title_h {
    font-size: 10px;
  }
  .status_detail {
    border-radius: 5px;
    border: none;
    background-color: #e4e9f4;
  }
  th,
  td {
    font-size: 9px;
    border: 0.5px solid #717171;
    color: #717171;
    /* text-align: center; */
  }
  #bt_des {
    font-size: 10px;
  }
  #emac_id_text {
    font-size: 10px;
    width: 180px;
  }
  #emac_id {
    font-size: 10px;
  }
  #lable {
    font-size: 10px;
  }
  #title {
    font-size: 10px;
  }
  #in_fill {
    font-size: 10px;
  }
  #status_detail_qr {
    border: none;
  }
  #card_stt_detail {
    font-size: 6px;
  }
  #card_stt_detail_in {
    font-size: 5px;
  }
  #card_stt_result {
    font-size: 7px;
  }
  #detail_result_in {
    font-size: 6px;
  }
  #tb_result {
    font-size: 10px;
  }
}
</style>

