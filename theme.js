// Info: Carbon theme profiles for the Superloom Themer (Plan 0149, Step 4.2).
//
// Data-only module. No React, no component factories, no side effects.
// Each export is a Themer template with exact Carbon values from the
// pinned @carbon/react@1.115.0 upstream (commit 7518c84f).
//
// Values are independent of Superloom's implementation output. They were
// extracted from @carbon/themes, @carbon/type, @carbon/motion, and
// @carbon/layout via the parity oracle generator.
//
// Usage:
//   import { white } from '@superloomdev/rnw-components/theme';
//   const built = Themer.buildTheme(white, [{ name: 'base' }], 'native');

// white profile: light polarity, 203 tokens
export const white = {
  'polarity': 'light',
  'scales': {
    'base_font_size': 16
  },
  'tokens': {
    'color.background': '#ffffff',
    'color.background_hover': 'rgba(141, 141, 141, 0.12)',
    'color.background_active': 'rgba(141, 141, 141, 0.5)',
    'color.background_selected': 'rgba(141, 141, 141, 0.2)',
    'color.background_selected_hover': 'rgba(141, 141, 141, 0.32)',
    'color.background_inverse': '#393939',
    'color.background_inverse_hover': '#474747',
    'color.layer_01': '#f4f4f4',
    'color.layer_02': '#ffffff',
    'color.layer_03': '#f4f4f4',
    'color.layer_active_01': '#c6c6c6',
    'color.layer_active_02': '#c6c6c6',
    'color.layer_active_03': '#c6c6c6',
    'color.layer_hover_01': '#e8e8e8',
    'color.layer_hover_02': '#e8e8e8',
    'color.layer_hover_03': '#e8e8e8',
    'color.layer_selected_01': '#e0e0e0',
    'color.layer_selected_02': '#e0e0e0',
    'color.layer_selected_03': '#e0e0e0',
    'color.layer_selected_hover_01': '#d1d1d1',
    'color.layer_selected_hover_02': '#d1d1d1',
    'color.layer_selected_hover_03': '#d1d1d1',
    'color.layer_selected_inverse': '#161616',
    'color.text_primary': '#161616',
    'color.text_secondary': '#525252',
    'color.text_on_color': '#ffffff',
    'color.text_on_color_disabled': '#8d8d8d',
    'color.text_inverse': '#ffffff',
    'color.text_disabled': 'rgba(22, 22, 22, 0.25)',
    'color.text_helper': '#6f6f6f',
    'color.text_placeholder': 'rgba(22, 22, 22, 0.4)',
    'color.border_subtle_01': '#c6c6c6',
    'color.border_subtle_02': '#e0e0e0',
    'color.border_subtle_03': '#c6c6c6',
    'color.border_strong_01': '#8d8d8d',
    'color.border_strong_02': '#8d8d8d',
    'color.border_strong_03': '#8d8d8d',
    'color.border_inverse': '#161616',
    'color.border_interactive': '#0f62fe',
    'color.border_disabled': '#c6c6c6',
    'color.icon_primary': '#161616',
    'color.icon_secondary': '#525252',
    'color.icon_on_color': '#ffffff',
    'color.icon_on_color_disabled': '#8d8d8d',
    'color.icon_inverse': '#ffffff',
    'color.icon_disabled': 'rgba(22, 22, 22, 0.25)',
    'color.icon_interactive': '#0f62fe',
    'color.interactive': '#0f62fe',
    'color.focus': '#0f62fe',
    'color.focus_inset': '#ffffff',
    'color.focus_inverse': '#ffffff',
    'color.highlight': '#d0e2ff',
    'color.support_error': '#da1e28',
    'color.support_error_inverse': '#fa4d56',
    'color.support_warning': '#f1c21b',
    'color.support_warning_inverse': '#f1c21b',
    'color.support_success': '#24a148',
    'color.support_success_inverse': '#42be65',
    'color.support_info': '#0043ce',
    'color.support_info_inverse': '#4589ff',
    'color.support_caution_major': '#ff832b',
    'color.support_caution_minor': '#f1c21b',
    'color.overlay': 'rgba(0, 0, 0, 0.6)',
    'color.skeleton_background': '#e8e8e8',
    'color.skeleton_element': '#c6c6c6',
    'color.ai_aura_start': 'rgba(69, 137, 255, 0.1)',
    'color.ai_aura_end': 'rgba(255, 255, 255, 0)',
    'color.ai_aura_hover_start': 'rgba(69, 137, 255, 0.32)',
    'color.ai_aura_hover_end': 'rgba(255, 255, 255, 0)',
    'color.ai_overlay': 'rgba(0, 17, 65, 0.5)',
    'color.ai_popover_background': '#ffffff',
    'color.ai_border_start': 'rgba(166, 200, 255, 0.64)',
    'color.ai_border_end': '#78a9ff',
    'color.ai_border_strong': '#4589ff',
    'color.ai_inner_shadow': 'rgba(69, 137, 255, 0.1)',
    'color.ai_drop_shadow': 'rgba(15, 98, 254, 0.1)',
    'shadow.ai_drop_shadow': 'rgba(15, 98, 254, 0.1)',
    'shadow.ai_inner_shadow': 'rgba(69, 137, 255, 0.1)',
    'shadow.ai_popover_shadow_outer_01': 'rgba(0, 67, 206, 0.06)',
    'shadow.ai_popover_shadow_outer_02': 'rgba(0, 0, 0, 0.04)',
    'shadow.shadow': 'rgba(0, 0, 0, 0.3)',
    'type.body01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.body02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.bodyCompact01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.bodyCompact02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.bodyLong01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.bodyLong02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.bodyShort01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.bodyShort02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.caption01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.caption02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.32px'
    },
    'type.code01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px',
      'font_family': '\'IBM Plex Mono\', \'Menlo\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', Courier, monospace'
    },
    'type.code02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.32px',
      'font_family': '\'IBM Plex Mono\', \'Menlo\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', Courier, monospace'
    },
    'type.display01': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display02': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 600,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display03': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display04': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.expressiveHeading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': '0.16px'
    },
    'type.expressiveHeading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.expressiveHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.expressiveHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.expressiveHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.expressiveHeading06': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.expressiveParagraph01': {
      'type_set': true,
      'font_size': '1.5rem',
      'font_weight': 300,
      'line_height': 1.334,
      'letter_spacing': 0
    },
    'type.fluidDisplay01': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay02': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 600,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay03': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay04': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.fluidHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.fluidHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.fluidHeading06': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.fluidParagraph01': {
      'type_set': true,
      'font_size': '1.5rem',
      'font_weight': 300,
      'line_height': 1.334,
      'letter_spacing': 0
    },
    'type.fluidQuotation01': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.3,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.fluidQuotation02': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 300,
      'line_height': 1.25,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.fontFamilies': {
      'type_set': true
    },
    'type.fontWeights': {
      'type_set': true
    },
    'type.heading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.heading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.heading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.heading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.heading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.heading06': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.heading07': {
      'type_set': true,
      'font_size': '3.375rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.headingCompact01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.headingCompact02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.helperText01': {
      'type_set': true,
      'font_size': '0.75rem',
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.helperText02': {
      'type_set': true,
      'font_size': '0.875rem',
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.label01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.label02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.legal01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.legal02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.productiveHeading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.productiveHeading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.productiveHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.productiveHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.productiveHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.productiveHeading06': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.productiveHeading07': {
      'type_set': true,
      'font_size': '3.375rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.quotation01': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.3,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.quotation02': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 300,
      'line_height': 1.25,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.reset': {
      'type_set': true
    },
    'type.scale': {
      'type_set': true
    },
    'type.styles': {
      'type_set': true
    },
    'type.unstable_tokens': {
      'type_set': true
    },
    'dimension.base_font_size': 16,
    'dimension.border_radius_00': '0px',
    'dimension.border_radius_02': '0.125rem',
    'dimension.border_radius_04': '0.25rem',
    'dimension.border_radius_08': '0.5rem',
    'dimension.border_radius_16': '1rem',
    'dimension.border_radius_24': '1.5rem',
    'dimension.border_radius_max': '999999px',
    'dimension.container_01': '1.5rem',
    'dimension.container_02': '2rem',
    'dimension.container_03': '2.5rem',
    'dimension.container_04': '3rem',
    'dimension.container_05': '4rem',
    'dimension.fluid_spacing_01': 0,
    'dimension.fluid_spacing_02': '2vw',
    'dimension.fluid_spacing_03': '5vw',
    'dimension.fluid_spacing_04': '10vw',
    'dimension.icon_size_01': '1rem',
    'dimension.icon_size_02': '1.25rem',
    'dimension.layout_01': '1rem',
    'dimension.layout_02': '1.5rem',
    'dimension.layout_03': '2rem',
    'dimension.layout_04': '3rem',
    'dimension.layout_05': '4rem',
    'dimension.layout_06': '6rem',
    'dimension.layout_07': '10rem',
    'dimension.mini_unit': 8,
    'dimension.size_2__x_large': '5rem',
    'dimension.size_large': '3rem',
    'dimension.size_medium': '2.5rem',
    'dimension.size_small': '2rem',
    'dimension.size_x_large': '4rem',
    'dimension.size_x_small': '1.5rem',
    'dimension.spacing_01': '0.125rem',
    'dimension.spacing_02': '0.25rem',
    'dimension.spacing_03': '0.5rem',
    'dimension.spacing_04': '0.75rem',
    'dimension.spacing_05': '1rem',
    'dimension.spacing_06': '1.5rem',
    'dimension.spacing_07': '2rem',
    'dimension.spacing_08': '2.5rem',
    'dimension.spacing_09': '3rem',
    'dimension.spacing_10': '4rem',
    'dimension.spacing_11': '5rem',
    'dimension.spacing_12': '6rem',
    'dimension.spacing_13': '10rem',
    'motion.duration_fast_01': '70ms',
    'motion.duration_fast_02': '110ms',
    'motion.duration_moderate_01': '150ms',
    'motion.duration_moderate_02': '240ms',
    'motion.duration_slow_01': '400ms',
    'motion.duration_slow_02': '700ms',
    'motion.fast_01': '70ms',
    'motion.fast_02': '110ms',
    'motion.moderate_01': '150ms',
    'motion.moderate_02': '240ms',
    'motion.slow_01': '400ms',
    'motion.slow_02': '700ms'
  }
};

// g10 profile: light polarity, 203 tokens
export const g10 = {
  'polarity': 'light',
  'scales': {
    'base_font_size': 16
  },
  'tokens': {
    'color.background': '#f4f4f4',
    'color.background_hover': 'rgba(141, 141, 141, 0.12)',
    'color.background_active': 'rgba(141, 141, 141, 0.5)',
    'color.background_selected': 'rgba(141, 141, 141, 0.2)',
    'color.background_selected_hover': 'rgba(141, 141, 141, 0.32)',
    'color.background_inverse': '#393939',
    'color.background_inverse_hover': '#474747',
    'color.layer_01': '#ffffff',
    'color.layer_02': '#f4f4f4',
    'color.layer_03': '#ffffff',
    'color.layer_active_01': '#c6c6c6',
    'color.layer_active_02': '#c6c6c6',
    'color.layer_active_03': '#c6c6c6',
    'color.layer_hover_01': '#e8e8e8',
    'color.layer_hover_02': '#e8e8e8',
    'color.layer_hover_03': '#e8e8e8',
    'color.layer_selected_01': '#e0e0e0',
    'color.layer_selected_02': '#e0e0e0',
    'color.layer_selected_03': '#e0e0e0',
    'color.layer_selected_hover_01': '#d1d1d1',
    'color.layer_selected_hover_02': '#d1d1d1',
    'color.layer_selected_hover_03': '#d1d1d1',
    'color.layer_selected_inverse': '#161616',
    'color.text_primary': '#161616',
    'color.text_secondary': '#525252',
    'color.text_on_color': '#ffffff',
    'color.text_on_color_disabled': '#8d8d8d',
    'color.text_inverse': '#ffffff',
    'color.text_disabled': 'rgba(22, 22, 22, 0.25)',
    'color.text_helper': '#6f6f6f',
    'color.text_placeholder': 'rgba(22, 22, 22, 0.4)',
    'color.border_subtle_01': '#e0e0e0',
    'color.border_subtle_02': '#c6c6c6',
    'color.border_subtle_03': '#e0e0e0',
    'color.border_strong_01': '#8d8d8d',
    'color.border_strong_02': '#8d8d8d',
    'color.border_strong_03': '#8d8d8d',
    'color.border_inverse': '#161616',
    'color.border_interactive': '#0f62fe',
    'color.border_disabled': '#c6c6c6',
    'color.icon_primary': '#161616',
    'color.icon_secondary': '#525252',
    'color.icon_on_color': '#ffffff',
    'color.icon_on_color_disabled': '#8d8d8d',
    'color.icon_inverse': '#ffffff',
    'color.icon_disabled': 'rgba(22, 22, 22, 0.25)',
    'color.icon_interactive': '#0f62fe',
    'color.interactive': '#0f62fe',
    'color.focus': '#0f62fe',
    'color.focus_inset': '#ffffff',
    'color.focus_inverse': '#ffffff',
    'color.highlight': '#d0e2ff',
    'color.support_error': '#da1e28',
    'color.support_error_inverse': '#fa4d56',
    'color.support_warning': '#f1c21b',
    'color.support_warning_inverse': '#f1c21b',
    'color.support_success': '#24a148',
    'color.support_success_inverse': '#42be65',
    'color.support_info': '#0043ce',
    'color.support_info_inverse': '#4589ff',
    'color.support_caution_major': '#ff832b',
    'color.support_caution_minor': '#f1c21b',
    'color.overlay': 'rgba(0, 0, 0, 0.6)',
    'color.skeleton_background': '#e8e8e8',
    'color.skeleton_element': '#c6c6c6',
    'color.ai_aura_start': 'rgba(69, 137, 255, 0.1)',
    'color.ai_aura_end': 'rgba(255, 255, 255, 0)',
    'color.ai_aura_hover_start': 'rgba(69, 137, 255, 0.32)',
    'color.ai_aura_hover_end': 'rgba(255, 255, 255, 0)',
    'color.ai_overlay': 'rgba(0, 17, 65, 0.5)',
    'color.ai_popover_background': '#ffffff',
    'color.ai_border_start': 'rgba(166, 200, 255, 0.64)',
    'color.ai_border_end': '#78a9ff',
    'color.ai_border_strong': '#4589ff',
    'color.ai_inner_shadow': 'rgba(69, 137, 255, 0.1)',
    'color.ai_drop_shadow': 'rgba(15, 98, 254, 0.1)',
    'shadow.ai_drop_shadow': 'rgba(15, 98, 254, 0.1)',
    'shadow.ai_inner_shadow': 'rgba(69, 137, 255, 0.1)',
    'shadow.ai_popover_shadow_outer_01': 'rgba(0, 67, 206, 0.06)',
    'shadow.ai_popover_shadow_outer_02': 'rgba(0, 0, 0, 0.04)',
    'shadow.shadow': 'rgba(0, 0, 0, 0.3)',
    'type.body01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.body02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.bodyCompact01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.bodyCompact02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.bodyLong01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.bodyLong02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.bodyShort01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.bodyShort02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.caption01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.caption02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.32px'
    },
    'type.code01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px',
      'font_family': '\'IBM Plex Mono\', \'Menlo\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', Courier, monospace'
    },
    'type.code02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.32px',
      'font_family': '\'IBM Plex Mono\', \'Menlo\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', Courier, monospace'
    },
    'type.display01': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display02': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 600,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display03': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display04': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.expressiveHeading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': '0.16px'
    },
    'type.expressiveHeading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.expressiveHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.expressiveHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.expressiveHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.expressiveHeading06': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.expressiveParagraph01': {
      'type_set': true,
      'font_size': '1.5rem',
      'font_weight': 300,
      'line_height': 1.334,
      'letter_spacing': 0
    },
    'type.fluidDisplay01': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay02': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 600,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay03': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay04': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.fluidHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.fluidHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.fluidHeading06': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.fluidParagraph01': {
      'type_set': true,
      'font_size': '1.5rem',
      'font_weight': 300,
      'line_height': 1.334,
      'letter_spacing': 0
    },
    'type.fluidQuotation01': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.3,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.fluidQuotation02': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 300,
      'line_height': 1.25,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.fontFamilies': {
      'type_set': true
    },
    'type.fontWeights': {
      'type_set': true
    },
    'type.heading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.heading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.heading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.heading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.heading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.heading06': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.heading07': {
      'type_set': true,
      'font_size': '3.375rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.headingCompact01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.headingCompact02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.helperText01': {
      'type_set': true,
      'font_size': '0.75rem',
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.helperText02': {
      'type_set': true,
      'font_size': '0.875rem',
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.label01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.label02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.legal01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.legal02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.productiveHeading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.productiveHeading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.productiveHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.productiveHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.productiveHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.productiveHeading06': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.productiveHeading07': {
      'type_set': true,
      'font_size': '3.375rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.quotation01': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.3,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.quotation02': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 300,
      'line_height': 1.25,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.reset': {
      'type_set': true
    },
    'type.scale': {
      'type_set': true
    },
    'type.styles': {
      'type_set': true
    },
    'type.unstable_tokens': {
      'type_set': true
    },
    'dimension.base_font_size': 16,
    'dimension.border_radius_00': '0px',
    'dimension.border_radius_02': '0.125rem',
    'dimension.border_radius_04': '0.25rem',
    'dimension.border_radius_08': '0.5rem',
    'dimension.border_radius_16': '1rem',
    'dimension.border_radius_24': '1.5rem',
    'dimension.border_radius_max': '999999px',
    'dimension.container_01': '1.5rem',
    'dimension.container_02': '2rem',
    'dimension.container_03': '2.5rem',
    'dimension.container_04': '3rem',
    'dimension.container_05': '4rem',
    'dimension.fluid_spacing_01': 0,
    'dimension.fluid_spacing_02': '2vw',
    'dimension.fluid_spacing_03': '5vw',
    'dimension.fluid_spacing_04': '10vw',
    'dimension.icon_size_01': '1rem',
    'dimension.icon_size_02': '1.25rem',
    'dimension.layout_01': '1rem',
    'dimension.layout_02': '1.5rem',
    'dimension.layout_03': '2rem',
    'dimension.layout_04': '3rem',
    'dimension.layout_05': '4rem',
    'dimension.layout_06': '6rem',
    'dimension.layout_07': '10rem',
    'dimension.mini_unit': 8,
    'dimension.size_2__x_large': '5rem',
    'dimension.size_large': '3rem',
    'dimension.size_medium': '2.5rem',
    'dimension.size_small': '2rem',
    'dimension.size_x_large': '4rem',
    'dimension.size_x_small': '1.5rem',
    'dimension.spacing_01': '0.125rem',
    'dimension.spacing_02': '0.25rem',
    'dimension.spacing_03': '0.5rem',
    'dimension.spacing_04': '0.75rem',
    'dimension.spacing_05': '1rem',
    'dimension.spacing_06': '1.5rem',
    'dimension.spacing_07': '2rem',
    'dimension.spacing_08': '2.5rem',
    'dimension.spacing_09': '3rem',
    'dimension.spacing_10': '4rem',
    'dimension.spacing_11': '5rem',
    'dimension.spacing_12': '6rem',
    'dimension.spacing_13': '10rem',
    'motion.duration_fast_01': '70ms',
    'motion.duration_fast_02': '110ms',
    'motion.duration_moderate_01': '150ms',
    'motion.duration_moderate_02': '240ms',
    'motion.duration_slow_01': '400ms',
    'motion.duration_slow_02': '700ms',
    'motion.fast_01': '70ms',
    'motion.fast_02': '110ms',
    'motion.moderate_01': '150ms',
    'motion.moderate_02': '240ms',
    'motion.slow_01': '400ms',
    'motion.slow_02': '700ms'
  }
};

// g90 profile: dark polarity, 203 tokens
export const g90 = {
  'polarity': 'dark',
  'scales': {
    'base_font_size': 16
  },
  'tokens': {
    'color.background': '#262626',
    'color.background_hover': 'rgba(141, 141, 141, 0.16)',
    'color.background_active': 'rgba(141, 141, 141, 0.4)',
    'color.background_selected': 'rgba(141, 141, 141, 0.24)',
    'color.background_selected_hover': 'rgba(141, 141, 141, 0.32)',
    'color.background_inverse': '#f4f4f4',
    'color.background_inverse_hover': '#e8e8e8',
    'color.layer_01': '#393939',
    'color.layer_02': '#525252',
    'color.layer_03': '#6f6f6f',
    'color.layer_active_01': '#6f6f6f',
    'color.layer_active_02': '#8d8d8d',
    'color.layer_active_03': '#393939',
    'color.layer_hover_01': '#474747',
    'color.layer_hover_02': '#636363',
    'color.layer_hover_03': '#5e5e5e',
    'color.layer_selected_01': '#525252',
    'color.layer_selected_02': '#6f6f6f',
    'color.layer_selected_03': '#525252',
    'color.layer_selected_hover_01': '#636363',
    'color.layer_selected_hover_02': '#5e5e5e',
    'color.layer_selected_hover_03': '#636363',
    'color.layer_selected_inverse': '#f4f4f4',
    'color.text_primary': '#f4f4f4',
    'color.text_secondary': '#c6c6c6',
    'color.text_on_color': '#ffffff',
    'color.text_on_color_disabled': 'rgba(255, 255, 255, 0.25)',
    'color.text_inverse': '#161616',
    'color.text_disabled': 'rgba(244, 244, 244, 0.25)',
    'color.text_helper': '#c6c6c6',
    'color.text_placeholder': 'rgba(244, 244, 244, 0.4)',
    'color.border_subtle_01': '#6f6f6f',
    'color.border_subtle_02': '#8d8d8d',
    'color.border_subtle_03': '#8d8d8d',
    'color.border_strong_01': '#8d8d8d',
    'color.border_strong_02': '#a8a8a8',
    'color.border_strong_03': '#c6c6c6',
    'color.border_inverse': '#f4f4f4',
    'color.border_interactive': '#4589ff',
    'color.border_disabled': 'rgba(141, 141, 141, 0.5)',
    'color.icon_primary': '#f4f4f4',
    'color.icon_secondary': '#c6c6c6',
    'color.icon_on_color': '#ffffff',
    'color.icon_on_color_disabled': 'rgba(255, 255, 255, 0.25)',
    'color.icon_inverse': '#161616',
    'color.icon_disabled': 'rgba(244, 244, 244, 0.25)',
    'color.icon_interactive': '#ffffff',
    'color.interactive': '#4589ff',
    'color.focus': '#ffffff',
    'color.focus_inset': '#161616',
    'color.focus_inverse': '#0f62fe',
    'color.highlight': '#002d9c',
    'color.support_error': '#ff8389',
    'color.support_error_inverse': '#da1e28',
    'color.support_warning': '#f1c21b',
    'color.support_warning_inverse': '#f1c21b',
    'color.support_success': '#42be65',
    'color.support_success_inverse': '#24a148',
    'color.support_info': '#4589ff',
    'color.support_info_inverse': '#0043ce',
    'color.support_caution_major': '#ff832b',
    'color.support_caution_minor': '#f1c21b',
    'color.overlay': 'rgba(0, 0, 0, 0.6)',
    'color.skeleton_background': '#333333',
    'color.skeleton_element': '#525252',
    'color.ai_aura_start': 'rgba(69, 137, 255, 0.1)',
    'color.ai_aura_end': 'rgba(0, 0, 0, 0)',
    'color.ai_aura_hover_start': 'rgba(69, 137, 255, 0.4)',
    'color.ai_aura_hover_end': 'rgba(0, 0, 0, 0)',
    'color.ai_overlay': 'rgba(0, 0, 0, 0.5)',
    'color.ai_popover_background': '#161616',
    'color.ai_border_start': 'rgba(166, 200, 255, 0.36)',
    'color.ai_border_end': '#4589ff',
    'color.ai_border_strong': '#78a9ff',
    'color.ai_inner_shadow': 'rgba(69, 137, 255, 0.16)',
    'color.ai_drop_shadow': 'rgba(0, 0, 0, 0.28)',
    'shadow.ai_drop_shadow': 'rgba(0, 0, 0, 0.28)',
    'shadow.ai_inner_shadow': 'rgba(69, 137, 255, 0.16)',
    'shadow.ai_popover_shadow_outer_01': 'rgba(0, 0, 0, 0.12)',
    'shadow.ai_popover_shadow_outer_02': 'rgba(0, 0, 0, 0.08)',
    'shadow.shadow': 'rgba(0, 0, 0, 0.8)',
    'type.body01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.body02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.bodyCompact01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.bodyCompact02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.bodyLong01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.bodyLong02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.bodyShort01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.bodyShort02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.caption01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.caption02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.32px'
    },
    'type.code01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px',
      'font_family': '\'IBM Plex Mono\', \'Menlo\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', Courier, monospace'
    },
    'type.code02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.32px',
      'font_family': '\'IBM Plex Mono\', \'Menlo\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', Courier, monospace'
    },
    'type.display01': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display02': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 600,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display03': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display04': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.expressiveHeading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': '0.16px'
    },
    'type.expressiveHeading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.expressiveHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.expressiveHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.expressiveHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.expressiveHeading06': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.expressiveParagraph01': {
      'type_set': true,
      'font_size': '1.5rem',
      'font_weight': 300,
      'line_height': 1.334,
      'letter_spacing': 0
    },
    'type.fluidDisplay01': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay02': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 600,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay03': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay04': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.fluidHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.fluidHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.fluidHeading06': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.fluidParagraph01': {
      'type_set': true,
      'font_size': '1.5rem',
      'font_weight': 300,
      'line_height': 1.334,
      'letter_spacing': 0
    },
    'type.fluidQuotation01': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.3,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.fluidQuotation02': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 300,
      'line_height': 1.25,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.fontFamilies': {
      'type_set': true
    },
    'type.fontWeights': {
      'type_set': true
    },
    'type.heading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.heading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.heading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.heading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.heading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.heading06': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.heading07': {
      'type_set': true,
      'font_size': '3.375rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.headingCompact01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.headingCompact02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.helperText01': {
      'type_set': true,
      'font_size': '0.75rem',
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.helperText02': {
      'type_set': true,
      'font_size': '0.875rem',
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.label01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.label02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.legal01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.legal02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.productiveHeading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.productiveHeading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.productiveHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.productiveHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.productiveHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.productiveHeading06': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.productiveHeading07': {
      'type_set': true,
      'font_size': '3.375rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.quotation01': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.3,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.quotation02': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 300,
      'line_height': 1.25,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.reset': {
      'type_set': true
    },
    'type.scale': {
      'type_set': true
    },
    'type.styles': {
      'type_set': true
    },
    'type.unstable_tokens': {
      'type_set': true
    },
    'dimension.base_font_size': 16,
    'dimension.border_radius_00': '0px',
    'dimension.border_radius_02': '0.125rem',
    'dimension.border_radius_04': '0.25rem',
    'dimension.border_radius_08': '0.5rem',
    'dimension.border_radius_16': '1rem',
    'dimension.border_radius_24': '1.5rem',
    'dimension.border_radius_max': '999999px',
    'dimension.container_01': '1.5rem',
    'dimension.container_02': '2rem',
    'dimension.container_03': '2.5rem',
    'dimension.container_04': '3rem',
    'dimension.container_05': '4rem',
    'dimension.fluid_spacing_01': 0,
    'dimension.fluid_spacing_02': '2vw',
    'dimension.fluid_spacing_03': '5vw',
    'dimension.fluid_spacing_04': '10vw',
    'dimension.icon_size_01': '1rem',
    'dimension.icon_size_02': '1.25rem',
    'dimension.layout_01': '1rem',
    'dimension.layout_02': '1.5rem',
    'dimension.layout_03': '2rem',
    'dimension.layout_04': '3rem',
    'dimension.layout_05': '4rem',
    'dimension.layout_06': '6rem',
    'dimension.layout_07': '10rem',
    'dimension.mini_unit': 8,
    'dimension.size_2__x_large': '5rem',
    'dimension.size_large': '3rem',
    'dimension.size_medium': '2.5rem',
    'dimension.size_small': '2rem',
    'dimension.size_x_large': '4rem',
    'dimension.size_x_small': '1.5rem',
    'dimension.spacing_01': '0.125rem',
    'dimension.spacing_02': '0.25rem',
    'dimension.spacing_03': '0.5rem',
    'dimension.spacing_04': '0.75rem',
    'dimension.spacing_05': '1rem',
    'dimension.spacing_06': '1.5rem',
    'dimension.spacing_07': '2rem',
    'dimension.spacing_08': '2.5rem',
    'dimension.spacing_09': '3rem',
    'dimension.spacing_10': '4rem',
    'dimension.spacing_11': '5rem',
    'dimension.spacing_12': '6rem',
    'dimension.spacing_13': '10rem',
    'motion.duration_fast_01': '70ms',
    'motion.duration_fast_02': '110ms',
    'motion.duration_moderate_01': '150ms',
    'motion.duration_moderate_02': '240ms',
    'motion.duration_slow_01': '400ms',
    'motion.duration_slow_02': '700ms',
    'motion.fast_01': '70ms',
    'motion.fast_02': '110ms',
    'motion.moderate_01': '150ms',
    'motion.moderate_02': '240ms',
    'motion.slow_01': '400ms',
    'motion.slow_02': '700ms'
  }
};

// g100 profile: dark polarity, 203 tokens
export const g100 = {
  'polarity': 'dark',
  'scales': {
    'base_font_size': 16
  },
  'tokens': {
    'color.background': '#161616',
    'color.background_hover': 'rgba(141, 141, 141, 0.16)',
    'color.background_active': 'rgba(141, 141, 141, 0.4)',
    'color.background_selected': 'rgba(141, 141, 141, 0.24)',
    'color.background_selected_hover': 'rgba(141, 141, 141, 0.32)',
    'color.background_inverse': '#f4f4f4',
    'color.background_inverse_hover': '#e8e8e8',
    'color.layer_01': '#262626',
    'color.layer_02': '#393939',
    'color.layer_03': '#525252',
    'color.layer_active_01': '#525252',
    'color.layer_active_02': '#6f6f6f',
    'color.layer_active_03': '#8d8d8d',
    'color.layer_hover_01': '#333333',
    'color.layer_hover_02': '#474747',
    'color.layer_hover_03': '#636363',
    'color.layer_selected_01': '#393939',
    'color.layer_selected_02': '#525252',
    'color.layer_selected_03': '#6f6f6f',
    'color.layer_selected_hover_01': '#474747',
    'color.layer_selected_hover_02': '#636363',
    'color.layer_selected_hover_03': '#5e5e5e',
    'color.layer_selected_inverse': '#f4f4f4',
    'color.text_primary': '#f4f4f4',
    'color.text_secondary': '#c6c6c6',
    'color.text_on_color': '#ffffff',
    'color.text_on_color_disabled': 'rgba(255, 255, 255, 0.25)',
    'color.text_inverse': '#161616',
    'color.text_disabled': 'rgba(244, 244, 244, 0.25)',
    'color.text_helper': '#a8a8a8',
    'color.text_placeholder': 'rgba(244, 244, 244, 0.4)',
    'color.border_subtle_01': '#525252',
    'color.border_subtle_02': '#6f6f6f',
    'color.border_subtle_03': '#6f6f6f',
    'color.border_strong_01': '#6f6f6f',
    'color.border_strong_02': '#8d8d8d',
    'color.border_strong_03': '#a8a8a8',
    'color.border_inverse': '#f4f4f4',
    'color.border_interactive': '#4589ff',
    'color.border_disabled': 'rgba(141, 141, 141, 0.5)',
    'color.icon_primary': '#f4f4f4',
    'color.icon_secondary': '#c6c6c6',
    'color.icon_on_color': '#ffffff',
    'color.icon_on_color_disabled': 'rgba(255, 255, 255, 0.25)',
    'color.icon_inverse': '#161616',
    'color.icon_disabled': 'rgba(244, 244, 244, 0.25)',
    'color.icon_interactive': '#ffffff',
    'color.interactive': '#4589ff',
    'color.focus': '#ffffff',
    'color.focus_inset': '#161616',
    'color.focus_inverse': '#0f62fe',
    'color.highlight': '#001d6c',
    'color.support_error': '#fa4d56',
    'color.support_error_inverse': '#da1e28',
    'color.support_warning': '#f1c21b',
    'color.support_warning_inverse': '#f1c21b',
    'color.support_success': '#42be65',
    'color.support_success_inverse': '#24a148',
    'color.support_info': '#4589ff',
    'color.support_info_inverse': '#0043ce',
    'color.support_caution_major': '#ff832b',
    'color.support_caution_minor': '#f1c21b',
    'color.overlay': 'rgba(0, 0, 0, 0.6)',
    'color.skeleton_background': '#292929',
    'color.skeleton_element': '#393939',
    'color.ai_aura_start': 'rgba(69, 137, 255, 0.1)',
    'color.ai_aura_end': 'rgba(0, 0, 0, 0)',
    'color.ai_aura_hover_start': 'rgba(69, 137, 255, 0.4)',
    'color.ai_aura_hover_end': 'rgba(0, 0, 0, 0)',
    'color.ai_overlay': 'rgba(0, 0, 0, 0.5)',
    'color.ai_popover_background': '#161616',
    'color.ai_border_start': 'rgba(166, 200, 255, 0.36)',
    'color.ai_border_end': '#4589ff',
    'color.ai_border_strong': '#78a9ff',
    'color.ai_inner_shadow': 'rgba(69, 137, 255, 0.16)',
    'color.ai_drop_shadow': 'rgba(0, 0, 0, 0.28)',
    'shadow.ai_drop_shadow': 'rgba(0, 0, 0, 0.28)',
    'shadow.ai_inner_shadow': 'rgba(69, 137, 255, 0.16)',
    'shadow.ai_popover_shadow_outer_01': 'rgba(0, 0, 0, 0.12)',
    'shadow.ai_popover_shadow_outer_02': 'rgba(0, 0, 0, 0.08)',
    'shadow.shadow': 'rgba(0, 0, 0, 0.8)',
    'type.body01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.body02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.bodyCompact01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.bodyCompact02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.bodyLong01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.bodyLong02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.bodyShort01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.bodyShort02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 400,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.caption01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.caption02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.32px'
    },
    'type.code01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px',
      'font_family': '\'IBM Plex Mono\', \'Menlo\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', Courier, monospace'
    },
    'type.code02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.42857,
      'letter_spacing': '0.32px',
      'font_family': '\'IBM Plex Mono\', \'Menlo\', \'DejaVu Sans Mono\', \'Bitstream Vera Sans Mono\', Courier, monospace'
    },
    'type.display01': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display02': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 600,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display03': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.display04': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.expressiveHeading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': '0.16px'
    },
    'type.expressiveHeading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.expressiveHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.expressiveHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.expressiveHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.expressiveHeading06': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.expressiveParagraph01': {
      'type_set': true,
      'font_size': '1.5rem',
      'font_weight': 300,
      'line_height': 1.334,
      'letter_spacing': 0
    },
    'type.fluidDisplay01': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay02': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 600,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay03': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidDisplay04': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.19,
      'letter_spacing': 0
    },
    'type.fluidHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.fluidHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.fluidHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.fluidHeading06': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 600,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.fluidParagraph01': {
      'type_set': true,
      'font_size': '1.5rem',
      'font_weight': 300,
      'line_height': 1.334,
      'letter_spacing': 0
    },
    'type.fluidQuotation01': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.3,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.fluidQuotation02': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 300,
      'line_height': 1.25,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.fontFamilies': {
      'type_set': true
    },
    'type.fontWeights': {
      'type_set': true
    },
    'type.heading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.42857,
      'letter_spacing': '0.16px'
    },
    'type.heading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.5,
      'letter_spacing': 0
    },
    'type.heading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.heading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.heading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.heading06': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.heading07': {
      'type_set': true,
      'font_size': '3.375rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.headingCompact01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.headingCompact02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.helperText01': {
      'type_set': true,
      'font_size': '0.75rem',
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.helperText02': {
      'type_set': true,
      'font_size': '0.875rem',
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.label01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.label02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.legal01': {
      'type_set': true,
      'font_size': '0.75rem',
      'font_weight': 400,
      'line_height': 1.33333,
      'letter_spacing': '0.32px'
    },
    'type.legal02': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.productiveHeading01': {
      'type_set': true,
      'font_size': '0.875rem',
      'font_weight': 600,
      'line_height': 1.28572,
      'letter_spacing': '0.16px'
    },
    'type.productiveHeading02': {
      'type_set': true,
      'font_size': '1rem',
      'font_weight': 600,
      'line_height': 1.375,
      'letter_spacing': 0
    },
    'type.productiveHeading03': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.4,
      'letter_spacing': 0
    },
    'type.productiveHeading04': {
      'type_set': true,
      'font_size': '1.75rem',
      'font_weight': 400,
      'line_height': 1.28572,
      'letter_spacing': 0
    },
    'type.productiveHeading05': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 400,
      'line_height': 1.25,
      'letter_spacing': 0
    },
    'type.productiveHeading06': {
      'type_set': true,
      'font_size': '2.625rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.productiveHeading07': {
      'type_set': true,
      'font_size': '3.375rem',
      'font_weight': 300,
      'line_height': 1.199,
      'letter_spacing': 0
    },
    'type.quotation01': {
      'type_set': true,
      'font_size': '1.25rem',
      'font_weight': 400,
      'line_height': 1.3,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.quotation02': {
      'type_set': true,
      'font_size': '2rem',
      'font_weight': 300,
      'line_height': 1.25,
      'letter_spacing': 0,
      'font_family': '\'IBM Plex Serif\', \'Georgia\', Times, serif'
    },
    'type.reset': {
      'type_set': true
    },
    'type.scale': {
      'type_set': true
    },
    'type.styles': {
      'type_set': true
    },
    'type.unstable_tokens': {
      'type_set': true
    },
    'dimension.base_font_size': 16,
    'dimension.border_radius_00': '0px',
    'dimension.border_radius_02': '0.125rem',
    'dimension.border_radius_04': '0.25rem',
    'dimension.border_radius_08': '0.5rem',
    'dimension.border_radius_16': '1rem',
    'dimension.border_radius_24': '1.5rem',
    'dimension.border_radius_max': '999999px',
    'dimension.container_01': '1.5rem',
    'dimension.container_02': '2rem',
    'dimension.container_03': '2.5rem',
    'dimension.container_04': '3rem',
    'dimension.container_05': '4rem',
    'dimension.fluid_spacing_01': 0,
    'dimension.fluid_spacing_02': '2vw',
    'dimension.fluid_spacing_03': '5vw',
    'dimension.fluid_spacing_04': '10vw',
    'dimension.icon_size_01': '1rem',
    'dimension.icon_size_02': '1.25rem',
    'dimension.layout_01': '1rem',
    'dimension.layout_02': '1.5rem',
    'dimension.layout_03': '2rem',
    'dimension.layout_04': '3rem',
    'dimension.layout_05': '4rem',
    'dimension.layout_06': '6rem',
    'dimension.layout_07': '10rem',
    'dimension.mini_unit': 8,
    'dimension.size_2__x_large': '5rem',
    'dimension.size_large': '3rem',
    'dimension.size_medium': '2.5rem',
    'dimension.size_small': '2rem',
    'dimension.size_x_large': '4rem',
    'dimension.size_x_small': '1.5rem',
    'dimension.spacing_01': '0.125rem',
    'dimension.spacing_02': '0.25rem',
    'dimension.spacing_03': '0.5rem',
    'dimension.spacing_04': '0.75rem',
    'dimension.spacing_05': '1rem',
    'dimension.spacing_06': '1.5rem',
    'dimension.spacing_07': '2rem',
    'dimension.spacing_08': '2.5rem',
    'dimension.spacing_09': '3rem',
    'dimension.spacing_10': '4rem',
    'dimension.spacing_11': '5rem',
    'dimension.spacing_12': '6rem',
    'dimension.spacing_13': '10rem',
    'motion.duration_fast_01': '70ms',
    'motion.duration_fast_02': '110ms',
    'motion.duration_moderate_01': '150ms',
    'motion.duration_moderate_02': '240ms',
    'motion.duration_slow_01': '400ms',
    'motion.duration_slow_02': '700ms',
    'motion.fast_01': '70ms',
    'motion.fast_02': '110ms',
    'motion.moderate_01': '150ms',
    'motion.moderate_02': '240ms',
    'motion.slow_01': '400ms',
    'motion.slow_02': '700ms'
  }
};

// All profiles as a named map
export const profiles = { white, g10, g90, g100 };
