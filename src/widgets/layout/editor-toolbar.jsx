import React from "react";
import { IconButton } from "@material-tailwind/react";

const EditorToolbar = ({
  onButtonClick,
  content,
  setContent,
}) => {
  const addHeading = (level) => () => {
    onButtonClick(() => {
      const newContent = `${content}\n${"#".repeat(level)} `;
      setContent(newContent);
    });
  };

  const addBoldText = () => {
    onButtonClick(() => {
      const newContent = `${content} **Text**`;
      setContent(newContent);
    });
  };

  const addItalicText = () => {
    onButtonClick(() => {
      const newContent = `${content} *Text*`;
      setContent(newContent);
    });
  };

  const addQuote = () => {
    onButtonClick(() => {
      const newContent = `${content}\n> `;
      setContent(newContent);
    });
  };

  const addBlockCode = () => {
    onButtonClick(() => {
      const blockCode = "```";
      const newContent = `${content}\n${blockCode}js\n${blockCode}`;
      setContent(newContent);
    });
  };

  const addLink = () => {
    onButtonClick(() => {
      const newContent = `${content}\n[Text](Link)`;
      setContent(newContent);
    });
  };

  const addList = () => {
    onButtonClick(() => {
      const newContent = `${content}\n- `;
      setContent(newContent);
    });
  };

  const addOrderedList = () => {
    onButtonClick(() => {
      const newContent = `${content}\n1. `;
      setContent(newContent);
    });
  };

  const addImage = () => {
    onButtonClick(() => {
        const newContent = `${content}\n![Text](Link)`;
        setContent(newContent);
    });
  };

  return (
    <div className="space-x-1">
      <IconButton size="sm" variant="text" onClick={addHeading(1)}>H1</IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(2)}>H2</IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(3)}>H3</IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(4)}>H4</IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(5)}>H5</IconButton>
      <IconButton size="sm" variant="text" onClick={addHeading(6)}>H6</IconButton>
      <IconButton size="sm" variant="text" onClick={addBoldText}>
        <i className="fas fa-bold" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addItalicText}>
        <i className="fas fa-italic" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addQuote}>
        <i className="fas fa-quote-left" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addBlockCode}>
        <i className="fas fa-code" />
      </IconButton>
      <IconButton size="sm" variant="text" onClick={addLink}>
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
      </IconButton>
    </div>
  );
};

export default EditorToolbar;
