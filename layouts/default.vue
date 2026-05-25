<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary fixed app width="300">
      <v-list>
        <div align="center">
          <img src="~/assets/image/emac-logo.png" alt="" width="60" />
          <h3>
            {{ this.data.name }}
          </h3>
        </div>
        <!-- Menu -->
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          v-for="item_mul_2 in items_mul_2"
          :key="item_mul_2.title"
          v-model="item_mul_2.active"
          :prepend-icon="item_mul_2.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item_mul_2.title }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item_mul_2.items"
            :key="child.title"
            :to="child.to"
          >
            <v-list-item-content>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item :to="items_4.to" router exact>
          <v-list-item-action>
            <v-icon>{{ items_4.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items_4.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>



        <v-list-group
          v-for="item in items_mul_3"
          :key="item.title"
          v-model="item.active"
          no-action
        >
          <v-badge
            slot="prependIcon"
            :content="item.amount"
            color="success"
            overlap
          >
            <v-icon>{{ item.action }}</v-icon>
          </v-badge>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.to"
          >
            <v-list-item-content>
              <v-list-item-title> {{ child.title }}</v-list-item-title>
            </v-list-item-content>
            <v-chip small v-if="child.amount > 0" color="success">{{
              child.amount
            }}</v-chip>
          </v-list-item>
        </v-list-group>



        <v-list-group
          v-for="item in items_mul"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <v-badge
            v-if="item.amount > 0"
            slot="prependIcon"
            :content="item.amount"
            color="success"
            overlap
          >
            <v-icon>{{ item.action }}</v-icon>
          </v-badge>

          <v-icon slot="prependIcon" v-else>{{ item.action }}</v-icon>

          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.to"
          >
            <v-list-item-content>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item-content>
            <v-chip small v-if="child.amount > 0" color="success">{{
              child.amount
            }}</v-chip>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-for="item_2 in items_2"
          :key="item_2.title"
          :to="item_2.to"
          router
          exact
        >
          <v-list-item-action>
            <v-badge
              v-if="item_2.amount > 0"
              slot="prependIcon"
              :content="item_2.amount"
              color="success"
              overlap
            >
              <v-icon>{{ item_2.icon }}</v-icon>
            </v-badge>
            <v-icon v-else>{{ item_2.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item_2.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Menu -->
      </v-list>

      <template v-slot:append>
        <v-list-item :to="items_3.to" router exact>
          <v-list-item-action>
            <v-icon>{{ items_3.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ items_3.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <v-app-bar id="print" fixed app>
      <!-- add badge -->
      <v-badge
        v-if="this.total > 0"
        class="mt-4"
        bordered
        color="success"
        overlap
        :content="total"
      >
        <v-app-bar-nav-icon @click="toggleDrawer" />
      </v-badge>
      <v-app-bar-nav-icon v-else @click="toggleDrawer" />

      <!-- <v-btn icon @click.stop="maniVariant = !maniVariant">
        <v-icon>mdi-{{ `chevron-${maniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-manus</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title v-text="title" /> -->
      <v-spacer />

      <v-img :src="items_lang[0].icon" width="60"></v-img>

      <v-menu offset-left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon>mdi-google-translate</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in items_lang" :key="index">
            <v-list-item-title>
              <v-btn text @click="changeLanguage(item.lang)">
                {{ item.title }}
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- <v-btn color="error" @click="$nuxt.$fire.auth.signOut()"> logout</v-btn> -->
      <img src="~/assets/image/emac-logo.png" alt="" width="40" />
      <!-- <img :src="items_lang[1].icon" alt="" width="40" /> -->
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>

    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      class="mr-4"
      id="print"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon> mdi-chevron-up</v-icon>
    </v-btn>

    <v-footer id="print" :absolute="!fixed" app>
      <span> v {{ version }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import default_layout from "~/mixins/default_layout.js";
export default {
  mixins: [default_layout],
};
</script>
<style>
@font-face {
  font-family: "Phetsarath_OT";
  src: url("../assets/Phetsarath_OT.ttf");
}
#app {
  font-family: "Phetsarath_OT";
}

@media print {
  #print {
    display: none;
  }
  * {
    font-size: 16px;
  }
}
#app {
  font-family: "Phetsarath OT";
}
</style>
