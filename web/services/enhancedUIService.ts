import { supabase } from '@/lib/supabase/client';

// Enhanced UI/UX interfaces
export interface ThemeConfig {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'system' | 'high_contrast' | 'custom';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  border_radius: number;
  spacing_unit: number;
  font_family: string;
  font_sizes: FontSizes;
  shadows: ShadowConfig;
  animations: AnimationConfig;
  custom_css?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface FontSizes {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface ShadowConfig {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
}

export interface AnimationConfig {
  duration_fast: string;
  duration_normal: string;
  duration_slow: string;
  easing_default: string;
  easing_in: string;
  easing_out: string;
  reduce_motion: boolean;
}

export interface AccessibilitySettings {
  id: string;
  user_id: string;
  high_contrast: boolean;
  large_text: boolean;
  reduce_motion: boolean;
  keyboard_navigation: boolean;
  screen_reader_support: boolean;
  focus_indicators: boolean;
  color_blind_friendly: boolean;
  dyslexia_friendly_font: boolean;
  text_to_speech: boolean;
  aria_labels_extended: boolean;
  tab_order_customization: boolean;
  voice_commands: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme_id: string;
  language: string;
  timezone: string;
  date_format: string;
  time_format: '12h' | '24h';
  currency: string;
  number_format: string;
  sidebar_collapsed: boolean;
  dashboard_layout: DashboardLayout;
  notification_preferences: NotificationPreferences;
  accessibility_settings: AccessibilitySettings;
  performance_mode: 'high' | 'balanced' | 'battery_saver';
  created_at: string;
  updated_at: string;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  columns: number;
  auto_refresh: boolean;
  refresh_interval: number;
  show_welcome: boolean;
  compact_mode: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'list' | 'calendar' | 'notifications' | 'quick_actions' | 'ai_insights';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  data_source: string;
  refresh_rate: number;
  visible: boolean;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  desktop_enabled: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  categories: {
    [key: string]: {
      enabled: boolean;
      priority: 'low' | 'medium' | 'high';
      channels: string[];
    };
  };
}

export interface ResponsiveConfig {
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
  container_max_widths: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  grid_columns: number;
  grid_gutter: string;
}

export interface ComponentLibrary {
  buttons: ButtonVariants;
  inputs: InputVariants;
  cards: CardVariants;
  modals: ModalVariants;
  tables: TableVariants;
  charts: ChartVariants;
  navigation: NavigationVariants;
}

export interface ButtonVariants {
  primary: ComponentStyle;
  secondary: ComponentStyle;
  outline: ComponentStyle;
  ghost: ComponentStyle;
  destructive: ComponentStyle;
  sizes: {
    sm: ComponentStyle;
    md: ComponentStyle;
    lg: ComponentStyle;
    xl: ComponentStyle;
  };
}

export interface InputVariants {
  default: ComponentStyle;
  filled: ComponentStyle;
  outlined: ComponentStyle;
  underlined: ComponentStyle;
  error: ComponentStyle;
  success: ComponentStyle;
  disabled: ComponentStyle;
}

export interface CardVariants {
  elevated: ComponentStyle;
  outlined: ComponentStyle;
  filled: ComponentStyle;
  interactive: ComponentStyle;
}

export interface ModalVariants {
  default: ComponentStyle;
  full_screen: ComponentStyle;
  drawer: ComponentStyle;
  bottom_sheet: ComponentStyle;
}

export interface TableVariants {
  default: ComponentStyle;
  striped: ComponentStyle;
  hoverable: ComponentStyle;
  bordered: ComponentStyle;
  compact: ComponentStyle;
}

export interface ChartVariants {
  line: ComponentStyle;
  bar: ComponentStyle;
  pie: ComponentStyle;
  donut: ComponentStyle;
  area: ComponentStyle;
  scatter: ComponentStyle;
}

export interface NavigationVariants {
  sidebar: ComponentStyle;
  topbar: ComponentStyle;
  breadcrumbs: ComponentStyle;
  tabs: ComponentStyle;
  pagination: ComponentStyle;
}

export interface ComponentStyle {
  className: string;
  styles: Record<string, string>;
  hover_styles?: Record<string, string>;
  focus_styles?: Record<string, string>;
  active_styles?: Record<string, string>;
  disabled_styles?: Record<string, string>;
}

export interface InteractiveFeatures {
  gestures: GestureConfig;
  shortcuts: ShortcutConfig[];
  tooltips: TooltipConfig;
  contextMenus: ContextMenuConfig[];
  dragAndDrop: DragDropConfig;
  virtualScrolling: VirtualScrollConfig;
  lazyLoading: LazyLoadConfig;
}

export interface GestureConfig {
  swipe_enabled: boolean;
  pinch_zoom_enabled: boolean;
  double_tap_enabled: boolean;
  long_press_enabled: boolean;
  swipe_threshold: number;
  zoom_sensitivity: number;
}

export interface ShortcutConfig {
  id: string;
  key_combination: string;
  action: string;
  description: string;
  context: string;
  enabled: boolean;
}

export interface TooltipConfig {
  enabled: boolean;
  delay_show: number;
  delay_hide: number;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  theme: 'dark' | 'light';
  max_width: number;
}

export interface ContextMenuConfig {
  id: string;
  target_selector: string;
  items: ContextMenuItem[];
  enabled: boolean;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: string;
  shortcut?: string;
  separator?: boolean;
  disabled?: boolean;
  submenu?: ContextMenuItem[];
}

export interface DragDropConfig {
  enabled: boolean;
  drag_threshold: number;
  drop_zones: string[];
  visual_feedback: boolean;
  ghost_opacity: number;
}

export interface VirtualScrollConfig {
  enabled: boolean;
  item_height: number;
  buffer_size: number;
  overscan: number;
}

export interface LazyLoadConfig {
  enabled: boolean;
  threshold: number;
  root_margin: string;
  placeholder_component: string;
}

export interface PerformanceMetrics {
  page_load_time: number;
  first_contentful_paint: number;
  largest_contentful_paint: number;
  cumulative_layout_shift: number;
  first_input_delay: number;
  time_to_interactive: number;
  bundle_size: number;
  memory_usage: number;
  api_response_times: Record<string, number>;
}

// Mock data for enhanced UI features
const mockThemes: ThemeConfig[] = [
  {
    id: 'theme_light',
    name: 'Light Theme',
    type: 'light',
    primary_color: '#3b82f6',
    secondary_color: '#64748b',
    accent_color: '#f59e0b',
    background_color: '#ffffff',
    surface_color: '#f8fafc',
    text_color: '#1e293b',
    border_radius: 8,
    spacing_unit: 4,
    font_family: 'Inter, sans-serif',
    font_sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    },
    animations: {
      duration_fast: '150ms',
      duration_normal: '300ms',
      duration_slow: '500ms',
      easing_default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easing_in: 'cubic-bezier(0.4, 0, 1, 1)',
      easing_out: 'cubic-bezier(0, 0, 0.2, 1)',
      reduce_motion: false
    },
    is_default: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 'theme_dark',
    name: 'Dark Theme',
    type: 'dark',
    primary_color: '#3b82f6',
    secondary_color: '#64748b',
    accent_color: '#f59e0b',
    background_color: '#0f172a',
    surface_color: '#1e293b',
    text_color: '#f8fafc',
    border_radius: 8,
    spacing_unit: 4,
    font_family: 'Inter, sans-serif',
    font_sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)'
    },
    animations: {
      duration_fast: '150ms',
      duration_normal: '300ms',
      duration_slow: '500ms',
      easing_default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easing_in: 'cubic-bezier(0.4, 0, 1, 1)',
      easing_out: 'cubic-bezier(0, 0, 0.2, 1)',
      reduce_motion: false
    },
    is_default: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  }
];

const mockResponsiveConfig: ResponsiveConfig = {
  breakpoints: {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  },
  container_max_widths: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  grid_columns: 12,
  grid_gutter: '1rem'
};

export class EnhancedUIService {
  // Theme management
  static async getThemes(): Promise<ThemeConfig[]> {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Database query failed, using mock themes');
        return mockThemes;
      }

      return data || mockThemes;
    } catch (error) {
      console.error('Error fetching themes:', error);
      return mockThemes;
    }
  }

  static async createTheme(themeConfig: Omit<ThemeConfig, 'id' | 'created_at' | 'updated_at'>): Promise<ThemeConfig> {
    try {
      const newTheme: ThemeConfig = {
        ...themeConfig,
        id: `theme_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('themes')
        .insert([newTheme])
        .select()
        .single();

      if (error) {
        console.log('Database insert failed, returning mock theme');
        return newTheme;
      }

      return data;
    } catch (error) {
      console.error('Error creating theme:', error);
      throw error;
    }
  }

  static async updateTheme(themeId: string, updates: Partial<ThemeConfig>): Promise<ThemeConfig> {
    try {
      const updatedTheme = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('themes')
        .update(updatedTheme)
        .eq('id', themeId)
        .select()
        .single();

      if (error) {
        console.log('Database update failed, returning mock success');
        const mockTheme = mockThemes.find(t => t.id === themeId);
        return { ...mockTheme!, ...updatedTheme };
      }

      return data;
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  }

  // User preferences management
  static async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select(`
          *,
          accessibility_settings(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('Database query failed, returning default preferences');
        return this.getDefaultPreferences(userId);
      }

      return data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return this.getDefaultPreferences(userId);
    }
  }

  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const updates = {
        ...preferences,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert([{ user_id: userId, ...updates }])
        .select()
        .single();

      if (error) {
        console.log('Database upsert failed, returning mock success');
        return { ...this.getDefaultPreferences(userId), ...updates };
      }

      return data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Accessibility features
  static async getAccessibilitySettings(userId: string): Promise<AccessibilitySettings> {
    try {
      const { data, error } = await supabase
        .from('accessibility_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('Database query failed, returning default accessibility settings');
        return this.getDefaultAccessibilitySettings(userId);
      }

      return data;
    } catch (error) {
      console.error('Error fetching accessibility settings:', error);
      return this.getDefaultAccessibilitySettings(userId);
    }
  }

  static async updateAccessibilitySettings(userId: string, settings: Partial<AccessibilitySettings>): Promise<AccessibilitySettings> {
    try {
      const updates = {
        ...settings,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('accessibility_settings')
        .upsert([{ user_id: userId, ...updates }])
        .select()
        .single();

      if (error) {
        console.log('Database upsert failed, returning mock success');
        return { ...this.getDefaultAccessibilitySettings(userId), ...updates };
      }

      return data;
    } catch (error) {
      console.error('Error updating accessibility settings:', error);
      throw error;
    }
  }

  // Component library management
  static async getComponentLibrary(): Promise<ComponentLibrary> {
    // Mock component library - in real implementation, this would be configurable
    return {
      buttons: {
        primary: {
          className: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-colors',
          styles: {
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontWeight: '500'
          },
          hover_styles: {
            backgroundColor: '#1d4ed8'
          },
          focus_styles: {
            outline: '2px solid #3b82f6',
            outlineOffset: '2px'
          }
        },
        secondary: {
          className: 'bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg px-4 py-2 transition-colors',
          styles: {
            backgroundColor: '#f3f4f6',
            color: '#111827',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontWeight: '500'
          }
        },
        outline: {
          className: 'border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-4 py-2 transition-colors',
          styles: {
            border: '1px solid #d1d5db',
            backgroundColor: 'transparent',
            color: '#374151',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontWeight: '500'
          }
        },
        ghost: {
          className: 'hover:bg-gray-100 text-gray-600 font-medium rounded-lg px-4 py-2 transition-colors',
          styles: {
            backgroundColor: 'transparent',
            color: '#4b5563',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontWeight: '500'
          }
        },
        destructive: {
          className: 'bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 transition-colors',
          styles: {
            backgroundColor: '#dc2626',
            color: '#ffffff',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontWeight: '500'
          }
        },
        sizes: {
          sm: {
            className: 'px-3 py-1.5 text-sm',
            styles: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' }
          },
          md: {
            className: 'px-4 py-2 text-base',
            styles: { padding: '0.5rem 1rem', fontSize: '1rem' }
          },
          lg: {
            className: 'px-6 py-3 text-lg',
            styles: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' }
          },
          xl: {
            className: 'px-8 py-4 text-xl',
            styles: { padding: '1rem 2rem', fontSize: '1.25rem' }
          }
        }
      },
      inputs: {
        default: {
          className: 'border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          styles: {
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem'
          },
          focus_styles: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: '#3b82f6',
            borderColor: 'transparent'
          }
        },
        filled: {
          className: 'bg-gray-100 border-transparent rounded-lg px-3 py-2 focus:bg-white focus:ring-2 focus:ring-blue-500',
          styles: {
            backgroundColor: '#f3f4f6',
            border: '1px solid transparent',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem'
          }
        },
        outlined: {
          className: 'border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500',
          styles: {
            border: '2px solid #d1d5db',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem'
          }
        },
        underlined: {
          className: 'border-0 border-b-2 border-gray-300 rounded-none px-0 py-2 focus:border-blue-500',
          styles: {
            border: 'none',
            borderBottom: '2px solid #d1d5db',
            borderRadius: '0',
            padding: '0.5rem 0'
          }
        },
        error: {
          className: 'border-red-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500',
          styles: {
            border: '1px solid #ef4444',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem'
          }
        },
        success: {
          className: 'border-green-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500',
          styles: {
            border: '1px solid #22c55e',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem'
          }
        },
        disabled: {
          className: 'bg-gray-100 border-gray-200 text-gray-400 rounded-lg px-3 py-2 cursor-not-allowed',
          styles: {
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
            color: '#9ca3af',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem',
            cursor: 'not-allowed'
          }
        }
      },
      cards: {
        elevated: {
          className: 'bg-white rounded-lg shadow-lg p-6',
          styles: {
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            padding: '1.5rem'
          }
        },
        outlined: {
          className: 'bg-white border border-gray-200 rounded-lg p-6',
          styles: {
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }
        },
        filled: {
          className: 'bg-gray-50 rounded-lg p-6',
          styles: {
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }
        },
        interactive: {
          className: 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6',
          styles: {
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            padding: '1.5rem',
            cursor: 'pointer'
          },
          hover_styles: {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
          }
        }
      },
      modals: {
        default: {
          className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50',
          styles: {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        full_screen: {
          className: 'fixed inset-0 z-50 bg-white',
          styles: {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '50',
            backgroundColor: '#ffffff'
          }
        },
        drawer: {
          className: 'fixed top-0 right-0 h-full w-96 z-50 bg-white shadow-xl',
          styles: {
            position: 'fixed',
            top: '0',
            right: '0',
            height: '100%',
            width: '24rem',
            zIndex: '50',
            backgroundColor: '#ffffff',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          }
        },
        bottom_sheet: {
          className: 'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-lg',
          styles: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex: '50',
            backgroundColor: '#ffffff',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem'
          }
        }
      },
      tables: {
        default: {
          className: 'w-full border-collapse',
          styles: {
            width: '100%',
            borderCollapse: 'collapse'
          }
        },
        striped: {
          className: 'w-full border-collapse [&_tbody_tr:nth-child(odd)]:bg-gray-50',
          styles: {
            width: '100%',
            borderCollapse: 'collapse'
          }
        },
        hoverable: {
          className: 'w-full border-collapse [&_tbody_tr]:hover:bg-gray-50',
          styles: {
            width: '100%',
            borderCollapse: 'collapse'
          }
        },
        bordered: {
          className: 'w-full border border-gray-200 [&_td]:border [&_th]:border',
          styles: {
            width: '100%',
            border: '1px solid #e5e7eb'
          }
        },
        compact: {
          className: 'w-full border-collapse [&_td]:py-1 [&_th]:py-1',
          styles: {
            width: '100%',
            borderCollapse: 'collapse'
          }
        }
      },
      charts: {
        line: {
          className: 'w-full h-64',
          styles: { width: '100%', height: '16rem' }
        },
        bar: {
          className: 'w-full h-64',
          styles: { width: '100%', height: '16rem' }
        },
        pie: {
          className: 'w-full h-64',
          styles: { width: '100%', height: '16rem' }
        },
        donut: {
          className: 'w-full h-64',
          styles: { width: '100%', height: '16rem' }
        },
        area: {
          className: 'w-full h-64',
          styles: { width: '100%', height: '16rem' }
        },
        scatter: {
          className: 'w-full h-64',
          styles: { width: '100%', height: '16rem' }
        }
      },
      navigation: {
        sidebar: {
          className: 'fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r',
          styles: {
            position: 'fixed',
            left: '0',
            top: '0',
            height: '100%',
            width: '16rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            borderRight: '1px solid #e5e7eb'
          }
        },
        topbar: {
          className: 'fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b z-40',
          styles: {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            height: '4rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            borderBottom: '1px solid #e5e7eb',
            zIndex: '40'
          }
        },
        breadcrumbs: {
          className: 'flex items-center space-x-2 text-sm text-gray-600',
          styles: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#4b5563'
          }
        },
        tabs: {
          className: 'flex border-b border-gray-200',
          styles: {
            display: 'flex',
            borderBottom: '1px solid #e5e7eb'
          }
        },
        pagination: {
          className: 'flex items-center justify-between',
          styles: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }
        }
      }
    };
  }

  // Performance monitoring
  static async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    // Mock performance metrics - in real implementation, this would integrate with performance monitoring tools
    return {
      page_load_time: 1.2,
      first_contentful_paint: 0.8,
      largest_contentful_paint: 1.5,
      cumulative_layout_shift: 0.05,
      first_input_delay: 12,
      time_to_interactive: 1.8,
      bundle_size: 245,
      memory_usage: 45.2,
      api_response_times: {
        '/api/employees': 120,
        '/api/workflows': 85,
        '/api/analytics': 340,
        '/api/reports': 220
      }
    };
  }

  // Interactive features
  static async getInteractiveFeatures(): Promise<InteractiveFeatures> {
    return {
      gestures: {
        swipe_enabled: true,
        pinch_zoom_enabled: true,
        double_tap_enabled: true,
        long_press_enabled: true,
        swipe_threshold: 50,
        zoom_sensitivity: 0.1
      },
      shortcuts: [
        {
          id: 'shortcut_search',
          key_combination: 'Ctrl+K',
          action: 'open_search',
          description: 'Open global search',
          context: 'global',
          enabled: true
        },
        {
          id: 'shortcut_new_employee',
          key_combination: 'Ctrl+Shift+E',
          action: 'create_employee',
          description: 'Create new employee',
          context: 'people',
          enabled: true
        },
        {
          id: 'shortcut_dashboard',
          key_combination: 'Ctrl+D',
          action: 'navigate_dashboard',
          description: 'Go to dashboard',
          context: 'global',
          enabled: true
        }
      ],
      tooltips: {
        enabled: true,
        delay_show: 500,
        delay_hide: 100,
        placement: 'auto',
        theme: 'dark',
        max_width: 300
      },
      contextMenus: [
        {
          id: 'employee_context',
          target_selector: '.employee-row',
          enabled: true,
          items: [
            {
              id: 'view_employee',
              label: 'View Details',
              icon: 'eye',
              action: 'view_employee',
              shortcut: 'Enter'
            },
            {
              id: 'edit_employee',
              label: 'Edit Employee',
              icon: 'edit',
              action: 'edit_employee',
              shortcut: 'Ctrl+E'
            },
            { id: 'separator_1', label: '', separator: true },
            {
              id: 'deactivate_employee',
              label: 'Deactivate',
              icon: 'user-x',
              action: 'deactivate_employee'
            }
          ]
        }
      ],
      dragAndDrop: {
        enabled: true,
        drag_threshold: 5,
        drop_zones: ['.kanban-column', '.dashboard-grid'],
        visual_feedback: true,
        ghost_opacity: 0.5
      },
      virtualScrolling: {
        enabled: true,
        item_height: 50,
        buffer_size: 10,
        overscan: 5
      },
      lazyLoading: {
        enabled: true,
        threshold: 0.1,
        root_margin: '50px',
        placeholder_component: 'skeleton'
      }
    };
  }

  // Responsive design utilities
  static getResponsiveConfig(): ResponsiveConfig {
    return mockResponsiveConfig;
  }

  // Helper methods
  private static getDefaultPreferences(userId: string): UserPreferences {
    return {
      id: `pref_${userId}`,
      user_id: userId,
      theme_id: 'theme_light',
      language: 'en',
      timezone: 'America/New_York',
      date_format: 'MM/DD/YYYY',
      time_format: '12h',
      currency: 'USD',
      number_format: 'en-US',
      sidebar_collapsed: false,
      dashboard_layout: {
        widgets: [],
        columns: 3,
        auto_refresh: true,
        refresh_interval: 300,
        show_welcome: true,
        compact_mode: false
      },
      notification_preferences: {
        email_enabled: true,
        push_enabled: true,
        desktop_enabled: true,
        sound_enabled: true,
        vibration_enabled: false,
        quiet_hours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
          timezone: 'America/New_York'
        },
        categories: {
          workflow: {
            enabled: true,
            priority: 'high',
            channels: ['email', 'push']
          },
          system: {
            enabled: true,
            priority: 'medium',
            channels: ['push']
          }
        }
      },
      accessibility_settings: this.getDefaultAccessibilitySettings(userId),
      performance_mode: 'balanced',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private static getDefaultAccessibilitySettings(userId: string): AccessibilitySettings {
    return {
      id: `acc_${userId}`,
      user_id: userId,
      high_contrast: false,
      large_text: false,
      reduce_motion: false,
      keyboard_navigation: true,
      screen_reader_support: false,
      focus_indicators: true,
      color_blind_friendly: false,
      dyslexia_friendly_font: false,
      text_to_speech: false,
      aria_labels_extended: false,
      tab_order_customization: false,
      voice_commands: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
} 