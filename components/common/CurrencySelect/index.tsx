// components/common/CurrencySelect/CurrencySelect.tsx
import { Select } from "@mantine/core";

interface CurrencySelectProps {
  value?: string;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export function CurrencySelect({
  value,
  onChange,
  label = "Currency",
  placeholder = "Select currency",
  required = false,
  error,
}: CurrencySelectProps) {
  const currencies = [
    { value: "PKR", label: "Pakistani Rupee (₨)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
    { value: "CHF", label: "Swiss Franc (CHF)" },
    { value: "CNY", label: "Chinese Yuan (¥)" },
    { value: "INR", label: "Indian Rupee (₹)" },
    { value: "SGD", label: "Singapore Dollar (S$)" },
    { value: "NZD", label: "New Zealand Dollar (NZ$)" },
    { value: "KRW", label: "South Korean Won (₩)" },
    { value: "BRL", label: "Brazilian Real (R$)" },
    { value: "RUB", label: "Russian Ruble (₽)" },
    { value: "ZAR", label: "South African Rand (R)" },
    { value: "TRY", label: "Turkish Lira (₺)" },
    { value: "MXN", label: "Mexican Peso (Mex$)" },
    { value: "AED", label: "UAE Dirham (د.إ)" },
    { value: "SAR", label: "Saudi Riyal (﷼)" },
    { value: "QAR", label: "Qatari Riyal (﷼)" },
    { value: "KWD", label: "Kuwaiti Dinar (د.ك)" },
    { value: "BDT", label: "Bangladeshi Taka (৳)" },
    { value: "LKR", label: "Sri Lankan Rupee (Rs)" },
    { value: "NPR", label: "Nepalese Rupee (Rs)" },
    { value: "EGP", label: "Egyptian Pound (£)" },
    { value: "THB", label: "Thai Baht (฿)" },
    { value: "MYR", label: "Malaysian Ringgit (RM)" },
    { value: "IDR", label: "Indonesian Rupiah (Rp)" },
    { value: "VND", label: "Vietnamese Dong (₫)" },
    { value: "PHP", label: "Philippine Peso (₱)" },
    { value: "HKD", label: "Hong Kong Dollar (HK$)" },
    { value: "TWD", label: "New Taiwan Dollar (NT$)" },
    { value: "SEK", label: "Swedish Krona (kr)" },
    { value: "NOK", label: "Norwegian Krone (kr)" },
    { value: "DKK", label: "Danish Krone (kr)" },
    { value: "PLN", label: "Polish Złoty (zł)" },
    { value: "HUF", label: "Hungarian Forint (Ft)" },
    { value: "CZK", label: "Czech Koruna (Kč)" },
    { value: "ILS", label: "Israeli Shekel (₪)" },
    { value: "CLP", label: "Chilean Peso (CLP$)" },
    { value: "COP", label: "Colombian Peso (COL$)" },
    { value: "ARS", label: "Argentine Peso (ARS$)" },
    { value: "PEN", label: "Peruvian Sol (S/)" },
  ];

  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={currencies}
      value={value}
      onChange={onChange}
      required={required}
      error={error}
      searchable
      nothingFoundMessage="No currencies found"
      maxDropdownHeight={280}
    />
  );
}
