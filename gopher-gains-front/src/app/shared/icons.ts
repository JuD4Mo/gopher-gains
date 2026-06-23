const ICON_BASE = 'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"';

export const ICONS = {
  dashboard: `<svg ${ICON_BASE} viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>`,
  exercises: `<svg ${ICON_BASE} viewBox="0 0 24 24"><rect x="4" y="11" width="4" height="8" rx="1"/><rect x="16" y="11" width="4" height="8" rx="1"/><line x1="8" y1="12" x2="16" y2="12" stroke-width="2.5"/><line x1="8" y1="18" x2="16" y2="18" stroke-width="2.5"/><line x1="10" y1="9" x2="14" y2="9"/><line x1="10" y1="21" x2="14" y2="21"/></svg>`,
  routines: `<svg ${ICON_BASE} viewBox="0 0 24 24"><path d="M8 4h8a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 16 8H8a1.5 1.5 0 0 1-1.5-1.5v-1A1.5 1.5 0 0 1 8 4z"/><rect x="4.5" y="8" width="15" height="12" rx="1.5"/><line x1="8" y1="12.5" x2="16" y2="12.5"/><line x1="8" y1="15.5" x2="13" y2="15.5"/></svg>`,
  users: `<svg ${ICON_BASE} viewBox="0 0 24 24"><circle cx="12" cy="7" r="3.5"/><path d="M4.5 20c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5"/></svg>`,
  sessions: `<svg ${ICON_BASE} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><polyline points="12,7 12,12 15.5,14"/></svg>`,
  assignments: `<svg ${ICON_BASE} viewBox="0 0 24 24"><path d="M10 6.5l1.5-1.5a5 5 0 1 1 7.07 7.07l-1.5 1.5"/><path d="M14 17.5l-1.5 1.5a5 5 0 1 1-7.07-7.07l1.5-1.5"/><line x1="9.5" y1="14.5" x2="14.5" y2="9.5"/></svg>`,
  chevronRight: `<svg ${ICON_BASE} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`,
  plus: `<svg ${ICON_BASE} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  arrowLeft: `<svg ${ICON_BASE} viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  check: `<svg ${ICON_BASE} viewBox="0 0 24 24"><polyline points="5 12 10 17 19 8"/></svg>`,
  close: `<svg ${ICON_BASE} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  trash: `<svg ${ICON_BASE} viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  search: `<svg ${ICON_BASE} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>`,
  emptyBox: `<svg ${ICON_BASE} viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  edit: `<svg ${ICON_BASE} viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
};
