import React from "react";

const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <span>
      <input
        value={filterValue || ""}
        onChange={e => setFilter(e.target.value)}
        placeholder={"Filter"}
        className="filter-input"
      />
    </span>
  );
};

export default ColumnFilter;
