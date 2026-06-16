import Swal from "sweetalert2";
export default {
  name: "DefaultLayout",
  data() {
    return {
      // clipped: false,
      // total_catalog_management: 0,
      //   total_alert: 0,
      total: 0,
      amount: 0,
      amount_catalog: 0,
      waste_catalog_approved: 0,
      requestQuota: 0,
      requestTime: 0,
      extended_request: 0,
      catalog_extension_tracking_count: 0,
      request_to_add_categories: 0,
      topup_requests: 0,
      data_manifest: [],
      locale: "",
      data: [],
      version: "1.0.2",
      drawer: true,
      fixed: false,
      fab: false,
      // maniVariant: false,
      // right: true,
      // rightDrawer: false,
      title: "",
      items_lang: [
        { icon: "", title: "Lao", lang: "la" },
        { icon: "", title: "Eng", lang: "en" },
      ],
      items: [],
      items_2: [
        {
          icon: "  mdi-chart-arc",
          title: `${this.$t("data_entry_log_recording_system")}`,
          to: "/data_entry_log_recording_system",
        },
        {
          icon: "  mdi-code-array",
          title: `${this.$t("manage_r_and_d_code")}`,
          to: "/manage_r_and_d_code/",
        },
        {
          icon: "  mdi-credit-card",
          title: `${this.$t("top_up_emac_ims_system_credit")}`,
          to: "/top_up_emac_ims_system_credit",
        },
        {
          icon: "mdi-file-document",
          title: `${this.$t("report")}`,
          to: "/report",
        },
      ],
      items_3: {
        icon: " mdi-cog",
        title: `${this.$t("settings")}`,
        to: "/settings",
      },
      items_4: {
        icon: " mdi-shape-outline",
        title: `${this.$t("manage_waste_categories")}`,
        to: "/manage_waste_categories",
      },
      items_mul: [
        {
          action: "mdi-text-box-check-outline",
          active: false,
          amount: 0,
          items: [
            { title: `${this.$t("waste_catalog")}`, to: "/waste_catalog/" },
            {
              title: `${this.$t("waste_catalog_approved")}`,
              to: "/waste_catalog_approved",
              amount: 0,
            },
            {
              title: `${this.$t("catalog_extended_request")}`,
              to: "/catalog_extended_request",
              amount: 0,
            },
            {
              title: `${this.$t("catalog_extension_tracking")}`,
              to: "/catalog_extension_tracking",
              amount: 0,
            },
            {
              title: `${this.$t("request_to_add_categories")}`,
              to: "/request_to_add_categories",
              amount: 0,
            },
            {
              title: `${this.$t("waste_category_names")}`,
              to: "/waste_category_names",
            },
          ],
          title: `${this.$t("waste_catalog_management")}`,
        },
      ],
      items_mul_2: [],
      items_mul_3: [
        {
          action: "mdi-text-box-plus-outline",
          color: "success",
          active: false,
          amount: this.amount,
          items: [
            {
              title: `${this.$t("manifest_tracking")}`,
              to: "/manifest/manifest_tracking",
            },
            {
              title: `${this.$t("manifest_approval")}`,
              to: "/manifest/manifest_approval",
              amount: this.amount,
            },
            {
              title: "Manifest Uncompleted",
              to: "/manifest/uncompleted",
            },
            {
              title: "Manifest History",
              to: "/manifest/history",
            },
          ],
          title: `${this.$t("manifest_management")}`,
        },
      ],
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    async getToken() {
      const result = await $nuxt.$fire.auth.currentUser
        .getIdTokenResult()
        .catch((err) => console.log(err));
      this.token = result.token;
      // console.log('this.token :>> ', this.token);
      localStorage.setItem("token", this.token);
      document.cookie = "token=" + this.token;
      // await window.location.reload()
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 500;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    getData() {
      this.uid = this.$nuxt.$fire.auth.currentUser.uid;
      this.$apollo
        .query({
          query: require("~/gql/queries/getUserInfo").getUserInfo,
          variables: {
            uuid: this.uid,
          },
        })
        .then((data) => {
          this.data = data.data.emac_users[0];
        });
    },
    changeLanguage(l) {
      // this.locale = this.locale === "en" ? "la" : "en";
      localStorage.setItem("lang", l);

      // console.log("localStorage.getItem :>> ", localStorage.getItem("lang"));
      const lang = localStorage.getItem("lang");
      this.$i18n.locale = lang;
      Swal.fire({
        icon: "success",
        title: "Language changed",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
    },
    checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
    hasExtensionRequest(item, type) {
      return (item.extension_operations || []).some(
        (operation) => operation.extended_type === type
      );
    },
    daysUntilExpire(item) {
      if (!item.expire_date) return Number.MAX_SAFE_INTEGER;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expireDate = new Date(item.expire_date);
      expireDate.setHours(0, 0, 0, 0);

      return Math.floor((expireDate.getTime() - today.getTime()) / 86400000);
    },
    quotaUsedPercent(item) {
      const quotaAmount = Number(item.quota_amount || 0);
      const remainingAmount = Number(item.remaining_amount || 0);

      if (!quotaAmount) return 0;

      return ((quotaAmount - remainingAmount) / quotaAmount) * 100;
    },
    matchesCatalogExtensionReminder(item, type) {
      if (type === "Time extended") {
        const days = this.daysUntilExpire(item);
        return (
          [1, 2].includes(Number(item.status)) &&
          days >= 0 &&
          days <= 30 &&
          !this.hasExtensionRequest(item, "Time extended")
        );
      }

      return (
        [1, 4].includes(Number(item.status)) &&
        this.quotaUsedPercent(item) >= 90 &&
        !this.hasExtensionRequest(item, "Quota extended")
      );
    },
    countCatalogExtensionReminderActions(records) {
      const timeCount = records.filter((item) =>
        this.matchesCatalogExtensionReminder(item, "Time extended")
      ).length;
      const quotaCount = records.filter((item) =>
        this.matchesCatalogExtensionReminder(item, "Quota extended")
      ).length;

      return timeCount + quotaCount;
    },
  },
  mounted() {
    this.getToken(), this.getData(), this.checkLanguage();
    this.items = [
      {
        icon: " mdi-view-dashboard",
        title: `${this.$t("dashboard")} `,
        to: "/",
      },
      {
        icon: " mdi-domain",
        title: `${this.$t("organizations_dashboard")}`,
        to: "/company_management",
      },
    ];
    //==================================================================================================
    // items_2
    this.$apollo
      .query({
        query: require("~/gql/queries/topup/getTopup.gql").getTopup,
      })
      .then((res) => {
        this.topup_requests = res.data.emac_topup_requests.length;
        //   console.log("🚀 ~ file: default_layout.js:192 ~ .then ~ this.topup_requests", this.topup_requests)
        this.items_2 = [
          {
            icon: "  mdi-chart-arc",
            title: `${this.$t("data_entry_log_recording_system")}`,
            to: "/data_entry_log_recording_system",
          },
          {
            icon: "  mdi-code-array",
            title: `${this.$t("manage_r_and_d_code")}`,
            to: "/manage_r_and_d_code/",
          },
          {
            icon: "  mdi-credit-card",
            title: `${this.$t("top_up_emac_ims_system_credit")}`,
            to: "/top_up_emac_ims_system_credit",
            amount: this.topup_requests,
          },
          {
            icon: "mdi-file-document",
            title: `${this.$t("report")}`,
            to: "/report",
          },
        ];
      });

    //==================================================================================================

    (this.items_3 = {
      icon: " mdi-cog",
      title: `${this.$t("settings")}`,
      to: "/settings",
    }),
      (this.items_4 = {
        icon: " mdi-shape-outline",
        title: `${this.$t("manage_waste_categories")}`,
        to: "/manage_waste_categories",
      }),
      (this.items_mul_2 = [
        {
          action: " mdi-source-fork",
          active: false,
          items: [
            { title: `${this.$t("waste_generator")}`, to: "/waste_generator" },
            {
              title: `${this.$t("waste_transporter")}`,
              to: "/waste_transporter",
            },
            { title: `${this.$t("waste_disposal")}`, to: "/waste_disposal" },
            { title: `${this.$t("waste_regulator")}`, to: "/waste_regulator" },
            { title: `${this.$t("waste_staff")}`, to: "/waste_staff" },
          ],

          title: `${this.$t("system_stake_holder_management")}`,
        },
      ]),
      //==================================================================================================
      // items_mul_3
      this.$apollo
        .query({
          query: require("~/gql/queries/manifest/getManifest")
            .getManifestApproveSubCount,

          variables: {
            where: {
              _and: [
                {
                  wg_stt: {
                    _eq: 0
                  }
                }
              ]
            }
          }
        })
        .then((data) => {
          this.amount = data.data.emac_manifests_aggregate.aggregate.count;
          this.items_mul_3 = [
            {
              action: "mdi-text-box-plus-outline",
              color: "success",
              new: true,
              active: false,
              amount: this.amount,
              items: [
                {
                  title: `${this.$t("manifest_tracking")}`,
                  to: "/manifest/manifest_tracking",
                },
                {
                  title: `${this.$t("manifest_approval")}`,
                  to: "/manifest/manifest_approval",
                  amount: this.amount,
                },
                {
                  title: "Manifest Uncompleted",
                  to: "/manifest/uncompleted",
                },
                {
                  title: "Manifest History",
                  to: "/manifest/history",
                },
              ],

              title: `${this.$t("manifest_management")}`,
            },
          ];
        });
    //==================================================================================================
    // items_mul
    this.$apollo
      .query({
        query: require("~/gql/queries/waste_catalog/getWasteCatalog")
          .getWasteCatalogN,
      })
      .then((data) => {
        this.waste_catalog_approved = data.data.emac_catalogs.length;

        // console.log(
        //   "🚀 ~ file: default_layout.js:273 ~ .then ~  this.waste_catalog_approved",
        //   this.waste_catalog_approved
        // );

        this.$apollo
          .query({
            query:
              require("~/gql/queries/waste_categories/wasteCatagoriesExtend")
                .wasteCatagoriesTimeQuotaExtend,
            variables: {
              status: 5,
            },
          })
          .then((data) => {
            this.requestQuota = data.data.emac_catalog_operations.length;
            this.$apollo
              .query({
                query:
                  require("~/gql/queries/waste_categories/wasteCatagoriesExtend")
                    .wasteCatagoriesTimeExtend,
                variables: {
                  status: 3,
                },
              })
              .then((data) => {
                this.requestTime = data.data.emac_catalog_operations.length;
                this.extended_request = this.requestQuota + this.requestTime;
                this.$apollo
                  .query({
                    query:
                      require("~/gql/queries/waste_categories/wasteCatagoriesExtend_q")
                        .wasteCatagoriesExtendQuery,
                    variables: {
                      status: 0,
                    },
                  })
                  .then(async (data) => {
                    this.request_to_add_categories =
                      data.data.emac_catalog_operations.length;
                    // console.log("🚀 ~ file: default_layout.js:377 ~ .then ~ this.request_to_add_categories", this.request_to_add_categories)

                    try {
                      const currentYear = new Date().getFullYear();
                      const reminderData = await this.$apollo.query({
                        query: require("~/gql/queries/waste_categories/catalogExtensionReminder.gql")
                          .catalogExtensionReminder,
                        variables: {
                          operationStatuses: [1, 2, 4],
                          startDate: `${currentYear}-01-01`,
                          endDate: `${currentYear}-12-31`,
                        },
                      });

                      this.catalog_extension_tracking_count =
                        this.countCatalogExtensionReminderActions(
                          reminderData.data.emac_catalog_operations || []
                        );
                    } catch (err) {
                      console.log(
                        "catalog extension tracking badge error",
                        err
                      );
                      this.catalog_extension_tracking_count = 0;
                    }

                    this.amount_catalog =
                      this.waste_catalog_approved +
                      this.extended_request +
                      this.request_to_add_categories +
                      this.catalog_extension_tracking_count;

                    this.total =
                      this.amount +
                      this.amount_catalog +
                      this.items_2[2].amount;

                    //   console.log('this.total :>> ', this.total);

                    this.items_mul = [
                      {
                        action: "mdi-text-box-check-outline",
                        active: false,
                        amount: this.amount_catalog,
                        items: [
                          {
                            title: `${this.$t("waste_catalog")}`,
                            to: "/waste_catalog/",
                          },
                          {
                            title: `${this.$t("waste_catalog_approved")}`,
                            to: "/waste_catalog_approved",
                            amount: this.waste_catalog_approved,
                          },
                          {
                            title: `${this.$t("catalog_extended_request")}`,
                            to: "/catalog_extended_request",
                            amount: this.extended_request,
                          },
                          {
                            title: `${this.$t("catalog_extension_tracking")}`,
                            to: "/catalog_extension_tracking",
                            amount: this.catalog_extension_tracking_count,
                          },
                          {
                            title: `${this.$t(
                              "request_to_add_categories"
                            )}`,
                            to: "/request_to_add_categories",
                            amount: this.request_to_add_categories,
                          },
                          {
                            title: `${this.$t("waste_category_names")}`,
                            to: "/waste_category_names",
                          },
                        ],
                        title: `${this.$t("waste_catalog_management")}`,
                      },
                    ];
                  });
              });
          });
      });
    //==================================================================================================
  },
};
