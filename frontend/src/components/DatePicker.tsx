import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function DatePickerComponent(props: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...props}
      />
    </LocalizationProvider>
  );
}
