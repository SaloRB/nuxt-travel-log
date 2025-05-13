<script setup lang="ts">
import { CENTER_WORLD } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

import LocationBaseForm from "./location-base-form.vue";

const props = defineProps<{
  submitLabel: string;
  submitIcon: string;
  initialValues?: InsertLocation;
  zoom?: number;
  onSubmit: (location: InsertLocation) => Promise<any>;
  onSubmitComplete: () => void;
}>();
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :initial-values="props.initialValues || {
      name: '',
      description: '',
      lat: (CENTER_WORLD as [number, number])[1],
      long: (CENTER_WORLD as [number, number])[0],
    }"
    :schema="InsertLocation"
    :submit-label
    :submit-icon
    :zoom="props.zoom || 6"
    :on-submit
    :on-submit-complete
  >
    <AppFormField
      label="Name"
      name="name"
      :error="errors.name"
      :disabled="loading"
    />

    <AppFormField
      label="Description"
      name="description"
      type="textarea"
      :error="errors.description"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>
