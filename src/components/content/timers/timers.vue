<template>
  <div id="timers">
    <van-field @click="toTimers(type)" :label="title" :value="valueData | setTimerType" readonly />
  </div>
</template>
    
<script>
export default {
  name: 'timers',
  props: {
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    valueData: {
      type: Date | Number,
      default: new Date().getTime()
    }
  },
  methods: {
    toTimers(type) {
      this.$router.push(`/selectTime/${type}`)
    }
  }
}
</script>
    
<style scoped>
</style>
