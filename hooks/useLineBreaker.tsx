import React from "react";

/**
 * 외부에서 불러온 문자열의 `<br />` 태그가 실제 줄바꿈을 실행하도록 처리.
 */
const useLineBreaker = () => {
  /**
   * 외부에서 불러온 문자열의 `<br />` 태그가 실제 줄바꿈을 실행하도록 처리하여 반환한다.
   */
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

  return lineBreaker;
};

export default useLineBreaker;
