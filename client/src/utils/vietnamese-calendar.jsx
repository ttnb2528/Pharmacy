import { Calendar as CalendarBase } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vi } from "date-fns/locale";
import { useState } from "react";

const months = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const VietnameseCalendar = ({ selected, onSelect, ...props }) => {
  const [month, setMonth] = useState(
    selected ? selected.getMonth() : new Date().getMonth()
  );
  const [year, setYear] = useState(
    selected ? selected.getFullYear() : new Date().getFullYear()
  );

  const handleMonthChange = (value) => {
    setMonth(parseInt(value));
  };

  const handleYearChange = (value) => {
    setYear(parseInt(value));
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div className="flex gap-5 px-2 justify-between items-center mt-2">
          <Select value={month.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <CalendarBase
        {...props}
        mode="single"
        selected={selected}
        onSelect={onSelect}
        month={new Date(year, month)}
        onMonthChange={(newMonth) => {
          setMonth(newMonth.getMonth());
          setYear(newMonth.getFullYear());
        }}
        locale={vi}
        className="rounded-md border"
      />
    </div>
  );
};

export default VietnameseCalendar;
