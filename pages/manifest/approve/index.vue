<template>
  <div>
    <div v-if="this.loading == true">
      <loading />
    </div>
    <dir v-else id="body">
      <div id="bg" class="mt-4 mx-16">
        <div>
          <v-row>
            <v-col cols="2">
              <img src="@/assets/image/emac-logo.png" alt="" width="100" />
            </v-col>
            <v-col>
              <center id="docHeader" class="mr-6">
                <h2 class="text-uppercase">Uniform Waste Manifest</h2>
                <p>ໃບຕິດຕາມການຂົນສົ່ງສິ່ງເສດເຫຼືອ</p>
              </center>
            </v-col>
            <v-col class="d-flex justify-end" cols="2">
              <dir>
                <!-- <v-img width="100" :src="main_qr" /> -->
              </dir>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5" align-self="end">
              <v-row>
                <table style="width: 338px">
                  <tbody>
                    <tr>
                      <td id="detail_left">
                        <span id="text_print_l" class="text-uppercase"
                          >Manifest Status:</span
                        >
                      </td>
                      <td rowspan="2" id="detail_left_result">
                        <div v-for="(i, index) in tagStatus" :key="index">
                          <div v-if="manifest_stt == i.status">
                            <b id="detail_left_result_in">
                              {{ i.name.toUpperCase() }}
                            </b>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td id="detail_left">
                        <span id="text_print_l"
                          >ສະຖານະໃບຕິດຕາມການຂົນສົ່ງ :</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
                <v-col id="docHeader" cols="6">
                  <v-row> </v-row>
                </v-col>
                <v-col> </v-col>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-row class="d-flex justify-end">
                <table style="width: 600px">
                  <tbody>
                    <tr v-if="this.tos == 'NHz'">
                      <td class="text-uppercase" id="detail_right">
                        ປະເພດໃບຕິດຕາມການຂົນສົ່ງ/Manifest TYPE :
                      </td>
                      <td id="detail_right_result">NON-HAZARDOUS</td>
                    </tr>
                    <tr v-else-if="this.tos == 'Hz'">
                      <td class="text-uppercase" id="detail_right">
                        ປະເພດໃບຕິດຕາມການຂົນສົ່ງ/Manifest TYPE :
                      </td>
                      <td id="detail_right_result">HAZARDOUS</td>
                    </tr>
                    <tr>
                      <td class="text-uppercase" id="detail_right">
                        ເລກທີໃບຕິດຕາມການຂົນສົ່ງ/Manifest NO :
                      </td>
                      <td id="detail_right_result">
                        {{ this.data.manifest_no }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-uppercase" id="detail_right">
                        ວັນທີສ້າງໃບຕິດຕາມການຂົນສົ່ງ/Request DATE:
                      </td>
                      <td id="detail_right_result">
                        {{ this.data.manifest_date }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-uppercase" id="detail_right">
                        ວັນທີເຮັດການຂົນສົ່ງ/relocate date :
                      </td>
                      <td id="detail_right_result">
                        {{ this.data.relocate_date }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-row>
            </v-col>
          </v-row>

          <h2 id="docHeader" class="mt-2 text-uppercase">
            ຜູ້ສ້າງສິ່ງເສດເຫຼືອ / Waste Generator
          </h2>
          <v-divider class="mb-4" style="border: 1px solid blue"> </v-divider>
          <page-generator
            :note="note"
            :data_wg="data_wg"
            :wg_stt="wg_stt"
            :waste_operations="waste_operations"
            :address="data_vill"
            :tracking="false"
          />
          <h2 id="docHeader" class="mt-4 text-uppercase">
            ຜູ້ຂົນສົ່ງສິ່ງເສດເຫຼືອ / Waste Transporter
          </h2>
          <v-divider class="mb-4" style="border: 1px solid blue"> </v-divider>
          <page-transporter
            :data_wt="data_wt"
            :data_vill_wt1="data_vill_wt1"
            :data_vill_wt2="data_vill_wt2"
            :data_vill_wt3="data_vill_wt3"
            :wt_status="this.data.wt_stt"
          />
          <h2 id="docHeader" class="mt-4 text-uppercase">
            ຜູ້ບໍາບັດ-ກຳຈັດສິ່ງເສດເຫຼືອ / Waste Disposal
          </h2>
          <v-divider class="mb-4" style="border: 1px solid blue"> </v-divider>
          <page-disposal
            :data_wd="data_wd"
            :address="data_vill_wd"
            :wd_status="wd_stt"
            :waste_operations="waste_operations"
          />
          <h2 id="docHeader" class="mt-4 text-uppercase">
            ຜູ້ຕິດຕາມກວດກາ / Waste Regulator
          </h2>
          <v-divider class="mb-4" style="border: 1px solid blue"> </v-divider>
          <v-row>
            <v-col align-self="center">
              <!-- <h3 id="title_h" class="text-uppercase">
          1. ຜູ້ບໍາບັດ-ກຳຈັດສິ່ງເສດເຫຼືອ / Waste Disposal Information
        </h3> -->
            </v-col>
            <v-col cols="6">
              <table style="width: 100%">
                <tbody>
                  <tr>
                    <td id="emac_id_text">
                      <span id="lable"
                        >ເລກປະຈໍາຕົວຜູ້ຄອບຄອງສິ່ງເສດເຫຼືອ/EMC ID :
                      </span>
                    </td>
                    <td id="emac_id">
                      <b id="emac_id">
                        <!-- {{ this.emcr }} -->
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>
          <v-row id="bottom_part">
            <v-col cols="8">
              <p id="bt_des">
                ຂ້າພະເຈົ້າຂໍຮັບຮອງວ່າມີການຈັດຕັ້ງປະຕິບັດຂອງຜູ້ກ່ຽວໃນໃບຕິດຕາມການຂົນສົ່ງສິ່ງເສດເຫຼືອສະບັບນີ້
                ຈື່ງລົງນາມໄວ້ເພື່ອຢັ້ງຢືນ ແລະ ບັນທືກເຂົ້າຖານຂໍ້ມູນຕາມຂັ້ນຕອນ
              </p>
            </v-col>
            <v-col cols="4">
              <v-card class="" id="card" flat>
                <table id="card_content" class="pa-1" style="width: 100%">
                  <tr>
                    <td style="width: 65%" id="remove_border">
                      <table style="width: 100%">
                        <tr>
                          <td id="remove_border">
                            <b id="card_stt_detail">ສະຖານະ / STATUS</b>
                          </td>

                          <td class="status" v-if="this.data.wr_stt == 0">
                            <b id="card_stt_result" class="text-uppercase">
                              Draft
                            </b>
                          </td>
                          <td
                            color="#7864CC"
                            class="status"
                            v-else-if="
                              this.data.wg_stt +
                                this.data.wd_stt +
                                this.data.wt_stt ==
                              3
                            "
                          >
                            <b id="card_stt_result" class="text-uppercase">
                              Process
                            </b>
                          </td>
                          <td
                            color="#7864CC"
                            class="status"
                            v-else-if="
                              this.data.wg_stt +
                                this.data.wd_stt +
                                this.data.wt_stt ==
                              5
                            "
                          >
                            <b id="card_stt_result" class="text-uppercase">
                              Process
                            </b>
                          </td>
                          <td
                            color="#7864CC"
                            class="status"
                            v-else-if="
                              this.data.wg_stt +
                                this.data.wd_stt +
                                this.data.wt_stt ==
                              8
                            "
                          >
                            <b id="card_stt_result" class="text-uppercase">
                              Process
                            </b>
                          </td>
                          <td
                            color="#7864CC"
                            class="status"
                            v-else-if="
                              this.data.wg_stt +
                                this.data.wd_stt +
                                this.data.wt_stt ==
                              9
                            "
                          >
                            <b id="card_stt_result" class="text-uppercase">
                              Approval
                            </b>
                          </td>
                          <td
                            color="#7864CC"
                            class="status"
                            v-else-if="this.data.wr_stt"
                          >
                            <b id="card_stt_result" class="text-uppercase">
                              Certified
                            </b>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td id="status_detail_qr" rowspan="3">
                      <v-img class="mx-auto" id="card_img_qr" />
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
                            <b id="detail_result_in"> {{ user }} </b>
                          </td>
                        </tr>
                        <tr>
                          <td id="remove_border" style="width: 35px">
                            <b id="card_stt_detail">ວັນທີ</b>
                          </td>
                          <td class="status_detail">
                            <b id="detail_result_in"></b>
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
      <div>
        <v-card-actions class="mx-4 my-6">
          <v-spacer></v-spacer>
          <v-btn
            v-if="this.data.wg_stt == 0"
            color="error"
            @click="dialog_reject = true"
          >
            Denied
          </v-btn>
          <v-btn v-if="this.data.wg_stt == 0" color="success" @click="approve">
            approve
          </v-btn>
          <v-btn outlined color="primary" class="mx-4 my-4" @click="back">
            back
          </v-btn>
        </v-card-actions>

        <v-dialog persistent v-model="dialog_reject" max-width="600px">
          <v-card class="pa-6">
            <h3>Description</h3>
            <v-divider class="my-2"></v-divider>
            <v-textarea
              v-model="description"
              placeholder="Description"
              outlined
              rows="5"
            ></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="primary" @click="dialog_reject = false">
                Cancel
              </v-btn>
              <v-btn @click="rejected" color="error">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </dir>
  </div>
</template>

<script>
import PageGenerator from "~/components/manifest/pageGenerator.vue";
import PageTransporter from "~/components/manifest/pageTransporter.vue";
import PageDisposal from "~/components/manifest/pageDisposal.vue";
import updateManifest from "~/gql/mutations/manifest/update_manifest_status";
import gql from "graphql-tag";
import Loading from "~/components/loading.vue";
const Swal = require("sweetalert2");

export default {
  components: {
    PageGenerator,
    PageTransporter,
    PageDisposal,
    Loading,
  },
  data() {
    return {
      tagStatus: [
        { status: 0, name: "Draft", color: "grey" },
        { status: 1, name: "Requested", color: "#7864CC" },
        { status: 2, name: "Requested", color: "#7864CC" },
        { status: 3, name: "Ready", color: "#3423E2" },
        { status: 5, name: "WT Processing", color: "warning" },
        { status: 8, name: "WD Processing", color: "warning" },
        { status: 9, name: "Completed", color: "#FF8500" },
        { status: 10, name: "Certified", color: "#56CC4A" },
        { status: 11, name: "WT Denied", color: "error" },
        { status: 12, name: "WD Denied", color: "error" },
        { status: 21, name: "Unapprove", color: "error" },
        { status: 22, name: "WT Rejected", color: "error" },
        { status: 24, name: "WD Rejected", color: "error" },
        { status: 100, name: "WS Denied", color: "error" },
        { status: 102, name: "Expired", color: "#000000" },
      ],
      description: "",
      loading: false,
      id: this.$route.query.id,
      data: [],
      data_wg: [],
      data_wt: {},
      vill_id: 10101,
      data_vill: "",
      wg_stt: 0,
      note: "",
      waste_operations: [],
      vill_wt1: 10101,
      data_vill_wt1: "",
      address_wt1: [],
      transporter_operations_1: {},
      vehicle_1: {},
      vill_wt2: 10101,
      data_vill_wt2: "",
      address_wt2: [],
      transporter_operations_2: {},
      vill_wt3: 10101,
      data_vill_wt3: "",
      address_wt3: [],
      transporter_operations_3: {},
      data_wd: [],
      data_vill_wd: "",
      vill_wd: 10101,
      address_wd: [],
      wd_stt: 0,
      main_status: 0,
      manifest_stt: 0,
      r_d: [],
      r_d_code: [["-"]],
      user: "",
      tos: "",
      dialog_reject: false,
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    rejected() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${updateManifest.updateManifest}
          `,
          variables: {
            id: this.id,
            wg_stt: 100,
            ws_user: this.$nuxt.$fire.auth.currentUser?.uid,
            message: this.description,
          },
        })
        .then((data) => {
          // console.log("data :>> ", data);
          Swal.fire({
            title: "Success!",
            text: "Manifest Rejected",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/manifest/manifest_approval";
            }
          });
        })
        .catch(() => {
          let text = "Can't connect to server \n Please try again";
          if (confirm(text) == true) {
            window.location.href = "/manifest/approve_manifest";
          } else {
            return false;
          }
        });
    },
    approve() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${updateManifest.updateManifest}
          `,
          variables: {
            id: this.id,
            ws_user: this.$nuxt.$fire.auth.currentUser.uid,
            wg_stt: 1,
          },
        })
        .then((data) => {
          Swal.fire({
            title: "Success!",
            text: "Manifest Approved",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/manifest/manifest_approval";
            }
          });
        });
    },
    async getManifestById() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/manifest/getMId").getMId,
          variables: {
            id: this.id ? this.id : 0,
          },
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.data = data.data.manifest[0];
          this.tos = this.data.type_of_service.name_short;
          this.wd_stt = this.data.wd_stt;
          this.data_wd = this.data.disposal;
          this.data_vill_wd = this.data_wd.custom_address;
          this.data_wg = data.data.gen[0];
          this.vill_id = this.data_wg.vill_id;
          this.wg_stt = this.data.wg_stt;
          this.data_wt = this.data.transporter_operations;
          this.data_vill_wt1 = this.data_wt[0]?.transporter?.custom_address;
          this.data_vill_wt2 = this.data_wt[1]?.transporter?.custom_address;
          this.data_vill_wt3 = this.data_wt[2]?.transporter?.custom_address;
          this.waste_operations = this.data.waste_operations;
          const checkR_D = this.waste_operations.length;
          // console.log("checkR_D :>> ", checkR_D);

          if (checkR_D > 0) {
            const fakeCode = [["-"]];
            for (let i = 0; i < checkR_D; i++) {
              this.waste_operations[i].r_d = fakeCode;
            }
          } else {
            for (let i = 0; i < checkR_D; i++) {
              const fakeCode = [["-"]];

              for (let i = 0; i < checkR_D; i++) {
                this.waste_operations[i].r_d = fakeCode;
              }
            }
          }
          // if (checkR_D > 0) {
          //   // this.r_d = this.waste_operations.map((item) => {
          //   //   return item;
          //   // });

          //   console.log("this.r_d :>> ", this.r_d);

          //   // for (let i = 0; i <= checkR_D; i++) {
          //   //   this.waste_operations[i].r_d = this.r_d[i];
          //   // }
          // } else {
          //   for (let i = 0; i <= checkR_D; i++) {
          //     this.waste_operations[i].r_d = this.r_d[i];
          //   }
          // }

          this.note = this.data.note;

          this.vill_wd = this.data.disposal.vill_id;

          if (this.data_wt.length > 0) {
            this.vill_wt1 =
              this.data.transporter_operations[0].transporter.vill_id;

            // this.transporter_operations_1 = this.data_wt[0]
            // console.log('this.transporter_operations_1 :>> ', this.transporter_operations_1)
            if (this.data.transporter_operations.length == 2) {
              this.vill_wt2 =
                this.data.transporter_operations[1].transporter.vill_id;
              // this.transporter_operations_2 =
              //   this.data.transporter_operations[1].vehicle
            }
            if (this.data.transporter_operations.length == 3) {
              this.vill_wt3 =
                this.data.transporter_operations[2].transporter.vill_id;
              // this.transporter_operations_3 = this.data.transporter_operations[2].vehicle
            }
          }

          this.manifest_stt =
            this.data.wg_stt +
            this.data.wt_stt +
            this.data.wd_stt +
            this.data.wr_stt;

          //   console.log('this.transporters :>> ', this.transporters);
          this.data.manifest_stt = this.manifest_stt;

          this.getCustomAddress();
        });
      // .catch((err) => {
      //   let text = "Can't connect to server \n Please try again";
      //   if (confirm(text) == true) {
      //     window.location.reload();
      //   } else {
      //     return false;
      //   }
      // });
    },
    async getCustomAddress() {
      this.$apollo
        .query({
          query: require("~/gql/queries/manifest/getCustomAddress")
            .getCustomAddress,
          variables: {
            id: this.vill_id,
          },
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.address = data.data.emac_villages[0];
          // console.log('this.address :>> ', this.address)
          if (this.address.vill_id >= 1901001) {
            this.data_vill = this.address.vill_name_lo;
          } else {
            this.data_vill =
              this.address.vill_name_lo +
              ", " +
              this.address.district.dr_name_lo +
              ", " +
              this.address.district.province.pr_name_lo;
          }

          // console.log("this.data_vill :>> ", this.data_vill);
        });
    },
    // .catch((err) => {
    //   let text = "Can't connect to server \n Please try again";
    //   if (confirm(text) == true) {
    //     window.location.reload();
    //   } else {
    //     return false;
    //   }
    // });
  },

  created() {
    this.loading = true;
    this.getManifestById();
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    // console.log('this.$store.state :>> ', this.$store.state);
    // console.log('object :>> ', this.$nuxt.$fire.auth.currentUser.uid);
  },
  computed: {
    main_statuses() {
      this.main_status =
        this.data.wd_stt +
        this.data.wt_stt +
        this.data.wg_stt +
        this.data.wr_stt;
      return this.main_status;
    },
  },
};
</script>

<style scoped>
@page {
  size: 21cm 29.7cm;
  margin: 30mm 45mm 30mm 45mm;
  /* change the margins as you want them to be. */
}

#bg {
  background-color: white;
}
.print-break-page {
  page-break-after: always;
}
#docHeader {
  color: #2b34a5;
}
#card {
  background-color: #e4e9f4;
  text-align: center;
  color: #2b34a5;
}
#text_print {
  font-size: 14px;
  color: #2b34a5;
}
#emac_id {
  background-color: #e4e9f4;
  border: none;
  text-align: center;
  padding: 0px 10px;
  color: #2b34a5;
}
#detail_right {
  font-size: 14px;
  width: 320px;
  color: #2b34a5;
  text-align: right;
}
#detail_right_result {
  font-weight: bold;
  font-size: 14px;
  width: 180px;
  background-color: #e4e9f4;
  color: #2b34a5;
  text-align: center;
}
#detail_left_result {
  width: 180px;
  background-color: #e4e9f4;
  text-align: center;
  color: #2b34a5;
}
#detail_left {
  width: 180px;
  text-align: right;
}
.status_detail {
  width: 100%;
  border-radius: 5px;
  /* border: none; */
  background-color: #e4e9f4;
}
#text_print_l {
  font-size: 14px;
  color: #2b34a5;
  text-align: left;
}
#card_img_qr {
  width: 120px;
}
#remove_border {
  border: none;
}
#status_detail_qr {
  border: none;
}
.status {
  /* border: none; */
  text-align: center;
  vertical-align: center;
}
#emac_id_text {
  border: none;
  color: #2b34a5;
}
#detail_result_in {
  font-size: 12px;
}
#card_stt_result {
  border-radius: 5px;
  background-color: #fff;
  padding: 0px 10px 0px 10px;
}

#card_details {
  background-color: #fff;
  border: none;
}

@media print {
  #print {
    display: none;
  }
  #card_stt_result {
    font-size: 7px;
  }
  #alert_status {
    width: 50;
  }
  #card_img_qr {
    width: 60px;
  }
  th,
  td {
    /* border: 2px solid #2b34a5; */
    font-size: 9px;
    color: #2b34a5;
  }
  #emac_id {
    background-color: #e4e9f4;
    border: none;
    font-size: 10px;
    text-align: center;
    padding: 0px 20px;
    color: #2b34a5;
  }
  #lable {
    font-size: 10px;
  }

  #text_print {
    font-size: 8px;
  }
  #detail_right {
    font-size: 10px;
    width: 340px;
    color: #2b34a5;
    text-align: right;
  }
  #detail_right_result {
    font-weight: bold;
    font-size: 8px;
    width: 140px;
    background-color: #e4e9f4;
    color: #2b34a5;
    text-align: center;
  }
  #detail_left {
    width: 350px;
  }
  #text_print_l {
    font-size: 12px;
    color: #2b34a5;
    text-align: left;
  }
  #detail_left_result {
    width: 280px;
    background-color: #e4e9f4;
    text-align: center;
    color: #2b34a5;
  }
  #detail_left_result_in {
    font-size: 14px;
  }
  table {
    display: block;
    page-break-inside: avoid;
  }
  #emac_id_text {
    font-size: 10px;
    width: 100%;
  }
  #bt_des {
    font-size: 10px;
  }
  #card {
    /* background-color: #e4e9f4; */
    text-align: center;
  }
  #card_stt_detail {
    width: 100%;
    font-size: 6px;
    padding: 0px 8px 0px 0px;
  }
  #detail_result_in {
    font-size: 6px;
  }
  #bottom_part {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  #body {
    margin-top: -30px;
  }
}
/* #laos {
  font-family: 'Phetsarath_OT' !important;
} */
</style>