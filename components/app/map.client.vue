<script lang="ts" setup>
import { CENTER_WORLD } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => colorMode.value === "dark"
  ? "/styles/dark.json"
  : "https://tiles.openfreemap.org/styles/liberty");
const center = CENTER_WORLD;
const zoom = 1;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <div
          class="tooltip tooltip-top"
          :data-tip="point.label"
        >
          <Icon
            name="tabler:map-pin-filled"
            size="24"
            class="text-secondary"
          />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>
