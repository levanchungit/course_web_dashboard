import React from "react";
import { IconButton } from "@material-tailwind/react";

const EditorToolbar = ({ onFormatButtonClick }) => {
  const handleFormat = (format) => {
    onFormatButtonClick(format);
  };

  return (
    <div className="space-x-1">
      {/* <IconButton size="sm" variant="text" onClick={addHeading(1)}>
        H1
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(2)}>
        H2
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(3)}>
        H3
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(4)}>
        H4
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(5)}>
        H5
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(6)}>
        H6
      </IconButton> */}
      <IconButton size="sm" variant="text" onClick={() => handleFormat("**")}>
        <i className="fas fa-bold" />
      </IconButton>
      {/* <IconButton size="sm" variant="text" onClick={() => handleFormat("*")}>
        <i className="fas fa-italic" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={() => handleFormat("> ")}>
        <i className="fas fa-quote-left" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={() => handleFormat("```")}>
        <i className="fas fa-code" />
      </IconButton> */}
      {/* <IconButton size="sm" variant="text" onClick={addLink}>
        <i className="fas fa-link" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addList}>
        <i className="fas fa-list-ul" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addOrderedList}>
        <i className="fas fa-list-ol" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addImage}>
        <i className="fas fa-image" />
      </IconButton> */}
    </div>
  );
};

export default EditorToolbar;
