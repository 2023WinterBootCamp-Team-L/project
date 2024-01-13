import React, { useState } from "react";
import trashcan from "../assets/trashcan.svg";

interface AnswerOptionProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onDelete: () => void;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  value,
  onChange,
  onDelete,
}) => {
  const [isTrashcanVisible, setTrashcanVisible] = useState(true);

  const handleFocus = () => {
    setTrashcanVisible(false);
  };

  const handleBlur = () => {
    setTrashcanVisible(true);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="bg-blue-200 text-black w-full h-10 rounded-lg focus:outline-none leading-1.25 p-2 text-sm"
      />
      {isTrashcanVisible && (
        <button onClick={onDelete}>
          <img
            src={trashcan}
            alt="휴지통"
            className="absolute right-0 top-0 h-full w-9 pr-5"
          />
        </button>
      )}
    </div>
  );
};

export default AnswerOption;
