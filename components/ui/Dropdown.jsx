import { useState } from "react";

export default function Dropdown({ options, selected, setSelected }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left w-full">
      <button type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium bg-white border rounded-md shadow-sm hover:bg-gray-50"
      >
        {selected}
        <svg
          className="w-4 h-4 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1 text-sm text-gray-700">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
