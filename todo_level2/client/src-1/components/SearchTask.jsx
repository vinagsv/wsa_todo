import React, { useEffect, useRef, useCallback } from "react";
import searchIcon from "../assets/asset";

export default function SearchTask({
  placeholder = "Search title and description",
  tasks,
  setFilteredTask,
  searchQuery,
  setSearchQuery,
}) {
  const timerIdRef = useRef(null);

  useEffect(() => {
    // perform search here and filter tasks based on search query
    const filteredTasks = tasks.filter((task) => {
      const case1 = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const case2 = task.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return case1 || case2;
    });

    setFilteredTask(filteredTasks);
  }, [searchQuery, setFilteredTask, tasks]);

  // debounce the search input change
  const handleSearchInputChange = useCallback(
    (event) => {
      const query = event.target.value;
      clearTimeout(timerIdRef.current);
      // set a new timeout and update the ref
      timerIdRef.current = setTimeout(() => {
        setSearchQuery(query);
      }, 300);
    },
    [setSearchQuery]
  );

  return (
    <div className="search-box-container">
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleSearchInputChange}
      />
      <img src={searchIcon} alt="Search Icon" />
    </div>
  );
}
