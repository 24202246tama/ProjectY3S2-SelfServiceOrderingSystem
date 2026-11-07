import type { OrderStatus } from '@/types';

export const colors = {
  background: '#F6F4F0',
  surface: '#FFFFFF',
  text: '#1F1B16',
  textMuted: '#6E665C',
  border: '#E5E0D8',
  primary: '#D9480F',
  primaryText: '#FFFFFF',
  primarySoft: '#FFE8DB',
  success: '#2B8A3E',
  successSoft: '#E3F5E6',
  warning: '#B5650B',
  warningSoft: '#FFF1D6',
  info: '#1864AB',
  infoSoft: '#E1EEFB',
  danger: '#C92A2A',
  dangerSoft: '#FDE2E2',
  neutralSoft: '#EDEAE4',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const statusColors: Record<OrderStatus, { fg: string; bg: string }> = {
  pending: { fg: colors.warning, bg: colors.warningSoft },
  preparing: { fg: colors.info, bg: colors.infoSoft },
  ready: { fg: colors.success, bg: colors.successSoft },
  served: { fg: colors.textMuted, bg: colors.neutralSoft },
  cancelled: { fg: colors.danger, bg: colors.dangerSoft },
};
