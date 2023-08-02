import React from "react";

const lineBreaker = (text: string) => {
  if (!text) return;

  const splited = text.split("<br />");

  const spanList = splited.map((paragraph, i) => (
    <React.Fragment key={i}>
      {paragraph}
      {i !== splited.length - 1 && <br />}
    </React.Fragment>
  ));

  return spanList;
};

export default lineBreaker;
