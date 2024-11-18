import { useContext, useEffect } from "react";
import { AppContext } from "@context/AppContext";
import Datepicker from "react-tailwindcss-datepicker";


//updated
const DateRangePicker = ({ value, setValue, ddName }) => {
  const { setFiltersSelectedData } = useContext(AppContext);

  useEffect(() => {
    setFiltersSelectedData((prevData) => {
      const [startDate, endDate] = [value?.startDate, value?.endDate];
      if (prevData[ddName]?.[0] !== startDate || prevData[ddName]?.[1] !== endDate) {
        return {
          ...prevData,
          [ddName]: [startDate, endDate],
        };
      }
      return prevData;
    });
  }, [value, ddName]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  function getCurrentFinancialYear() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Fiscal year starts from April
    if (currentMonth < 3) {
      return currentYear - 1; 
    } else {
      return currentYear; 
    }
  }

  const currentYear = getCurrentFinancialYear();

  function getFinancialQuarterDates(year, quarter) {
    let startMonth, endMonth;

    switch (quarter) {
      case 1:
        startMonth = 3; // April (0-indexed)
        endMonth = 5; // June (0-indexed)
        break;
      case 2:
        startMonth = 6; // July (0-indexed)
        endMonth = 8; // September (0-indexed)
        break;
      case 3:
        startMonth = 9; // October (0-indexed)
        endMonth = 11; // December (0-indexed)
        break;
      case 4:
        startMonth = 0; // January (0-indexed)
        endMonth = 2; // March (0-indexed)
        year++; // Increment year for Q4
        break;
      default:
        return null; // Invalid quarter
    }

    const startDate = new Date(Date.UTC(year, startMonth, 1)); // Start of the month
    const endDate = new Date(Date.UTC(year, endMonth + 1, 0)); // End of the month

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  }

  function getCurrentFY() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11

    let startYear;
    let endYear;

    if (currentMonth >= 4) { // from April (4th month) to December (12th month)
      startYear = currentYear;
      endYear = currentYear + 1;
    } else { // from January (1st month) to March (3rd month)
      startYear = currentYear - 1;
      endYear = currentYear;
    }

    const start = `${startYear}-04-01`;
    const end = `${endYear}-03-31`;

    return { start, end };
  }

  const CFY = getCurrentFY();

  return (
    <Datepicker
      configs={{
        shortcuts: {
          FYQ1: {
            text: "FY Q1",
            period: getFinancialQuarterDates(currentYear, 1)
          },
          FYQ2: {
            text: "FY Q2",
            period: getFinancialQuarterDates(currentYear, 2)
          },
          FYQ3: {
            text: "FY Q3",
            period: getFinancialQuarterDates(currentYear, 3)
          },
          FYQ4: {
            text: "FY Q4",
            period: getFinancialQuarterDates(currentYear, 4)
          },
          CurrentYear: {
            text: "Current Year",
            period: CFY
          },
          currentMonth: "This month",
          pastMonth: "Last month",
        },
      }}
      useRange={false}
      showShortcuts={true}
      toggleClassName="absolute text-[#9A55FF] fill-[#9A55FF] stroke-[#9A55FF] path-[#9A55FF] rounded-r-lg right-2 h-full"
      placeholder={"Enter Date"}
      inputClassName="border pl-1 border-[#E0E0E0] w-full text-sm h-8 rounded outline-none text-[#6F6B6B]"
      value={value}
      onChange={handleValueChange}
      dropdownClassName="mt-1 rounded-lg border border-[#E0E0E0] shadow-md bg-white w-full absolute z-10"
      position="bottom"
    />
  );
};

export default DateRangePicker;
