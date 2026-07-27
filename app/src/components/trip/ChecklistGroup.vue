<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{ groupId: string; icon?: string; title: string; items: string[]; open?: boolean }>()
const user = useUserStore()
const isOpen = ref(props.open ?? false)

const key = (i: number) => `cl:${props.groupId}:${i}`
const doneCount = computed(() => props.items.filter((_, i) => user.isChecked(key(i))).length)
</script>

<template>
  <div class="card overflow-hidden animate-fadeUp">
    <button type="button" class="w-full flex items-center justify-between gap-3 p-4 tap" @click="isOpen = !isOpen">
      <span class="font-extrabold flex items-center gap-2.5">
        <span v-if="icon" class="text-lg">{{ icon }}</span>{{ title }}
      </span>
      <span class="flex items-center gap-2">
        <span class="text-xs font-extrabold text-faint tabular-nums">{{ doneCount }}/{{ items.length }}</span>
        <ChevronDownIcon class="w-5 h-5 text-faint transition-transform" :class="isOpen ? 'rotate-180' : ''" />
      </span>
    </button>
    <div v-show="isOpen" class="border-t border-line">
      <button
        v-for="(item, i) in items" :key="i" type="button"
        class="w-full flex items-center gap-3 px-4 py-3 border-b border-line/60 last:border-0 text-left tap"
        @click="user.toggleCheck(key(i))"
      >
        <span class="shrink-0 w-6 h-6 rounded-md border-2 grid place-items-center"
          :class="user.isChecked(key(i)) ? 'bg-done border-done' : 'border-faint bg-bg2'">
          <CheckIcon v-if="user.isChecked(key(i))" class="w-4 h-4 text-bg2" />
        </span>
        <span class="text-sm" :class="user.isChecked(key(i)) ? 'line-through text-muted' : ''">{{ item }}</span>
      </button>
    </div>
  </div>
</template>
