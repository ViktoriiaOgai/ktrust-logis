export interface CompanyStat {
  id: number;
  value: number;
  suffix?: string;
  label: string;
  progress: number;
}

export const companyStats: CompanyStat[] = [
  {
    id: 1,
    value: 30000,
    suffix: "+",
    label: "кг доставлено\nпо всему СНГ",
    progress: 92,
  },
  {
    id: 2,
    value: 1358,
    suffix: "+",
    label: "посылок\nуже отправлено",
    progress: 82,
  },
  {
    id: 3,
    value: 8,
    suffix: "+",
    label: "человек\nв команде",
    progress: 76,
  },
];