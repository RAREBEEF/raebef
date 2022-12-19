import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
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
import addProduct from "../pages/api/addProducts";
import { useMutation } from "react-query";

interface Props {
  prevData?: ProductType;
}

const ProductForm: React.FC<Props> = ({ prevData }) => {
  const {
    value: category,
    setValue: setCategory,
    onChange: onCategoryChange,
  } = useInput<CategoryName>("clothes");
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
  } = useInput<ColorType>("black");
  const {
    value: gender,
    setValue: setGender,
    onChange: onGenderChange,
  } = useInput<GenderType>(1);
  const {
    value: name,
    setValue: setName,
    onChange: onNameChange,
  } = useInput<string>("");
  const {
    value: price,
    setValue: setPrice,
    onChange: onPriceChange,
  } = useInput<number | "">(0);
  const {
    value: stock,
    setValue: setStock,
    onChange: onStockChange,
  } = useInput<StockType>({ xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0 });
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
  const { files: thumbnail, onChange: onThumbnailChange } = useInputImg();
  const { files: detailImgs, onChange: onDetailImgsChange } = useInputImg();
  const mutation = useMutation(addProduct);

  // 상품 수정 모드일 경우, 즉 prevData prop이 존재할 경우 상태 업데이트
  useEffect(() => {
    if (!prevData) return;
    setCategory(prevData.category as CategoryName);
    setSubCategory(prevData.subCategory);
    setName(prevData.name);
    setPrice(prevData.price);
    setGender(prevData.gender);
    setColor(prevData.color as ColorType);
    setStock(prevData.stock);
    setTags(prevData.tags.reduce((acc, cur, i) => acc + " " + cur, ""));
  }, [
    prevData,
    setCategory,
    setColor,
    setGender,
    setName,
    setPrice,
    setStock,
    setSubCategory,
    setTags,
  ]);

  // 카테고리에 맞는 하위 카테고리 생성하기
  useEffect(() => {
    const newList = categoryData[category as CategoryName]
      .subCategories as Array<Category>;

    setSubCategoryList(newList);
    setSubCategory(newList[0].path);
  }, [category, setSubCategory]);

  // 재고에 맞춰 사이즈 목록 생성하기
  // 재고가 1 이상인 사이즈만 사이즈 목록에 추가
  useEffect(() => {
    const newSize: Array<SizeType> = [];

    Object.entries(stock).forEach((size) => {
      const curSize = size[0] as SizeType;
      const curSizeStock = size[1];
      curSizeStock >= 1 && newSize.push(curSize);
    });

    setSize(newSize);
  }, [setSize, stock]);

  // 사이즈 별 재고량 input 생성하기
  const stockBySizeGenerator = () => {
    const sizes: Array<SizeType> = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];

    return sizes.map((size, i) => {
      return (
        <label className="flex gap-2 items-center" key={i}>
          <h4 className="w-14 text-base font-semibold text-center">
            {size.toUpperCase()}
          </h4>
          <input
            type="number"
            value={stock[size]}
            min={0}
            required
            onChange={(e) => {
              // @ts-ignored
              setStock((prev: StockType): StockType => {
                const prevStock = { ...prev };
                const newStock: StockType = {};
                newStock[size] = parseFloat(e.target.value) || "";

                return { ...prevStock, ...newStock };
              });
            }}
            style={{ border: "1px solid #1f2937" }}
            className="rounded-sm text-sm px-2 py-1"
          />
        </label>
      );
    });
  };

  // 기타 태그 반영 및 상품 데이터 업로드
  const onProductUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const additionalTags = tags.split(" ");

    // 기본 상품 정보 태그
    const defaultTags = [
      category,
      subCategory,
      name,
      categoryData[category].name,
    ];

    // 하위 카테고리 한글명 태그
    const KORsubCategory = categoryData[category].subCategories.find(
      (cur) => cur.path === subCategory
    )?.name;
    if (KORsubCategory) defaultTags.push(KORsubCategory);

    // 성별 관련 태그
    const genderTag =
      gender === 0
        ? ["male", "man", "남성", "남자"]
        : gender === 2
        ? ["female", "woman", "여성", "여자"]
        : [
            "male",
            "man",
            "남성",
            "남자",
            "female",
            "woman",
            "여성",
            "여자",
            "남녀공용",
            "unisex",
          ];

    // 최종적으로 업로드할 상품 데이터 (이미지 경로는 mutate 과정에서 처리 후 할당)
    const product: ProductType = {
      category,
      color,
      date: new Date(),
      detailImgs: [{ src: "", id: "" }],
      gender,
      id: uuidv4(),
      thumbnail: { src: "", id: "" },
      name,
      orderCount: 0,
      price: price as number,
      size,
      stock,
      subCategory,
      tags: [...defaultTags, ...additionalTags, ...genderTag],
    };

    // 상품 데이터 업로드
    if (thumbnail && detailImgs && product)
      mutation.mutate({ product, files: { thumbnail, detailImgs } });
  };

  return (
    <form
      className="flex flex-col gap-10 px-12 xs:px-5 text-zinc-800"
      onSubmit={onProductUpload}
    >
      <label>
        <h3 className="font-semibold text-2xl mb-2">카테고리</h3>
        <select
          onChange={onCategoryChange}
          style={{ border: "1px solid #1f2937" }}
          className="rounded-sm text-base px-2 py-1"
        >
          <option value="clothes">의류</option>
          <option value="accessory">악세서리</option>
          <option value="shoes">신발</option>
          <option value="bag">가방</option>
          <option value="jewel">주얼리</option>
        </select>
      </label>
      <label>
        <h3 className="font-semibold text-2xl mb-2">하위 카테고리</h3>
        <select
          onChange={onSubCategoryChange}
          style={{ border: "1px solid #1f2937" }}
          className="rounded-sm text-base px-2 py-1"
        >
          {subCategoryList.map((subCategory, i) => (
            <option value={subCategory.path} key={i}>
              {subCategory.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <h3 className="font-semibold text-2xl mb-2">제품명</h3>
        <input
          type="text"
          value={name}
          onChange={onNameChange}
          style={{ border: "1px solid #1f2937" }}
          className="rounded-sm text-base px-2 py-1"
          required
        />
      </label>
      <label className="w-fit">
        <h3 className="font-semibold text-2xl mb-2">대표 사진</h3>
        <input
          type="file"
          onChange={onThumbnailChange}
          required
          accept="image/*"
        />
      </label>
      <label className="w-fit">
        <h3 className="font-semibold text-2xl mb-2">상세 사진</h3>
        <input
          type="file"
          onChange={onDetailImgsChange}
          multiple
          accept="image/*"
        />
      </label>
      <label>
        <h3 className="font-semibold text-2xl mb-2">가격</h3>
        <input
          type="number"
          value={price}
          min={1}
          onChange={(e) => {
            setPrice(e.target.value ? parseFloat(e.target.value) : "");
          }}
          style={{ border: "1px solid #1f2937" }}
          className="rounded-sm text-base px-2 py-1"
          required
        />
        <span className="text-base font-semibold ml-2">₩</span>
      </label>
      <label>
        <h3 className="font-semibold text-2xl mb-2">성별</h3>
        <select
          onChange={onGenderChange}
          style={{ border: "1px solid #1f2937" }}
          className="rounded-sm text-base px-2 py-1"
        >
          <option value={1}>공용</option>
          <option value={0}>남성</option>
          <option value={2}>여성</option>
        </select>
      </label>
      <label>
        <h3 className="font-semibold text-2xl mb-2">색상</h3>
        <select
          onChange={onColorChange}
          style={{ border: "1px solid #1f2937" }}
          className="rounded-sm text-base px-2 py-1"
        >
          <option value="black">블랙</option>
          <option value="white">화이트</option>
          <option value="gray">그레이</option>
          <option value="red">레드</option>
          <option value="orange">오렌지</option>
          <option value="brown">브라운</option>
          <option value="blue">블루</option>
          <option value="skyblue">스카이블루</option>
          <option value="green">그린</option>
        </select>
      </label>
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-2xl">재고</h3>
        {stockBySizeGenerator()}
        <div className="text-xl font-semibold flex gap-2 items-center mt-2">
          <span className="w-fit text-center">총 재고량</span>
          <span className="px-2 py-1 text-base">
            {Object.entries(stock).reduce((acc, cur, i) => {
              return typeof cur[1] !== "number" ? acc : acc + cur[1];
            }, 0)}{" "}
            개
          </span>
        </div>
      </div>

      <label>
        <h3 className="font-semibold text-2xl">태그</h3>
        <p>띄어쓰기로 구분</p>
        <p className="mb-2">
          카테고리 및 제품명, 성별 관련 태그는 자동으로 포함
        </p>
        <input
          type="text"
          value={tags}
          onChange={onTagsChange}
          style={{ border: "1px solid #1f2937" }}
          className="rounded-sm text-base px-2 py-1"
        />
      </label>
      <Button>제출</Button>
    </form>
  );
};

export default ProductForm;
