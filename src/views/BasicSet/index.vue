<template>
  <div class="base-info">
   
    <section class="base-info-right">

      <router-view></router-view>
    </section>
  </div>
</template>
<script>

export default {
  name: "base-info",

}
</script>
<style lang="scss">
.base-info-right {
  height: 100%;
}
</style>
