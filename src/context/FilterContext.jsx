import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filterData, setFilterData] = useState(null);

  const updateFilterData = (newData) => {
    setFilterData(newData);
  };

  return (
    <FilterContext.Provider value={{ filterData, updateFilterData }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  return useContext(FilterContext);
};
