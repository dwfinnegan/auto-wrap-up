<template>
  <div id="auto-wrap-up" :class="setTheme" v-if="showBtn" @click="handleClick">
    <div class="btn" :class="{ active: isActive }">
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
        <path
          d="M480-96q-79.38 0-149.19-30T208.5-208.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.81-834q69.81-30 149.19-30 63 0 120 19t105 54l-52 52q-37-26-81-39.5T480-792q-129.67 0-220.84 91.23-91.16 91.23-91.16 221Q168-350 259.16-259q91.17 91 220.84 91 36.87 0 71.43-8Q586-184 617-199l53 53q-42 24-89.91 37Q532.17-96 480-96Zm264-72v-120H624v-72h120v-120h72v120h120v72H816v120h-72ZM425-307 264-468l52-52 110 110 387-387 51 51-439 439Z" />
      </svg>
    </div>
  </div>
</template>


<script setup>
import { Desktop } from '@wxcc-desktop/sdk'
import { Notifications, NotificationItemsContent } from "@uuip/unified-ui-platform-sdk"
import { computed, onMounted, onUnmounted, ref } from 'vue'

const logger = Desktop.logger.createLogger('auto-wrap-up')

const props = defineProps({
  darkMode: String,
  taskSelected: Object,
  wrapupCodeId: String,
})

const activeInteractionIds = ref([])
const wrapupCode = ref(null)


const setTheme = computed(() => ({
  'dark': props.darkMode === true,
  'light': props.darkMode === false
}))


const showBtn = computed(() => props.taskSelected?.isOwner == true)
const isActive = computed(() => activeInteractionIds.value.includes(props.taskSelected.interactionId))


const handleClick = async () => {
  const index = activeInteractionIds.value.indexOf(props.taskSelected.interactionId)

  if (index === -1) {
    activeInteractionIds.value.push(props.taskSelected.interactionId)
  } else {
    activeInteractionIds.value.splice(index, 1)
  }
}


const pushWrapupCodeErrorNotification = async () => {

  function generateMessage(mode) {
    return {
      data: {
        type: Notifications.ItemMeta.Type.Error,
        mode: mode,
        title: "Auto-Wrap-Up Widget",
        data: new NotificationItemsContent.DataController({
          text: "Wrapup Code missing on Agent's Desktop Profile",
          iconDetail: {
            iconName: 'icon-alert-active_16',
            color: 'red',
          }
        })
      },
    }
  }

  Desktop.actions.fireGeneralSilentNotification(generateMessage(Notifications.ItemMeta.Mode.Silent))
  Desktop.actions.fireGeneralAutoDismissNotification(generateMessage(Notifications.ItemMeta.Mode.AutoDismiss))

}


const clearActiveInteraction = (id) => {
  const index = activeInteractionIds.value.indexOf(id)

  if (index !== -1) {
    activeInteractionIds.value.splice(index, 1)
  }
}


const handleContactEnded = (msg) => {
  const id = msg.data.interaction.interactionId
  if (!activeInteractionIds.value.includes(id)) {
    sendDefaultWrapUpCode(id)
  }
  clearActiveInteraction(id)
}


const sendDefaultWrapUpCode = async (id) => {
  await Desktop.agentContact.wrapupV2({
    interactionId: id,
    data: {
      wrapUpReason: wrapupCode.value.name,
      auxCodeId: wrapupCode.value.id,
      isAutoWrapup: wrapupCode.value.isDefault,
    }
  })
}


const fetchWrapUpCode = async () => {
  const response = await Desktop.agentConfigJsApi.fetchPaginatedAuxCodes({
    workType: 'WRAP_UP_CODE',
    customFilter: `id=="${props.wrapupCodeId}"`
  })

  if (response?.data.length !== 0) {
    wrapupCode.value = { ...response.data[0] }
    logger.info(`Found default Wrap Up code: ${response.data[0].name} with id: ${props.wrapupCodeId}`)
  } else {
    logger.info(`Failed to find default Wrap Up code with id: ${props.wrapupCodeId}`)
    pushWrapupCodeErrorNotification()
  }
}


const initDesktop = async () => {
  await Desktop.config.init('auto-wrap-up', 'dwfinnegan')
  fetchWrapUpCode()

  Desktop.agentContact.addEventListener("eAgentWrapup", msg => handleContactEnded(msg))
}


onMounted(() => {
  initDesktop()
})


onUnmounted(() => {
  logger.info(`Removing all event listeners...`)
  Desktop.agentContact.removeAllEventListeners()
})
</script>


<style>
*,
*::after,
*::before {
  border: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

#auto-wrap-up.light {
  --text: #131313;
  --btn: #dedede;
  --hover: #929292;
  --active: #78f5b8;
}

#auto-wrap-up.dark {
  --text: #f7f7f7;
  --btn: #3b3b3b;
  --hover: #929292;
  --active: #03612c;
}

.btn {
  height: 32px;
  width: 32px;
  background-color: var(--btn);
  border-radius: 20%;
  padding-top: 8px;
  text-align: center;
}

.btn:hover {
  background-color: var(--hover);
  cursor: pointer;
}

.btn svg {
  fill: var(--text);
}

.active {
  background-color: var(--active);
}
</style>
