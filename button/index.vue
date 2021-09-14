<template>
  <ronnie-loader v-if="_loading" :css="cssVars" />
  <a
    v-else
    :id="button.id"
    :href="button.href"
    type="button"
    class="material-icons"
    :class="[
      button.class,
      { hint },
      { loading: _loading },
      { disabled: button.disabled },
      { placeholder: button.placeholder },
    ]"
    :name="button.name"
    :target="button.target"
    :alt="button.alt"
    :title="button.title"
    :style="cssVars"
    @mousedown="click"
    @dblclick.prevent="dblclick"
  >
    {{ icon }}
  </a>
</template>

<script scoped>
export default {
  props: {
    button: {
      type: Object,
      default() {
        return "";
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    $form() {
      let component = this.$parent;
      for (let i = 0; i < 5; i++) {
        if (component.type == "form") {
          return component;
        }
        component = component.$parent;
      }
      return false;
    },
    _loading: {
      set(val) {
        this.loading_ = val;
      },
      get() {
        return this.loading === true || this.loading_ === true;
      },
    },
    disabled() {
      if (!this.button.disabledLink) {
        if (this.button.disabled == null) {
          return false;
        }
        return this.button.disabled;
      }
      return this.$parent[this.button.disabledLink];
    },
    active() {
      if (!this.button.activeLink) {
        if (this.button.active == null) {
          return false;
        }
        return this.button.active;
      }
      return this.$parent[this.button.activeLink];
    },
    highlight() {
      if (!this.button.highlightLink) {
        if (this.button.highlight == null) {
          return false;
        }
        return this.button.highlight;
      }
      return this.$parent[this.button.highlightLink];
    },
    hint() {
      return this.highlight ? this.$parent.highlight : false;
    },
    icon() {
      let icon;
      if (this.disabled) icon = this.button.disabledIcon;
      if (this.active) icon = this.button.activeIcon;
      if (this.highlight) icon = this.button.highlightIcon;
      return icon || this.button.icon;
    },
    cssVars() {
      let obj = Merci.getCssVars(this.button, this.type, {
        include: [["icon-size", "size"]],
      });
      if (this.active) {
        obj[`--${this.type}_color`] = this.button.activeColor;
        obj[`--${this.type}_background-color`] =
          this.button.activeBackgroundColor;
      }
      if (this.highlight) {
        obj[`--${this.type}_color`] = this.button.highlightColor;
        obj[`--${this.type}_background-color`] =
          this.button.highlightBackgroundColor;
      }
      if (this.button.colorOnHover)
        obj[`--${this.type}_colorOnHover`] = this.button.colorOnHover;
      return obj;
    },
  },
  data() {
    return {
      type: "button",
      el: Element,
      result: [],
      delay: 0 * 1000,
      clicks: 0,
      timer: null,
      loading_: false,
    };
  },
  created() {
    this.button.id = this.type.generateId(7);
  },
  methods: {
    click(event) {
      const el = event.target;
      this.clicks++;
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          this.result.push(event.type);
          this.clicks = 0;
          // Emit
          this.$emit("click", { el, component: this });
          // Execute passed function
          if (this.button.onclick) this.button.onclick(event.target);
          else () => "";
        }, this.delay);
      } else {
        this.result.push("dblclick");
        this.clicks = 0;
      }
    },
    dblclick(event) {
      // Execute passed function
      if (this.button.ondblclick) this.button.ondblclick(event.target);
      else () => "";
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@sass/bootstrap";
.material-icons {
  margin: var(--button_margin);
  padding: var(--button_padding);
  opacity: var(--button_opacity);

  @include bootstrap.mixin-button-hover-grow(
    var(--button_icon-size, 1.1rem),
    var(--button_color, #8f8f8fd0),
    var(--button_button-width, 1.7em),
    var(--button_button-height, 1.7em),
    var(--button_background-color, #cfcfcf)
  );

  &.placeholder {
    opacity: 0;
  }

  &.placeholder,
  &.disabled {
    pointer-events: none;
  }

  &:hover {
    color: var(--button_colorOnHover);
  }
}
</style>