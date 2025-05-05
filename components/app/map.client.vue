<script lang="ts" setup>
import { CENTER_WORLD } from "~/lib/constants";

const colorMode = useColorMode();
const style = computed(() => colorMode.value === "dark"
  ? "/styles/dark.json"
  : "https://tiles.openfreemap.org/styles/liberty");
const center = CENTER_WORLD;
const zoom = 1;
</script>

<template>
  <MglMap :map-style="style" :center="center" :zoom="zoom">
    <MglNavigationControl />
  </MglMap>
</template>
