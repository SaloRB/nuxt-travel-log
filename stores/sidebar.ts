import type { SidebarItem } from "~/lib/types";

export const useSidebarStore = defineStore("useSidebarStore", () => {
  const sidebarItems = ref<SidebarItem[]>([]);
  const sidebarTopItems = ref<SidebarItem[]>([]);
  const loading = ref(false);

  return {
    loading,
    sidebarTopItems,
    sidebarItems,
  };
});
