import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker, type TimePickerProps } from '@mui/x-date-pickers/TimePicker';

export default function TimePickerComponent(props : TimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
        {...props}
      />
    </LocalizationProvider>
  );
}
