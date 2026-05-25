<template>
  <div>
    <h1>Export</h1>
    <v-btn @click="exportCSV()"> export</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { id: 1, name: "Foo" },
        { id: 1, name: "Foo" },
        { id: 1, name: "Foo" },
        { id: 1, name: "Foo" },
        { id: 1, name: "Foo" },
        { id: 1, name: "Foo" },
        { id: 1, name: "Foo" },
        { id: 1, name: "Foo" },
      ],
    };
  },
  methods: {
    convertToCSV(arr) {
      const array = [Object.keys(arr[0])].concat(arr);
      return array
        .map((it) => {
          return Object.values(it).toString();
        })
        .join("\n");
    },
    exportCSV() {
      const csvString = this.convertToCSV(this.data);
        const element = document.createElement("a");
        const file = new Blob([csvString], { type: "text/csv;charset=utf-8" });
        element.href = URL.createObjectURL(file);
        element.download = `${new Date()}.csv`;
        document.body.appendChild(element);
        element.click();
    },
  },
  mounted() {
   
  },
};
</script>

<style>
</style>