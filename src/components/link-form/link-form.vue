<template>
  <div class="link-form">
    <a
      target="_self"
      :id="link.id"
      :key="link.id"
      :href="link.href"
      :title="link.href"
      class="btn link-url"
      role="button"
      @click="onClick"
      :style="{
        backgroundColor: backgroundColor,
        color: color + ' !important',
      }"
      >{{ link.name }}
    </a>
  </div>
</template>

<style lang="scss" src="./link-form.scss"></style>
<script src="./link-form.ts"></script>
