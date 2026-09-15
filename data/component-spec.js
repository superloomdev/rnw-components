// Info: Component spec sheets for rnw-components.
//
// Shared data consumed by both component implementations and L3 tests.
// Components resolve geometry, frame style, states, targets, and icon
// names through Parts.Spec(name). Tests read the same file and assert
// the DOM against these values.
//
// Numeric geometry, radius values, border-side literals, and glyph names
// are NOT hardcoded in component implementation. They come from here.
//
// Geometry values are token references (heightToken, paddingInlineToken,
// iconSizeToken) resolved through the theme. Values without a contract
// token stay numeric with a rawReason. Where the spec intentionally differs
// from an oracle, a sizeChoice declares both Carbon and Material values.
//
// Class I data module. Pure data, no side effects.

export default Object.freeze({

  // --- TextInput (atom) ----------------------------------------------------
  textInput: Object.freeze({
    heightToken: 'size.container_03',     // 40px - Carbon layout.size md
    paddingInlineToken: 'spacing.spacing_05', // 16px - Carbon density normal
    frameMode: 'feedback.field',          // resolved at runtime: underline | outline
    borderWidth: 1,
    rawReason_borderWidth: 'no contract token for 1px border width; Carbon uses $border-strong',
    radiusToken: 'shape.radius_00',
    iconSizeToken: 'size.icon_01',        // 16px
    typeStyle: 'type.body01',
    minWidth: 0,                         // prevent intrinsic min-width overflow
    rawReason_minWidth: 'no contract token for 0px min-width; structural reset',
    controlSizeToken: 'size.container_03', // 40px - field-adjacent control target
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_subtle_01',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.focus',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      disabled: Object.freeze({
        border: 'color.border_disabled',
        background: 'color.field_01',
        text: 'color.text_disabled'
      })
    })
  }),

  // --- Button (M-D6: Carbon default lg, icon 16, full size scale) ----------
  button: Object.freeze({
    heightToken: 'size.container_04',     // 48px - Carbon layout.size lg (M-D6)
    paddingInlineStartToken: 'spacing.spacing_05', // 16px
    paddingInlineEndToken: 'spacing.spacing_05',   // 16px
    radiusToken: 'shape.radius_00',
    iconSizeToken: 'size.icon_01',        // 16px (M-D6)
    typeStyle: 'type.body01',
    minWidth: 0,
    rawReason_minWidth: 'no contract token for 0px min-width; structural reset',
    // Full Carbon size scale (M-D6)
    sizes: Object.freeze({
      xs: Object.freeze({ heightToken: 'size.container_01' }),  // 24
      sm: Object.freeze({ heightToken: 'size.container_02' }),  // 32
      md: Object.freeze({ heightToken: 'size.container_03' }),  // 40
      lg: Object.freeze({ heightToken: 'size.container_04' }),   // 48
      xl: Object.freeze({ heightToken: 'size.container_05' }),   // 64
      '2xl': Object.freeze({ heightToken: 'size.size_2xlarge' }) // 80
    }),
    defaultSize: 'lg',                    // M-D6: Carbon default
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
    heightToken: 'size.container_03',     // 40px
    paddingInlineToken: 'spacing.spacing_05', // 16px
    frameMode: 'feedback.field',
    borderWidth: 1,
    rawReason_borderWidth: 'no contract token for 1px border width; Carbon uses $border-strong',
    radiusToken: 'shape.radius_00',
    iconSizeToken: 'size.icon_01',         // 16px
    typeStyle: 'type.body01',
    minWidth: 0,
    rawReason_minWidth: 'no contract token for 0px min-width; structural reset',
    innerInputUnframed: true,
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_subtle_01',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.focus',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field_01',
        text: 'color.text_primary'
      })
    })
  }),

  // --- PasswordInput (composite, owns frame) -------------------------------
  passwordInput: Object.freeze({
    heightToken: 'size.container_03',     // 40px
    paddingInlineToken: 'spacing.spacing_05', // 16px
    frameMode: 'feedback.field',
    borderWidth: 1,
    rawReason_borderWidth: 'no contract token for 1px border width; Carbon uses $border-strong',
    radiusToken: 'shape.radius_00',
    iconSizeToken: 'size.icon_01',         // 16px
    typeStyle: 'type.body01',
    minWidth: 0,
    rawReason_minWidth: 'no contract token for 0px min-width; structural reset',
    innerInputUnframed: true,
    toggleIcon: 'visibility',
    toggleIconOff: 'visibility_off',
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_subtle_01',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.focus',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field_01',
        text: 'color.text_primary'
      })
    })
  }),

  // --- NumberInput (composite, owns frame) ----------------------------------
  numberInput: Object.freeze({
    heightToken: 'size.container_03',     // 40px
    paddingInlineToken: 'spacing.spacing_05', // 16px
    frameMode: 'feedback.field',
    borderWidth: 1,
    rawReason_borderWidth: 'no contract token for 1px border width; Carbon uses $border-strong',
    radiusToken: 'shape.radius_00',
    iconSizeToken: 'size.icon_01',         // 16px
    stepperIconSizeToken: 'size.icon_02', // 20px
    typeStyle: 'type.body01',
    minWidth: 0,
    rawReason_minWidth: 'no contract token for 0px min-width; structural reset',
    innerInputUnframed: true,
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_subtle_01',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.focus',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field_01',
        text: 'color.text_primary'
      })
    })
  }),

  // --- Tag (owner-confirmed: adopt Carbon parsed default 24) ---------------
  tag: Object.freeze({
    heightToken: 'size.container_01',     // 24px - Carbon tag redefined md
    radiusToken: 'shape.radius_max',
    typeStyle: 'type.label01',
    dismissTargetSizeToken: 'size.container_01', // 24px
    dismissIcon: 'close',
    dismissIconSize: 12,
    rawReason_dismissIconSize: 'no contract token for 12px icon size; Carbon tag dismiss icon',
    sizeChoice: Object.freeze({
      carbon: 'md (24px, tag redefined scale)',
      material: 'container-height (32px, assist-chip)',
      reason: 'Carbon redefines the tag size scale with md=24; adopted Carbon default per M-D6 direction'
    })
  }),

  // --- Notification (inline) -----------------------------------------------
  notification: Object.freeze({
    iconSizeToken: 'size.icon_02',       // 20px
    titleTypeStyle: 'type.heading01',
    subtitleTypeStyle: 'type.body01',
    radiusToken: 'shape.radius_00',
    dismissTargetSizeToken: 'size.container_04', // 48px
    dismissIcon: 'close',
    dismissIconSizeToken: 'size.icon_01', // 16px
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
    removeTargetSizeToken: 'size.container_02', // 32px
    removeIcon: 'close',
    removeIconSizeToken: 'size.icon_01'   // 16px
  }),

  // --- CopyButton ----------------------------------------------------------
  copyButton: Object.freeze({
    targetSizeToken: 'size.container_02', // 32px
    iconSizeToken: 'size.icon_01',         // 16px
    copyIcon: 'copy',
    checkIcon: 'checkmark'
  }),

  // --- BottomNavigationBar -------------------------------------------------
  bottomNavigation: Object.freeze({
    itemHeightToken: 'size.container_03', // 40px
    iconSizeToken: 'size.icon_02',        // 20px
    labelTypeStyle: 'label01',
    activeTopBorderWidth: 2,
    rawReason_activeTopBorderWidth: 'no contract token for 2px active indicator; Carbon bottom-nav pattern',
    activeTopBorderColor: 'interactive'
  }),

  // --- SkeletonPlaceholder ---------------------------------------------------
  skeletonPlaceholder: Object.freeze({
    heightToken: 'size.container_04'      // 48px
  }),

  // --- IconSwitch -------------------------------------------------------------
  iconSwitch: Object.freeze({
    widthToken: 'size.container_04',      // 48px
    height: 28,
    rawReason_height: 'no contract token for 28px switch height; Carbon switch track height'
  }),

  // --- Select (uses textInput spec for frame; geometry from oracle) ---------
  select: Object.freeze({
    heightToken: 'size.container_03',     // 40px - Carbon select md
    paddingInlineToken: 'spacing.spacing_05', // 16px
    frameMode: 'feedback.field',
    borderWidth: 1,
    rawReason_borderWidth: 'no contract token for 1px border width; Carbon uses $border-strong',
    radiusToken: 'shape.radius_00',
    iconSizeToken: 'size.icon_01',        // 16px
    typeStyle: 'type.body01',
    minWidth: 0,
    rawReason_minWidth: 'no contract token for 0px min-width; structural reset',
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_subtle_01',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.focus',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      disabled: Object.freeze({
        border: 'color.border_disabled',
        background: 'color.field_01',
        text: 'color.text_disabled'
      })
    })
  }),

  // --- TextArea (M.3: joins frame contract) ----------------------------------
  textArea: Object.freeze({
    minHeightToken: 'size.container_03',  // 40px - matches field height
    paddingInlineToken: 'spacing.spacing_05', // 16px
    frameMode: 'feedback.field',
    borderWidth: 1,
    rawReason_borderWidth: 'no contract token for 1px border width; Carbon uses $border-strong',
    radiusToken: 'shape.radius_00',
    typeStyle: 'type.body01',
    minWidth: 0,
    rawReason_minWidth: 'no contract token for 0px min-width; structural reset',
    innerInputUnframed: true,
    states: Object.freeze({
      rest: Object.freeze({
        border: 'color.border_subtle_01',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      focus: Object.freeze({
        border: 'color.focus',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      invalid: Object.freeze({
        border: 'color.support_error',
        background: 'color.field_01',
        text: 'color.text_primary'
      }),
      disabled: Object.freeze({
        border: 'color.border_disabled',
        background: 'color.field_01',
        text: 'color.text_disabled'
      })
    })
  }),

  // --- Shared target floor ---------------------------------------------------
  // Minimum target size for pressables that are not field-adjacent controls
  // (those use textInput.controlSizeToken). Oracle container xs step.
  target: Object.freeze({
    minSizeToken: 'size.container_01'     // 24px
  }),

  // --- Icon ----------------------------------------------------------------
  icon: Object.freeze({
    sizes: Object.freeze({
      sm: Object.freeze({ sizeToken: 'size.icon_01' }),   // 16
      md: Object.freeze({ sizeToken: 'size.icon_02' }),   // 20
      lg: Object.freeze({ sizeToken: 'size.icon_03' }),    // 24
      xl: Object.freeze({ sizeToken: 'size.icon_04' })     // 32
    }),
    defaultSize: 'sm'
  })

});
