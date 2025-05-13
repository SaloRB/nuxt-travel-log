<script lang="ts" setup generic="T extends LatLongItem">
import type { FetchError } from "ofetch";
import type { ZodSchema } from "zod";

import { toTypedSchema } from "@vee-validate/zod";
import { AppPlaceSearch } from "#components";

import type { LatLongItem, NominatimResult } from "~/lib/types";

import { CENTER_WORLD } from "~/lib/constants";

const props = defineProps<{
  initialValues: T;
  schema: ZodSchema;
  submitLabel: string;
  submitIcon: string;
  zoom: number;
  onSubmit: (location: T) => Promise<any>;
  onSubmitComplete: () => void;
}>();
const router = useRouter();
const mapStore = useMapStore();

const loading = ref(false);
const submitted = ref(false);
const submitError = ref();

const {
  handleSubmit,
  errors,
  meta,
  controlledValues,
  setErrors,
  setFieldValue,
} = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: props.initialValues,
});

const onSubmit = handleSubmit(async (values: T) => {
  try {
    submitError.value = "";
    loading.value = true;
    await props.onSubmit(values);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
});

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    id: 1,
    name: "Added",
    description: "",
    lat: Number(result.lat),
    long: Number(result.lon),
    centerMap: true,
  };
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("long", mapStore.addedPoint.long);
    setFieldValue("lat", mapStore.addedPoint.lat);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added",
    description: "",
    lat: props.initialValues?.lat || (CENTER_WORLD as [number, number])[1],
    long: props.initialValues?.long || (CENTER_WORLD as [number, number])[0],
    zoom: props.zoom,
  };
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
    if (!confirm) {
      return false;
    }
  }
  mapStore.addedPoint = null;
  return true;
});
</script>

<template>
  <div
    v-if="submitError"
    role="alert"
    class="alert alert-error"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>{{ submitError }}</span>
  </div>
  <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
    <slot :errors="errors" :loading="loading" />

    <p class="text-xs text-gray-400">
      Current coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
    </p>

    <p>To set the coordinates:</p>
    <ul class="list-disc ml-4 text-sm ">
      <li>Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker to your desired location.</li>
      <li>Double click the map.</li>
      <li>Search for a location below.</li>
    </ul>

    <div class="flex justify-end gap-2 mt-2">
      <button
        :disabled="loading"
        type="button"
        class="btn btn-outline"
        @click="router.back()"
      >
        Cancel
      </button>
      <button
        :disabled="loading"
        type="submit"
        class="btn btn-primary"
      >
        <span
          v-if="loading"
          class="loading loading-spinner loading-sm"
        />
        <Icon
          v-else
          :name="props.submitIcon"
          size="24"
        />
        {{ props.submitLabel }}
      </button>
    </div>
  </form>
  <div class="divider" />
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
