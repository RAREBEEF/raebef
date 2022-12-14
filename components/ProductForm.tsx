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
import useAddProduct from "../hooks/useAddProduct";
import Loading from "./Loading";

interface Props {
  prevData?: ProductType;
}

const ProductForm: React.FC<Props> = ({ prevData }) => {
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
  const { value: price, setValue: setPrice } = useInput<number | "">(0);
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
  const {
    value: description,
    setValue: setDescription,
    onChange: onDescriptionChange,
  } = useInput<string>("");

  const errorHandler = () => {
    window.alert(
      "????????? ???????????? ???????????? ????????? ?????????????????????.\n?????? ??? ?????? ????????? ?????????."
    );
  };

  const onSuccess = () => {
    window.alert("?????? ????????? ?????????????????????.");
    reset();
  };

  const { mutate, isLoading } = useAddProduct(errorHandler, onSuccess);

  const reset = () => {
    setCategory("clothes");
    const newList = categoryData.clothes.subCategories as Array<Category>;
    setSubCategoryList(newList);
    setSubCategory(newList[0].path);
    setName("");
    setPrice(0);
    setGender(1);
    setColor("black");
    setStock({ xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0 });
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

  // ?????? ?????? ????????? ??????, ??? prevData prop??? ????????? ?????? ?????? ????????????
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

  // ??????????????? ?????? ?????? ???????????? ????????????
  useEffect(() => {
    const newList = categoryData[category as CategoryName]
      .subCategories as Array<Category>;

    setSubCategoryList(newList);
    setSubCategory(newList[0].path);
  }, [category, setSubCategory]);

  // ????????? ?????? ????????? ?????? ????????????
  // ????????? 1 ????????? ???????????? ????????? ????????? ??????
  useEffect(() => {
    const newSize: Array<SizeType> = [];

    Object.entries(stock).forEach((size) => {
      const curSize = size[0] as SizeType;
      const curSizeStock = size[1];

      curSizeStock >= 1 && newSize.push(curSize);
    });

    setSize(newSize);
  }, [setSize, stock]);

  // ????????? ??? ????????? input ????????????
  const stockBySizeGenerator = () => {
    const sizes: Array<SizeType> = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];

    return sizes.map((size, i) => {
      const onStockChange = (e: ChangeEvent<HTMLInputElement>) => {
        // @ts-ignored
        setStock((prev: StockType): StockType => {
          const prevStock = { ...prev };
          const newStock: StockType = {};
          const { value } = e.target;

          if (value === "0") {
            newStock[size] = 0;
          } else if (value === "") {
            newStock[size] = "";
          } else {
            newStock[size] = parseInt(value);
          }

          return { ...prevStock, ...newStock };
        });
      };

      return (
        <label className="flex gap-2 items-center" key={i}>
          <h4 className="w-14 text-base font-semibold text-center">
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

  // ?????? ?????? ?????? ??? ?????? ????????? ?????????
  const onProductUpload = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const additionalTags = tags.split(" ");

    // ?????? ?????? ?????? ??????
    const defaultTags = [
      category,
      subCategory,
      name,
      categoryData[category].name,
    ];

    // ?????? ???????????? ????????? ??????
    const KORsubCategory = categoryData[category].subCategories.find(
      (cur) => cur.path === subCategory
    )?.name;
    if (KORsubCategory) defaultTags.push(KORsubCategory);

    // ?????? ?????? ??????
    const genderTag =
      gender === 0
        ? ["??????", "??????"]
        : gender === 2
        ? ["??????", "??????"]
        : ["??????", "??????", "??????", "??????", "????????????", "??????"];

    // ????????? ?????? ???????????? ????????? ??????, ???????????? ??????.
    const existingStock: StockType = { ...stock };
    Object.entries(stock).forEach((size) => {
      const curSize = size[0] as SizeType;
      const curSizeStock = size[1];

      if (!curSizeStock) delete existingStock[curSize];
    });

    // ??????????????? ???????????? ?????? ????????? (????????? ????????? mutate ???????????? ?????? ??? ??????)
    const product: ProductType = {
      category,
      color,
      date: Date.now(),
      detailImgs: [{ src: "", id: "" }],
      gender,
      id: uuidv4(),
      thumbnail: { src: "", id: "" },
      name,
      orderCount: 0,
      price: price as number,
      size,
      stock: existingStock,
      subCategory,
      tags: [...defaultTags, ...additionalTags, ...genderTag],
      description,
    };

    // ?????? ????????? ?????????
    if (thumbnail && detailImgs && product)
      mutate({ product, files: { thumbnail, detailImgs } });
  };

  return (
    <React.Fragment>
      <form
        className="flex flex-wrap gap-16 px-12 xs:px-5 text-zinc-800"
        onSubmit={onProductUpload}
      >
        <div className="w-full flex gap-16 flex-wrap">
          <label>
            <h3 className="font-semibold text-2xl mb-2">?????????</h3>
            <input
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="?????????"
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
              required
            />
          </label>
          <label>
            <h3 className="font-semibold text-2xl mb-2">?????? ??????</h3>
            <input
              type="number"
              value={price}
              min={1}
              onChange={onPriceChange}
              placeholder="??????"
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
              required
            />
            <span className="text-base font-semibold ml-2">???</span>
          </label>
          <label>
            <h3 className="font-semibold text-2xl mb-2">??????</h3>
            <input
              type="text"
              value={tags}
              placeholder="??????(??????????????? ??????)"
              onChange={onTagsChange}
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            />
          </label>
        </div>
        <div className="flex gap-16 flex-wrap">
          <label>
            <h3 className="font-semibold text-2xl mb-2">????????????</h3>
            <select
              onChange={onCategoryChange}
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            >
              <option value="clothes">??????</option>
              <option value="accessory">????????????</option>
              <option value="shoes">??????</option>
              <option value="bag">??????</option>
              <option value="jewel">?????????</option>
            </select>
          </label>
          <label>
            <h3 className="font-semibold text-2xl mb-2">?????? ????????????</h3>
            <select
              onChange={onSubCategoryChange}
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            >
              {subCategoryList.map((subCategory, i) => (
                <option value={subCategory.path} key={i}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-16">
            <label>
              <h3 className="font-semibold text-2xl mb-2">??????</h3>
              <select
                onChange={onGenderChange}
                style={{
                  borderBottom: "1px solid #1f2937",
                }}
                className="px-2 py-1"
              >
                <option value={1}>??????</option>
                <option value={0}>??????</option>
                <option value={2}>??????</option>
              </select>
            </label>
            <label>
              <h3 className="font-semibold text-2xl mb-2">??????</h3>
              <select
                onChange={onColorChange}
                style={{
                  borderBottom: "1px solid #1f2937",
                }}
                className="px-2 py-1"
              >
                <option value="black">??????</option>
                <option value="white">?????????</option>
                <option value="gray">?????????</option>
                <option value="red">??????</option>
                <option value="orange">?????????</option>
                <option value="brown">?????????</option>
                <option value="blue">??????</option>
                <option value="skyblue">???????????????</option>
                <option value="green">??????</option>
              </select>
            </label>
          </div>
        </div>
        <div className="flex gap-16 flex-wrap">
          <label className="w-fit">
            <h3 className="font-semibold text-2xl mb-2">?????? ??????</h3>
            <input
              ref={(el) => {
                if (el) filesInputRefs.current[0] = el;
              }}
              type="file"
              onChange={onThumbnailChange}
              required
              accept="image/*"
            />
          </label>
          <label className="w-fit">
            <h3 className="font-semibold text-2xl mb-2">?????? ??????</h3>
            <input
              ref={(el) => {
                if (el) filesInputRefs.current[1] = el;
              }}
              type="file"
              onChange={onDetailImgsChange}
              multiple
              accept="image/*"
            />
          </label>
        </div>
        <div className="flex gap-16 flex-wrap w-full">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-2xl">??????</h3>
            {stockBySizeGenerator()}
            <div className="text-xl font-semibold flex gap-2 items-center mt-2">
              <span className="w-fit text-center">??? ?????????</span>
              <span className="px-2 py-1 text-base">
                {Object.values(stock).reduce((acc, cur, i) => {
                  return typeof cur !== "number" ? acc : acc + cur;
                }, 0)}{" "}
                ???
              </span>
            </div>
          </div>
          <label>
            <h3 className="font-semibold text-2xl mb-2">?????? ??????</h3>
            <textarea
              value={description}
              onChange={onDescriptionChange}
              style={{ border: "1px solid #1f2937" }}
              className="min-w-[300px] aspect-[5/2] rounded-sm text-base px-2 py-1"
            />
          </label>
        </div>
        <div className="flex gap-3 w-full">
          <Button theme="black">?????? ??????</Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              reset();
            }}
            tailwindStyles="bg-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-300"
          >
            ?????????
          </Button>
        </div>
      </form>
      <Loading show={isLoading} fullScreen={true} />
    </React.Fragment>
  );
};

export default ProductForm;
