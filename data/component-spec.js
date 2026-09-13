// Info: Component spec sheets for rnw-components (Plan 0156).
//
// Shared data consumed by both component implementations and L3 tests.
// Components resolve geometry, frame style, states, targets, and icon
// names through Parts.Spec(name). Tests read the same file and assert
// the DOM against these values.
//
// Numeric geometry, radius values, border-side literals, and glyph names
// are NOT hardcoded in component implementation. They come from here.
//
// Values are transcribed from the Carbon geometry oracle
// (_test/fixtures/geometry-oracle.json), which is generated from pinned
// @carbon/styles SCSS. See generate-geometry-oracle.js.
//
// Class I data module. Pure data, no side effects.

export default Object.freeze({

  // --- TextInput (atom) ----------------------------------------------------
  textInput: Object.freeze({
    height: 40,
    paddingInline: 16,
    frameMode: 'feedback.field',     // resolved at runtime: underline | outline
    borderWidth: 1,
    radiusToken: 'shape.radius_00',
    iconSize: 16,
    typeStyle: 'type.body01',
    minWidth: 0,                     // prevent intrinsic min-width overflow
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_strong',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.border_focus',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      disabled: Object.freeze({
        border: 'color.border_disabled',
        background: 'color.field',
        text: 'color.text_disabled'
      })
    })
  }),

  // --- Button --------------------------------------------------------------
  button: Object.freeze({
    height: 40,
    paddingInlineStart: 16,
    paddingInlineEnd: 16,
    radiusToken: 'shape.radius_00',
    iconSize: 20,
    typeStyle: 'type.body01',
    minWidth: 0,
    states: Object.freeze({
      rest: Object.freeze({
        background: 'color.button_primary',
        text: 'color.text_on_color',
        border: 'color.button_primary'
      }),
      hover: Object.freeze({
        background: 'color.button_primary_hover',
        text: 'color.text_on_color',
        border: 'color.button_primary_hover'
      }),
      active: Object.freeze({
        background: 'color.button_primary_active',
        text: 'color.text_on_color',
        border: 'color.button_primary_active'
      }),
      disabled: Object.freeze({
        background: 'color.button_disabled',
        text: 'color.text_disabled',
        border: 'color.button_disabled'
      })
    })
  }),

  // --- Search (composite, owns frame) --------------------------------------
  search: Object.freeze({
    height: 40,
    paddingInline: 16,
    frameMode: 'feedback.field',
    borderWidth: 1,
    radiusToken: 'shape.radius_00',
    iconSize: 16,
    typeStyle: 'type.body01',
    minWidth: 0,
    innerInputUnframed: true,
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_strong',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.border_focus',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field',
        text: 'color.text_primary'
      })
    })
  }),

  // --- PasswordInput (composite, owns frame) -------------------------------
  passwordInput: Object.freeze({
    height: 40,
    paddingInline: 16,
    frameMode: 'feedback.field',
    borderWidth: 1,
    radiusToken: 'shape.radius_00',
    iconSize: 16,
    typeStyle: 'type.body01',
    minWidth: 0,
    innerInputUnframed: true,
    toggleIcon: 'visibility',
    toggleIconOff: 'visibility_off',
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_strong',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.border_focus',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field',
        text: 'color.text_primary'
      })
    })
  }),

  // --- NumberInput (composite, owns frame) ----------------------------------
  numberInput: Object.freeze({
    height: 40,
    paddingInline: 16,
    frameMode: 'feedback.field',
    borderWidth: 1,
    radiusToken: 'shape.radius_00',
    iconSize: 16,
    stepperIconSize: 20,
    typeStyle: 'type.body01',
    minWidth: 0,
    innerInputUnframed: true,
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_strong',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.border_focus',
        background: 'color.field',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field',
        text: 'color.text_primary'
      })
    })
  }),

  // --- Tag -----------------------------------------------------------------
  tag: Object.freeze({
    height: 32,
    radiusToken: 'shape.radius_max',
    typeStyle: 'type.label01',
    dismissTargetSize: 24,
    dismissIcon: 'close',
    dismissIconSize: 12
  }),

  // --- Notification (inline) -----------------------------------------------
  notification: Object.freeze({
    iconSize: 20,
    titleTypeStyle: 'type.heading01',
    subtitleTypeStyle: 'type.body01',
    dismissTargetSize: 32,
    dismissIcon: 'close',
    dismissIconSize: 16,
    kinds: Object.freeze(['info', 'success', 'warning', 'error']),
    // Low contrast triad
    lowContrast: Object.freeze({
      background: 'color.notification_background_{kind}',
      border: 'color.support_{kind}',
      title: 'color.text_primary',
      subtitle: 'color.text_secondary',
      icon: 'color.icon_primary',
      dismiss: 'color.icon_primary'
    }),
    // High contrast triad
    highContrast: Object.freeze({
      background: 'color.background_inverse',
      border: 'color.support_{kind}_inverse',
      title: 'color.text_inverse',
      subtitle: 'color.text_inverse',
      icon: 'color.icon_inverse',
      dismiss: 'color.icon_inverse'
    })
  }),

  // --- FileUploaderItem ----------------------------------------------------
  fileUploaderItem: Object.freeze({
    removeTargetSize: 32,
    removeIcon: 'close',
    removeIconSize: 16
  }),

  // --- CopyButton ----------------------------------------------------------
  copyButton: Object.freeze({
    targetSize: 32,
    iconSize: 16,
    copyIcon: 'copy',
    checkIcon: 'checkmark'
  }),

  // --- BottomNavigationBar -------------------------------------------------
  bottomNavigation: Object.freeze({
    itemHeight: 40,
    iconSize: 20,
    labelTypeStyle: 'type.label01',
    activeTopBorderWidth: 2,
    activeTopBorderColor: 'color.border_active'
  }),

  // --- Icon ----------------------------------------------------------------
  icon: Object.freeze({
    sizes: Object.freeze({
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32
    }),
    defaultSize: 'sm'
  })

});
