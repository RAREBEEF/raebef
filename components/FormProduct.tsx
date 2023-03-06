import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import useInput from "../hooks/useInput";
import {
  Category,
  CategoryName,
  ColorType,
  GenderType,
  ProductType,
  SizeType,
  StockType,
} from "../types";
import categoryData from "../public/json/categoryData.json";
import { v4 as uuidv4 } from "uuid";
import Button from "./Button";
import useInputImg from "../hooks/useInputImg";
import useProduct from "../hooks/useProduct";
import Loading from "./AnimtaionLoading";
import { useRouter } from "next/router";
import filterData from "../public/json/filterData.json";

interface Props {
  prevData?: ProductType;
}

const FormProduct: React.FC<Props> = ({ prevData }) => {
  const { replace } = useRouter();
  const filesInputRefs = useRef<Array<HTMLInputElement>>([]);
  const {
    files: thumbnail,
    onFilesChange: onThumbnailChange,
    setFiles: setThumbnailFiles,
  } = useInputImg(null);
  const {
    files: detailImgs,
    onFilesChange: onDetailImgsChange,
    setFiles: setDetailImgsFiles,
  } = useInputImg(null);
  const {
    value: category,
    setValue: setCategory,
    onChange: onCategoryChange,
  } = useInput<CategoryName | "">("");
  const [subCategoryList, setSubCategoryList] = useState<Array<Category>>([]);
  const {
    value: subCategory,
    setValue: setSubCategory,
    onChange: onSubCategoryChange,
  } = useInput<string>(subCategoryList[0]?.path);
  const {
    value: color,
    setValue: setColor,
    onChange: onColorChange,
  } = useInput<ColorType | "">("");
  const {
    value: gender,
    setValue: setGender,
    onChange: onGenderChange,
  } = useInput<GenderType | "">("");
  const {
    value: name,
    setValue: setName,
    onChange: onNameChange,
  } = useInput<string>("");
  const { value: price, setValue: setPrice } = useInput<number | "">(0);
  const [totalStock, setTotalStock] = useState<number>(0);
  const { value: stock, setValue: setStock } = useInput<StockType>({
    xs: 0,
    m: 0,
    l: 0,
    xl: 0,
    xxl: 0,
    xxxl: 0,
    other: 0,
  });
  const {
    value: tags,
    setValue: setTags,
    onChange: onTagsChange,
  } = useInput<string>("");
  const {
    value: size,
    setValue: setSize,
    onChange: onSizeChange,
  } = useInput<Array<SizeType>>([]);
  const {
    value: description,
    setValue: setDescription,
    onChange: onDescriptionChange,
  } = useInput<string>("");
  const {
    set: { mutateAsync, isLoading },
  } = useProduct();

  // 제품 등록 성공시 초기화
  const reset = () => {
    setCategory("");
    setSubCategory("");
    setSubCategoryList([]);
    setName("");
    setPrice(0);
    setGender("");
    setColor("");
    setStock({ xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0, other: 0 });
    setSize([]);
    setTags("");
    setDescription("");
    setThumbnailFiles(null);
    setDetailImgsFiles(null);
    if (filesInputRefs.current?.length !== 0) {
      filesInputRefs.current.forEach((input) => {
        input.value = "";
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 사이즈 체크박스 생성
  const sizeCheckboxGenerator = () => {
    return filterData.size.map((cur, i) => {
      const onToggleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        // e.preventDefault();

        if (size.some((size) => size === cur.value)) {
          // @ts-ignore
          setSize((prev: Array<SizeType>) =>
            prev.filter((size) => size !== (cur.value as SizeType))
          );
        } else {
          // @ts-ignore
          setSize((prev: Array<SizeType>) => [...prev, cur.value as SizeType]);
        }
      };

      return (
        <label key={i}>
          {cur.text}{" "}
          <input
            onChange={onToggleCheckbox}
            type="checkbox"
            checked={size.some((size) => size === cur.value)}
            value={cur.value}
          />
        </label>
      );
    });
  };

  // 사이즈 별 재고량 input 생성
  const stockBySizeGenerator = () => {
    return size.map((size, i) => {
      const onStockChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setStock(
          // @ts-ignored
          (prev: StockType): StockType =>
            ({
              ...prev,
              [size]: value === "0" ? 0 : value === "" ? "" : parseInt(value),
            } as StockType)
        );
      };

      return (
        <label className="flex items-center gap-2" key={i}>
          <h4 className="w-14 text-center text-base font-semibold">
            {size.toUpperCase()}
          </h4>
          <input
            type="number"
            value={stock[size]}
            min={0}
            onChange={onStockChange}
            style={{
              borderBottom: "1px solid #1f2937",
            }}
            className="px-2 py-1"
          />
        </label>
      );
    });
  };

  const onPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value ? parseInt(e.target.value) : "");
  };

  // 업로드
  const onProductUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (category === "" || subCategory === "" || gender === "" || color === "")
      return;

    // 기타 태그 반영 및 상품 데이터
    const tagList: Array<string> = [...tags.split(" ")];

    // 태그 중복을 방지하기 위해 수정모드에서는 defaultTags를 추가하지 않는다.
    if (!prevData) {
      // 기본 상품 정보 태그
      const defaultTags = [
        category,
        subCategory,
        ...name.split(" "),
        categoryData[category].name,
      ];

      // 하위 카테고리 한글명 태그
      const KORsubCategory = categoryData[category].subCategories.find(
        (cur) => cur.path === subCategory
      )?.name;
      if (KORsubCategory) defaultTags.push(KORsubCategory);

      // 성별 관련 태그
      const genderTag =
        gender === "male"
          ? ["남성", "남자"]
          : gender === "female"
          ? ["여성", "여자"]
          : ["남성", "남자", "여성", "여자", "남녀공용", "공용"];

      tagList.push(...genderTag);
      tagList.push(...defaultTags);
    }

    // 선택되지 않은 사이즈는 탈락
    const existingStock: StockType = {};
    size.forEach((curSize) => {
      existingStock[curSize] = stock[curSize];
    });

    // 최종적으로 업로드할 상품 데이터 (이미지 경로는 mutate 과정에서 처리 후 할당)
    const product: ProductType = {
      category,
      color,
      date: prevData ? prevData.date : Date.now(),
      detailImgs: prevData ? prevData.detailImgs : [{ src: "", id: "" }],
      gender,
      id: prevData ? prevData.id : uuidv4(),
      thumbnail: prevData ? prevData.thumbnail : { src: "", id: "" },
      name,
      orderCount: prevData ? prevData.orderCount : 0,
      price: price as number,
      size, // 필터링용 사이즈
      stock: existingStock, // 옵션 선택용 사이즈 & 재고
      totalStock,
      subCategory,
      tags: tagList,
      description,
    };

    // 상품 데이터 업로드
    if (product)
      mutateAsync({
        product,
        files: { thumbnail, detailImgs },
        isEdit: !!prevData,
      })
        .then(() => {
          window.alert("제품 등록이 완료되었습니다.");
          prevData ? replace(`/products/product/${prevData.id}`) : reset();
        })
        .catch(() => {
          window.alert(
            "제품 등록 과정에서 오류가 발생하였습니다.\n잠시 후 다시 시도해주세요."
          );
        });
  };

  // 상품 수정 모드일 경우, 즉 prevData prop이 존재할 경우 상태 업데이트
  useEffect(() => {
    if (!prevData) return;

    setCategory(prevData.category as CategoryName);
    setSubCategory(prevData.subCategory);
    setName(prevData.name);
    setPrice(prevData.price);
    setGender(prevData.gender);
    setColor(prevData.color as ColorType);
    setStock({
      xs: 0,
      s: 0,
      m: 0,
      l: 0,
      xl: 0,
      xxl: 0,
      xxxl: 0,
      other: 0,
      ...prevData.stock,
    });
    setSize(prevData.size as Array<SizeType>);
    setTags(prevData.tags.join(" "));
    setDescription(prevData.description);
  }, [
    prevData,
    setCategory,
    setColor,
    setDescription,
    setGender,
    setName,
    setPrice,
    setSize,
    setStock,
    setSubCategory,
    setTags,
  ]);

  // 카테고리에 맞는 하위 카테고리 생성하기
  useEffect(() => {
    if (!category) return;

    const newList = categoryData[category as CategoryName]
      .subCategories as Array<Category>;

    setSubCategoryList(newList);
  }, [category, prevData, setSubCategory]);

  // 총 재고수
  useEffect(() => {
    setTotalStock(
      Object.values(stock).reduce((acc, cur, i) => {
        return typeof cur !== "number" || cur < 1 ? acc : acc + cur;
      }, 0)
    );
  }, [stock]);

  return (
    <React.Fragment>
      <form
        className="flex flex-wrap gap-16 text-zinc-800"
        onSubmit={onProductUpload}
      >
        <div className="flex w-full flex-wrap gap-16">
          <label>
            <h3 className="mb-2 text-2xl font-semibold">제품명</h3>
            <input
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="제품명"
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            />
          </label>
          <label>
            <h3 className="mb-2 text-2xl font-semibold">제품 가격</h3>
            <input
              type="number"
              value={price}
              min={1}
              onChange={onPriceChange}
              placeholder="가격"
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
              required
            />
            <span className="ml-2 text-base font-semibold">₩</span>
          </label>
          <label>
            <h3 className="mb-2 text-2xl font-semibold">태그</h3>
            <input
              type="text"
              value={tags}
              placeholder="태그(띄어쓰기로 구분)"
              onChange={onTagsChange}
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-16">
          <label>
            <h3 className="mb-2 text-2xl font-semibold">카테고리</h3>
            <select
              onChange={onCategoryChange}
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
              value={category}
              required
            >
              <option value="" disabled>
                선택
              </option>
              {Object.entries(categoryData).map(
                (category, i) =>
                  category[0] !== "all" && (
                    <option key={i} value={category[0]}>
                      {category[1].name}
                    </option>
                  )
              )}
            </select>
          </label>
          <label>
            <h3 className="mb-2 text-2xl font-semibold">하위 카테고리</h3>
            <select
              onChange={onSubCategoryChange}
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              required
              className="px-2 py-1"
              value={subCategory}
            >
              <option value="" disabled>
                선택
              </option>
              {subCategoryList.map((subCategory, i) => (
                <option value={subCategory.path} key={i}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-16">
            <label>
              <h3 className="mb-2 text-2xl font-semibold">성별</h3>
              <select
                onChange={onGenderChange}
                style={{
                  borderBottom: "1px solid #1f2937",
                }}
                required
                className="px-2 py-1"
                value={gender}
              >
                <option value="" disabled>
                  선택
                </option>
                <option value={"all"}>공용</option>
                <option value={"male"}>남성</option>
                <option value={"female"}>여성</option>
              </select>
            </label>
            <label>
              <h3 className="mb-2 text-2xl font-semibold">색상</h3>
              <select
                onChange={onColorChange}
                style={{
                  borderBottom: "1px solid #1f2937",
                }}
                required
                className="px-2 py-1"
                value={color}
              >
                <option value="" disabled>
                  선택
                </option>
                {filterData.color.map((color, i) => (
                  <option key={i} value={color.value}>
                    {color.text}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-16">
          <label className="w-fit">
            <h3 className="mb-2 text-2xl font-semibold">대표 사진</h3>
            {prevData && (
              <p className="mb-2">
                새로운 사진으로 변경할 경우에만 등록하고 기존 사진을 이용하실
                경우 비워두세요.
              </p>
            )}
            <input
              ref={(el) => {
                if (el) filesInputRefs.current[0] = el;
              }}
              type="file"
              onChange={onThumbnailChange}
              required={!prevData}
              accept="image/*"
            />
          </label>
          <label className="w-fit">
            <h3 className="mb-2 text-2xl font-semibold">상세 사진</h3>
            {prevData && (
              <p className="mb-2">
                새로운 사진으로 변경할 경우에만 등록하고 기존 사진을 이용하실
                경우 비워두세요.
              </p>
            )}
            <input
              ref={(el) => {
                if (el) filesInputRefs.current[1] = el;
              }}
              type="file"
              onChange={onDetailImgsChange}
              multiple
              required={!prevData}
              accept="image/*"
            />
          </label>
        </div>
        <div className="flex w-full flex-wrap gap-16">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">재고</h3>
            <div className="flex flex-wrap gap-5">
              {sizeCheckboxGenerator()}
            </div>
            {stockBySizeGenerator()}
            <div className="mt-2 flex items-center gap-2 text-xl font-semibold">
              <span className="w-fit text-center">총 재고량</span>
              <span className="px-2 py-1 text-base">{totalStock} 개</span>
            </div>
          </div>
          <label>
            <h3 className="mb-2 text-2xl font-semibold">제품 설명</h3>
            <textarea
              value={description}
              onChange={onDescriptionChange}
              style={{ border: "1px solid #1f2937" }}
              className="aspect-[5/2] min-w-[300px] rounded-sm px-2 py-1 text-base"
            />
          </label>
        </div>
        <div className="flex w-full gap-3">
          <Button theme="black">제품 {prevData ? "수정" : "등록"}</Button>
          <Button
            onClick={
              prevData
                ? () => {}
                : (e) => {
                    e.preventDefault();
                    reset();
                  }
            }
            href={prevData ? `/products/product/${prevData.id}` : ""}
            tailwindStyles="bg-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-300"
          >
            {prevData ? "돌아가기" : "초기화"}
          </Button>
        </div>
      </form>
      <Loading show={isLoading} fullScreen={true} />
    </React.Fragment>
  );
};

export default FormProduct;
