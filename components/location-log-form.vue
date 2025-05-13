<script setup lang="ts">
import { CENTER_WORLD } from "~/lib/constants";
import { InsertLocationLog } from "~/lib/db/schema";

import LocationBaseForm from "./location-base-form.vue";

const props = defineProps<{
  submitLabel: string;
  submitIcon: string;
  initialValues?: InsertLocationLog;
  onSubmit: (location: InsertLocationLog) => Promise<any>;
  onSubmitComplete: () => void;
}>();

const initialValues = {
  name: "",
  description: "",
  startedAt: Date.now() - 24 * 60 * 60 * 1000,
  endedAt: Date.now(),
  lat: (CENTER_WORLD as [number, number])[1],
  long: (CENTER_WORLD as [number, number])[0],
};
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :initial-values="props.initialValues || initialValues"
    :schema="InsertLocationLog"
    :submit-label
    :submit-icon
    :zoom="12"
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

    <AppDateFormField
      label="Started At"
      name="startedAt"
      :value="initialValues.startedAt"
      :error="errors.startedAt"
      :disabled="loading"
    />

    <AppDateFormField
      label="Ended At"
      name="endedAt"
      :value="initialValues.endedAt"
      :error="errors.endedAt"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>
