<script lang="ts" setup>
import type { InsertLocationLog } from "~/lib/db/schema";

import { CENTER_WORLD } from "~/lib/constants";

const route = useRoute();
const { currentLocation } = useLocationStore();

const { $csrfFetch } = useNuxtApp();

async function onSubmit(value: InsertLocationLog) {
  await $csrfFetch(`/api/locations/${route.params.slug}/add`, {
    method: "POST",
    body: value,
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: { slug: route.params.slug },
  });
}
</script>

<template>
  <LocationLogForm
    submit-label="Add Location Log"
    submit-icon="tabler:map-pin-plus"
    :on-submit="onSubmit"
    :on-submit-complete="onSubmitComplete"
    :initial-values="{
      name: '',
      description: '',
      startedAt: Date.now() - 24 * 60 * 60 * 1000,
      endedAt: Date.now(),
      lat: currentLocation?.lat || (CENTER_WORLD as [number, number])[1],
      long: currentLocation?.long || (CENTER_WORLD as [number, number])[0],
    }"
  />
</template>
