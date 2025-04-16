import React, { useCallback, useEffect } from "react";
import clsx from "clsx";
import ArrowDown from "../../assets/";

export default function DropDownSortBy({
  value,
  onChange,
  options,
  placeholder,
}) {
  // state to manage menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenuDisplay = useCallback(
    () => setIsMenuOpen((isMenuOpen) => !isMenuOpen),
    []
  );
  //   close menu while clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      console.log(e.target.value);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //   handle for option change

  const handleOptionChange = useCallback(
    function (option) {
      onChange(option);
      setIsMenuOpen(false);
    },
    [onChange]
  );

  //   memoized selected option
  const selectedOption = useMemo(() => {
    options.find((option) => {
      option.value === value;
    });
  }, [options, value]);

  return (
    <div className="dropdown-container">
      <div className="value-container">
        {/* display selected value or placeholder */}
        <span
          className={clsx("dropdown-value", !value && "dropdown-placeholder")}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <img src={ArrowDown} alt="Dropdown Icon" />
      </div>
      {isMenuOpen && (
        <div className="menu-list">
          {options.map((option) => {
            return (
              <div
                className="menu-list-option"
                key={option.value + "-option"}
                onClick={() => handleOptionChange(option.value)}
              >
                {option.value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
