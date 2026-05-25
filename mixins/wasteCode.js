export default {
  methods: {
    isHazardousWaste(entryType) {
      return (entryType || '').trim().toUpperCase() === 'HZ'
    },

    formatWasteCode(code, entryType) {
      const rawCode = code || ''

      if (!rawCode) return ''
      if (!this.isHazardousWaste(entryType)) return rawCode
      if (rawCode.endsWith('*')) return rawCode

      return `${rawCode}*`
    },
  },
}
