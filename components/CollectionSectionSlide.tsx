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
  const [autoSlide, setAutoSlide] = useState<boolean>(true);
  const [dragging, setDragging] = useState<boolean>(false);
  const [blockLink, setBlockLink] = useState<boolean>(false);
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
    setAutoSlide(false);
    increasePage();
  };

  const onPrevClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAutoSlide(false);
    decreasePage();
  };

  const paginationGenerator = useCallback(() => {
    let dots: Array<JSX.Element> = [];

    for (let i = 0; i <= maxPage; i++) {
      dots.push(
        <div
          key={i}
          className={`h-2 w-2 cursor-pointer rounded-full ${
            i === slidePage ? "bg-zinc-600" : "bg-zinc-200"
          }`}
          onClick={() => {
            setSlidePage(i);
          }}
        />
      );
    }

    return dots;
  }, [maxPage, slidePage]);

  // 페이지에 맞춰 슬라이드 이동
  const moveSlide = useCallback(() => {
    setBlockLink(false);

    if (!slideRef.current) return;
    const { current: slide } = slideRef;

    const moveX =
      maxPage === 9
        ? -slideItemWidth * slidePage
        : -slideItemWidth * 2 * slidePage;

    slide.style.transform = `translateX(${moveX}px)`;
  }, [maxPage, slideItemWidth, slidePage]);

  // 슬라이드 아이템 너비 계산
  useEffect(() => {
    const calcSlideItemWidth = () => {
      if (!window) return;

      const { innerWidth } = window;

      // 100vw에서 슬라이드 좌우 여백인 110(55*2)px을 빼고 한 페이지에 표시할 아이템 개수로 나눈다.
      // 만약 최대 너비(1700px) 이상일 경우 100vw 대신 1700px에서 계산한다.
      if (innerWidth >= 1700) {
        setMaxPage(2);
        setSlidePage(0);
        setSlideItemWidth((1700 - 110) / 6);
      } else if (innerWidth <= 500) {
        setMaxPage(9);
        setSlidePage(0);
        setSlideItemWidth(innerWidth - 110);
      } else if (innerWidth <= 1023) {
        setMaxPage(4);
        setSlidePage(0);
        setSlideItemWidth((innerWidth - 110) / 2);
      } else if (innerWidth <= 1300) {
        setMaxPage(3);
        setSlidePage(0);
        setSlideItemWidth((innerWidth - 110) / 4);
      } else {
        setMaxPage(2);
        setSlidePage(0);
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

  // 슬라이드 드래그
  useEffect(() => {
    if (!slideRef.current) return;

    const slide = slideRef.current;
    const slideInitX =
      maxPage === 9
        ? -slideItemWidth * slidePage
        : -slideItemWidth * 2 * slidePage;
    let touchStartX: number;
    let touchMoveX: number;

    // 터치 드래그
    const touchMoveListener = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (!slideRef.current) return;
      const slide = slideRef.current;

      touchMoveX = e.touches[0].clientX - touchStartX;

      slide.style.transform = `translateX(${slideInitX + touchMoveX}px)`;
    };

    const touchEndListener = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      setDragging(false);

      const newPage = slidePage + Math.round(touchMoveX / -slideItemWidth);
      setSlidePage(newPage <= 0 ? 0 : newPage >= maxPage ? maxPage : newPage);
      moveSlide();
      window.removeEventListener("touchmove", touchMoveListener);
    };

    const touchStartListener = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      setAutoSlide(false);
      setDragging(true);

      touchStartX = e.touches[0].clientX;
      window.addEventListener("touchmove", touchMoveListener);
      window.addEventListener("touchend", touchEndListener, { once: true });
    };

    // 마우스 드래그
    const mouseMoveListener = (e: MouseEvent) => {
      if (e.cancelable) e.preventDefault();
      if (!slideRef.current) return;
      const slide = slideRef.current;

      touchMoveX = e.clientX - touchStartX;

      // 드래그 시 제품으로 링크 이동을 막는다.
      if (Math.abs(touchMoveX) >= 25) {
        setBlockLink(true);
      }

      slide.style.transform = `translateX(${slideInitX + touchMoveX}px)`;
    };

    const mouseUpListener = (e: MouseEvent) => {
      if (e.cancelable) e.preventDefault();
      setDragging(false);

      const newPage = slidePage + Math.round(touchMoveX / -slideItemWidth);
      setSlidePage(newPage <= 0 ? 0 : newPage >= maxPage ? maxPage : newPage);
      moveSlide();

      window.removeEventListener("mousemove", mouseMoveListener);
    };

    const MouseDownListener = (e: MouseEvent) => {
      if (e.cancelable) e.preventDefault();
      setAutoSlide(false);
      setDragging(true);

      touchStartX = e.clientX;
      window.addEventListener("mousemove", mouseMoveListener);
      window.addEventListener("mouseup", mouseUpListener, { once: true });
    };

    slide.addEventListener("touchstart", touchStartListener);
    slide.addEventListener("mousedown", MouseDownListener);

    return () => {
      slide.removeEventListener("touchstart", touchStartListener);
      window.removeEventListener("touchmove", touchMoveListener);
      window.removeEventListener("touchend", touchEndListener);
      slide.removeEventListener("mousedown", MouseDownListener);
      window.removeEventListener("mousemove", mouseMoveListener);
      window.removeEventListener("mouseup", mouseUpListener);
    };
  }, [maxPage, moveSlide, slideItemWidth, slidePage]);

  useEffect(() => {
    const automaticSlide = setInterval(() => {
      if (autoSlide) {
        setSlidePage((prev) => (prev >= maxPage ? 0 : prev + 1));
      } else {
        clearInterval(automaticSlide);
      }
    }, 3000);

    return () => {
      clearInterval(automaticSlide);
    };
  }, [autoSlide, maxPage]);

  return !isError ? (
    <div className="pb-5">
      <div className="relative text-zinc-800">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 flex w-full justify-between">
          <button
            onClick={onPrevClick}
            className="group pointer-events-auto relative my-auto ml-5 h-10 w-10 rounded-full bg-white p-1 pr-2 text-center shadow shadow-zinc-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 300"
              className="stroke-zinc-400 transition-all group-hover:stroke-zinc-700"
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
            className="group pointer-events-auto relative my-auto mr-5 h-10 w-10 rounded-full bg-white p-1 pl-2 text-center shadow shadow-zinc-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 300"
              className="stroke-zinc-400 transition-all group-hover:stroke-zinc-700"
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
          className={`relative flex h-fit w-fit select-none items-stretch bg-white px-[55px] ${
            blockLink && "cursor-grabbing"
          } ${!dragging && "transition-all duration-500"}`}
        >
          {isFetching || productIdList.length === 0
            ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((el) => (
                <SkeletonCollectionSlide
                  key={el}
                  slideItemWidth={slideItemWidth}
                />
              ))
            : productsList?.map((product, i) => (
                <div
                  key={i}
                  className={`${blockLink && "pointer-events-none"}`}
                >
                  <CollectionSectionSlideItem
                    product={product}
                    slideItemWidth={slideItemWidth}
                  />
                </div>
              ))}
        </ul>
      </div>
      <div className="bottom-0 mt-5 flex h-10 w-full items-center justify-center gap-2">
        {paginationGenerator()}
      </div>
    </div>
  ) : (
    <p className="relative h-[100px] w-full break-keep text-center text-lg font-semibold text-zinc-600">
      컬렉션 제품 목록을 불러오는 과정에서 문제가 발생하였습니다.
      <br />
      잠시 후 다시 시도해 주세요.
    </p>
  );
};

export default CollectionSectionSlide;
