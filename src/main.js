import { defineCustomElement } from 'vue'
import AutoWrapUp from './AutoWrapUp.ce.vue'

const component = defineCustomElement(AutoWrapUp)

customElements.define("auto-wrap-up", component)