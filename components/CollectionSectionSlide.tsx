import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import heartIcon from "../public/icons/heart.svg";
import cartIcon from "../public/icons/cart-button.svg";
import { useQuery } from "react-query";
import getCollectionProducts from "../pages/api/getCollectionProducts";

interface Props {
  productIdList: Array<string>;
}

const CollectionSectionSlide: React.FC<Props> = ({ productIdList }) => {
  const slideRef = useRef<HTMLUListElement>(null);
  const {
    status,
    data: productsList,
    error,
  } = useQuery(["collectionProducts", productIdList], () =>
    getCollectionProducts(productIdList)
  );

  const [slidePage, setSlidePage] = useState<number>(0);
  const [slideItemWidth, setSlideItemWidth] = useState<number>(200);
  const [maxPage, setMaxPage] = useState<number>(3);

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

  const pagination = useCallback(() => {
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
        ? (slideItemWidth + 20) * -slidePage
        : (slideItemWidth + 20) * -slidePage * 2;

    slide.style.transform = `translateX(${moveX}px)`;
  }, [slideItemWidth, slidePage, maxPage]);

  useEffect(() => {
    const calcSlideItemWidth = () => {
      if (!window) return;

      const { innerWidth } = window;

      if (innerWidth >= 1300) {
        setSlideItemWidth(282.5);
        setMaxPage(3);
        setSlidePage(0);
      } else if (innerWidth <= 360) {
        setSlideItemWidth(250);
        setMaxPage(9);
        setSlidePage(0);
      } else if (innerWidth <= 500) {
        const width = innerWidth - 110;
        setSlideItemWidth(width);
        setMaxPage(9);
        setSlidePage(0);
      } else if (innerWidth <= 840) {
        const width = (innerWidth - 110) / 2 - 10;
        setSlideItemWidth(width);
        setMaxPage(4);
        setSlidePage(0);
      } else {
        const width = (innerWidth - 110) / 4 - 15;
        setSlideItemWidth(width);
        setMaxPage(3);
        setSlidePage(0);
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

  return (
    <div>
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
          className={`relative w-fit h-fit flex items-stretch gap-[20px] px-[55px] py-[10px] bg-white transition-all duration-500`}
        >
          {productsList?.map((item, i) => (
            <li key={i} className="group relative">
              <div className="w-6 absolute right-3 top-2 flex flex-col justify-center items-center gap-1 z-10">
                <button className="transition-transform duration-500 hover:scale-110 active:duration-100 active:scale-150">
                  <Image src={heartIcon} alt="찜하기" />
                </button>
                <button className="transition-transform duration-500 hover:scale-110 active:duration-100 active:scale-150">
                  <Image
                    src={cartIcon}
                    alt="장바구니에 담기"
                    className="stroke-white"
                  />
                </button>
              </div>
              <Link
                href={`/products/${item.id}`}
                className={`relative h-full py-2 shrink-0 flex flex-col justify-between items-center gap-2 border border-zinc-300 rounded-md overflow-hidden text-center`}
                style={{ width: `${slideItemWidth}px` }}
              >
                <div className="transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={item.img.src}
                    width={150}
                    height={150}
                    alt={item.name}
                  />
                </div>
                <h4 className="relative px-2 text-lg font-semibold leading-5">
                  {item.name}
                </h4>
                <span className="relative text-zinc-400">
                  {item.price.toLocaleString("ko-KR")} ₩
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full h-10 bottom-0 flex justify-center items-center gap-2">
        {pagination()}
      </div>
    </div>
  );
};

export default CollectionSectionSlide;
