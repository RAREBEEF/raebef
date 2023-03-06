/**
 * 대상 HTML 요소의 후손 중 가장 말단에 있는 요소들을 찾아낸다.
 *  */
const useFindLastDescendant = () => {
  /**
   * 대상 HTML 요소의 후손 중 가장 말단에 있는 요소들을 찾아낸다.
   * @param target 대상 요소
   * @param resultArr 재귀 전달 인자, 직접 호출할 때는 비워두자.
   * @returns 대상 요소의 후손 중 자식이 존재하지 않는 요소의 배열 목록
   *  */
  const findLastDescendant = (
    target: HTMLElement | ChildNode,
    resultArr: Array<HTMLElement | ChildNode> = []
  ) => {
    if (target.childNodes.length === 0) {
      resultArr.push(target);
      return;
    }

    target.childNodes.forEach((child) => {
      findLastDescendant(child, resultArr);
    });

    return resultArr;
  };

  return findLastDescendant;
};

export default useFindLastDescendant;
