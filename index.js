import Vue from 'vue'

const namespace = 'ronnie'
const components = {
    'form': () => require(`ronnie/form`).default,
    'input': () => require(`ronnie/input`).default,
    'dropdown': () => require(`ronnie/dropdown`).default,
    'autocomplete': () => require(`ronnie/autocomplete`).default,
    'button': () => require(`ronnie/button`).default,
    'loader': () => require(`ronnie/loader`).default,
    'inject': () => require(`ronnie/inject`).default,
}

Object.entries(components).forEach(([name, component]) => {
    Vue.component(`${namespace}-${name}`, component())
})