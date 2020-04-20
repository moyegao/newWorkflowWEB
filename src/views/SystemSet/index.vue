<template>
  <div class="system-set">
   
    <section class="system-set-right">

      <router-view></router-view>
    </section>
  </div>
</template>
<script>

export default {
  name: "system-set",

}
</script>
<style lang="scss">
.system-set-right {
  height: 100%;
}
</style>
