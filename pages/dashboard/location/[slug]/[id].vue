<script lang="ts" setup>
import type { FetchError } from "ofetch";

const route = useRoute();
const router = useRouter();
const locationStore = useLocationStore();

const {
  currentLocationLog: locationLog,
  currentLocationLogError: error,
  currentLocationLogStatus: status,
} = storeToRefs(locationStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(
  () => isDeleting.value || status.value === "pending",
);

const errorMessage = computed(
  () =>
    deleteError.value || error.value?.statusMessage,
);

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(
      `/api/locations/${route.params.slug}/${route.params.id}`,
      {
        method: "DELETE",
      },
    );
    await router.push({
      name: "dashboard-location-slug",
      params: {
        slug: route.params.slug as string,
      },
    });
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  finally {
    isDeleting.value = false;
  }
}

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLAnchorElement).blur();
}

onMounted(() => {
  locationStore.refreshCurrentLocationLog();
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug-id") {
    locationStore.refreshCurrentLocationLog();
  }
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <div class="loading" />
    </div>

    <div
      v-if="errorMessage && !loading"
      class="alert alert-error"
    >
      <Icon name="tabler:alert-circle" size="24" />
      <h2 class="text-xl">
        {{ errorMessage }}
      </h2>
    </div>

    <div
      v-if="route.name === 'dashboard-location-slug-id'
        && locationLog
        && !loading"
    >
      <p class="text-sm italic text-gray-500">
        <span v-if="locationLog.startedAt !== locationLog.endedAt">
          {{ formatDate(locationLog.startedAt) }} / {{ formatDate(locationLog.endedAt) }}
        </span>
        <span v-else>
          {{ formatDate(locationLog.startedAt) }}
        </span>
      </p>
      <h2 class="text-xl">
        {{ locationLog.name }}
        <div class="dropdown dropdown-bottom">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 btn-sm p-0"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52">
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="{
                  name: 'dashboard-location-slug-id-edit',
                  params: {
                    slug: route.params.slug,
                    id: route.params.id,
                  },
                }"
              >
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">
        {{ locationLog.description }}
      </p>
      <div v-if="!locationLog.images.length" class="flex flex-col gap-2 mt-4">
        <NuxtLink
          :to="{
            name: 'dashboard-location-slug-id-images',
            params: {
              slug: route.params.slug,
              id: route.params.id,
            },
          }"
          class="btn btn-primary w-40"
        >
          <Icon name="tabler:photo-cog" size="24" />
          Add Image
        </NuxtLink>
      </div>
      <ImageList v-else :images="locationLog.images" />
    </div>
    <div v-else>
      <NuxtPage />
    </div>
    <AppDialog
      :title="`Delete location log “${locationLog?.name}”?`"
      :is-open="isOpen"
      description="This action is permanent and cannot be undone. Are you sure you want to delete this location log?"
      confirm-label="Yes, permanently delete"
      confirm-class="btn-error"
      @on-closed="isOpen = false"
      @on-confirmed="confirmDelete"
    />
  </div>
</template>
