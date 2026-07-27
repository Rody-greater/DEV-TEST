<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from '@/components/layout/BottomNav.vue'
import QuickActions from '@/components/trip/QuickActions.vue'
</script>

<template>
  <div class="min-h-full flex flex-col">
    <main class="flex-1 w-full max-w-xl mx-auto px-4 pt-3 pb-28">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <QuickActions />
    <BottomNav />
  </div>
</template>
