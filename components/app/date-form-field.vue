<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  value: number;
  error?: string;
  disabled?: boolean;
}>();

const {
  value: inputValue,
  handleBlur,
  handleChange,
} = useField<number>(props.name, {
  initialValue: props.value,
});

function dateChanged(event: Event) {
  const target = event.target as HTMLInputElement;
  handleChange(new Date(target.value).getTime());
}
</script>

<template>
  <fieldset class="fieldset">
    <legend
      class="fieldset-legend"
      :class="{ 'text-error': props.error }"
    >
      {{ props.label }}
    </legend>
    <input
      :name="props.name"
      type="date"
      :disabled="props.disabled"
      class="w-full input"
      :class="{
        'input-error': props.error,
      }"
      :value="formatDate(inputValue)"
      @change="dateChanged"
      @blur="handleBlur"
    >
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
