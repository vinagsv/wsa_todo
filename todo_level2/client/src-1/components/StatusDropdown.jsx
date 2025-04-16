import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

const options = [
  { display: "Open", value: "Open", className: "status-open" },
  {
    display: "In-Progress",
    value: "In-Progress",
    className: "status-In-Progress",
  },
  { display: "Completed", value: "Completed", className: "status-Completed" },
];

export default function StatusDropdown({
  value = options[0].value,
  taskId,
  changeTaskStatus,
}) {
  // State to manage loading state
  const [loading, setLoading] = useState(false);
  // State to manage the dropdown
  const [isOpen, setIsOpen] = useState(false);
  // Reference to dropdown element
  const dropdownRef = useRef(null);

  // Memoized current status
  const currentStatus = useMemo(
    () => options.find((option) => option.value === value),
    [value]
  );

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener for mousedown event on the entire document
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleDropdown = useCallback(function (event) {
    event.stopPropagation();
    setIsOpen((isOpen) => !isOpen);
  }, []);

  // Handle API response
  const handleResponse = useCallback(
    (responseData) => {
      changeTaskStatus(responseData);
      setLoading(false);
    },
    [changeTaskStatus]
  );

  // Handle errors
  const handleError = useCallback((errorMsg) => {
    console.error(errorMsg);
    alert(errorMsg);
  }, []);

  //dont change this part in code at all
  const handleStatusChange = useCallback(
    (newValue) => {
      if (newValue === value) return; // Prevent unnecessary updates

      changeTaskStatus(
        newValue,
        taskId,
        handleResponse,
        handleError,
        setLoading
      );
      setIsOpen(false);
    },
    [value, taskId, handleResponse, handleError]
  );

  const handleOptionClick = useCallback(
    (event, value) => {
      event.stopPropagation();
      handleStatusChange(value);
    },
    [handleStatusChange]
  );
  return (
    <div className="status-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className={`status-btn ${currentStatus?.className}`}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={loading}
      >
        {loading ? "Updating..." : currentStatus?.display}
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown-item ${option.className}`}
              onClick={toggleDropdown}
            >
                {currentStatus.display}
                {!loading&&}
              {option.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
