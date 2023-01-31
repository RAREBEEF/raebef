const useFindLastDescendant = () => {
  const findLastDescendant = (
    parent: HTMLElement | ChildNode,
    resultArr: Array<HTMLElement | ChildNode> = []
  ) => {
    if (parent.childNodes.length === 0) {
      resultArr.push(parent);
      return;
    }

    parent.childNodes.forEach((child) => {
      findLastDescendant(child, resultArr);
    });

    return resultArr;
  };

  return findLastDescendant;
};

export default useFindLastDescendant;
