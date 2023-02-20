import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import useGetProductsById from "../hooks/useGetProductsById";
import CollectionSectionSlideItem from "../components/CollectionSectionSlideItem";
import SkeletonCollectionSlide from "../components/SkeletonCollectionSlide";

interface Props {
  productIdList: Array<string>;
}

const CollectionSectionSlide: React.FC<Props> = ({ productIdList }) => {
  const slideRef = useRef<HTMLUListElement>(null);
  const [slidePage, setSlidePage] = useState<number>(0);
  const [slideItemWidth, setSlideItemWidth] = useState<number>(200);
  const [maxPage, setMaxPage] = useState<number>(3);

  const {
    data: productsList,
    isError,
    isFetching,
  } = useGetProductsById(productIdList);

  const increasePage = () => {
    setSlidePage((prev) => (prev === maxPage ? 0 : prev + 1));
  };

  const decreasePage = () => {
    setSlidePage((prev) => (prev === 0 ? maxPage : prev - 1));
  };

  const onNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    increasePage();
  };

  const onPrevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    decreasePage();
  };

  const paginationGenerator = useCallback(() => {
    let dots: Array<JSX.Element> = [];

    for (let i = 0; i <= maxPage; i++) {
      dots.push(
        <div
          key={i}
          className={`w-2 h-2 cursor-pointer ${
            i === slidePage ? "bg-zinc-600" : "bg-zinc-200"
          } rounded-full`}
          onClick={() => {
            setSlidePage(i);
          }}
        />
      );
    }

    return dots;
  }, [maxPage, slidePage]);

  const moveSlide = useCallback(() => {
    if (!slideRef.current) return;
    const { current: slide } = slideRef;

    const moveX =
      maxPage === 9
        ? -slideItemWidth * slidePage
        : -slideItemWidth * 2 * slidePage;

    slide.style.transform = `translateX(${moveX}px)`;
  }, [maxPage, slideItemWidth, slidePage]);

  useEffect(() => {
    const calcSlideItemWidth = () => {
      if (!window) return;

      const { innerWidth } = window;

      // 슬라이드 아이템 너비 계산
      // 100vw에서 paddingX인 110(55*2)px을 빼고 한 페이제에 표시할 아이템 개수로 나눈다.
      // 만약 최대 너비(1700px) 이상일 경우 100vw 대신 1700px에서 계산한다.
      if (innerWidth >= 1700) {
        setMaxPage(2);
        setSlideItemWidth((1700 - 110) / 6);
      } else if (innerWidth <= 500) {
        setMaxPage(9);
        setSlideItemWidth(innerWidth - 110);
      } else if (innerWidth <= 1024) {
        setMaxPage(4);
        setSlideItemWidth((innerWidth - 110) / 2);
      } else if (innerWidth <= 1300) {
        setMaxPage(3);
        setSlideItemWidth((innerWidth - 110) / 4);
      } else {
        setMaxPage(2);
        setSlideItemWidth((innerWidth - 110) / 6);
      }
    };

    calcSlideItemWidth();

    window.addEventListener("resize", _.debounce(calcSlideItemWidth, 100));

    return () => {
      window.removeEventListener("resize", _.debounce(calcSlideItemWidth, 100));
    };
  }, []);

  useEffect(() => {
    moveSlide();
  }, [moveSlide]);

  return !isError ? (
    <div className="pb-5">
      <div className="relative text-zinc-800">
        <div className="w-full absolute left-0 top-0 bottom-0 z-10 flex justify-between pointer-events-none">
          <button
            onClick={onPrevClick}
            className="relative w-10 h-10 ml-2 my-auto rounded-md pointer-events-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 300"
              className="stroke-zinc-400 hover:stroke-zinc-700 transition-all"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "50px",
              }}
            >
              <polyline points="221.98 32.98 78.02 150 221.98 267.02" />
            </svg>
          </button>
          <button
            onClick={onNextClick}
            className="relative w-10 h-10 mr-2 my-auto rounded-md pointer-events-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 300"
              className="stroke-zinc-400 hover:stroke-zinc-700 transition-all"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "50px",
              }}
            >
              <polyline points="78.79 267.02 222.75 150 78.79 32.98" />
            </svg>
          </button>
        </div>

        <ul
          ref={slideRef}
          className={`relative w-fit h-fit flex items-stretch px-[55px] bg-white transition-all duration-500`}
        >
          {isFetching || productIdList.length === 0
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((el) => (
                <SkeletonCollectionSlide
                  key={el}
                  slideItemWidth={slideItemWidth}
                />
              ))
            : productsList?.map((product, i) => (
                <CollectionSectionSlideItem
                  product={product}
                  slideItemWidth={slideItemWidth}
                  key={i}
                />
              ))}
        </ul>
      </div>
      <div className="w-full h-10 bottom-0 flex justify-center items-center gap-2">
        {paginationGenerator()}
      </div>
    </div>
  ) : (
    <p className="relative w-full h-[100px] text-zinc-600 font-semibold text-lg break-keep text-center">
      컬렉션 제품 목록을 불러오는 과정에서 문제가 발생하였습니다.
      <br />
      잠시 후 다시 시도해 주세요.
    </p>
  );
};

export default CollectionSectionSlide;
