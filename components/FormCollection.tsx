import React, { FormEvent, useEffect, useRef } from "react";
import useInput from "../hooks/useInput";
import { CollectionType } from "../types";
import { v4 as uuidv4 } from "uuid";
import Button from "./Button";
import useInputImg from "../hooks/useInputImg";
import Loading from "./AnimtaionLoading";
import { useRouter } from "next/router";
import useCollection from "../hooks/useCollection";

interface Props {
  prevData?: CollectionType | undefined;
}

const FormCollection: React.FC<Props> = ({ prevData }) => {
  const { push } = useRouter();
  const filesInputRef = useRef<HTMLInputElement>(null);
  const {
    files: poster,
    onFilesChange: onPosterChange,
    setFiles: setPosterFiles,
  } = useInputImg(null);
  const {
    value: title,
    setValue: setTitle,
    onChange: onTitleChange,
  } = useInput<string>("");
  const {
    value: enTitle,
    setValue: setEnTitle,
    onChange: onEnTitleChange,
  } = useInput<string>("");
  const {
    value: subTitle,
    setValue: setSubTitle,
    onChange: onSubTitleChange,
  } = useInput<string>("");
  const {
    value: titlePos,
    setValue: setTitlePos,
    onChange: onTitlePosChange,
  } = useInput<string>("top left");
  const {
    value: videoSrc,
    setValue: setVideoSrc,
    onChange: onVideoSrcChange,
  } = useInput<string>("");
  const {
    value: description,
    setValue: setDescription,
    onChange: onDescriptionChange,
  } = useInput<string>("");
  const {
    value: products,
    setValue: setProducts,
    onChange: onProductsChange,
  } = useInput<string>("");

  const {
    set: { mutateAsync, isLoading },
  } = useCollection();

  // 수정 모드일 경우, 즉 prevData prop이 존재할 경우 상태 업데이트
  useEffect(() => {
    if (!prevData) return;

    setTitle(prevData.title);
    setEnTitle(prevData.enTitle);
    setSubTitle(prevData.subTitle);
    setTitlePos(prevData.titlePos.join(" "));
    setVideoSrc(prevData.video.src);
    setProducts(prevData.products.join("\n"));
    setDescription(prevData.description);
  }, [
    prevData,
    setDescription,
    setEnTitle,
    setProducts,
    setSubTitle,
    setTitle,
    setTitlePos,
    setVideoSrc,
  ]);

  // 제품 등록 성공시 초기화
  const reset = () => {
    setTitle("");
    setEnTitle("");
    setSubTitle("");
    setTitlePos("top left");
    setVideoSrc("");
    setPosterFiles(null);
    setDescription("");
    if (filesInputRef.current) {
      filesInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 기타 태그 반영 및 상품 데이터 업로드
  const onCollectionUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 최종적으로 업로드할 컬렉션 데이터 (이미지 경로는 mutate 과정에서 처리 후 할당)
    const collection: CollectionType = {
      id: prevData ? prevData.id : uuidv4(),
      createdAt: prevData ? prevData.createdAt : Date.now(),
      title,
      enTitle,
      subTitle,
      video: { src: videoSrc },
      img: prevData ? prevData.img : { src: "", id: "" },
      description,
      titlePos: titlePos.split(" "),
      products: products
        .replaceAll(" ", "")
        .split("\n")
        .filter((id) => !!id)
        .slice(0, 25),
    };

    // 데이터 업로드
    if (collection)
      mutateAsync({
        collection,
        file: poster,
        isEdit: !!prevData,
      })
        .then(() => {
          window.alert("컬렉션 등록이 완료되었습니다.");
          prevData ? push(`/collections/${prevData.id}`) : reset();
        })
        .catch(() => {
          window.alert(
            "컬렉션 등록 과정에서 오류가 발생하였습니다.\n잠시 후 다시 시도해주세요."
          );
        });
  };

  return (
    <React.Fragment>
      <form
        className="flex flex-wrap gap-16 text-zinc-800"
        onSubmit={onCollectionUpload}
      >
        <div className="flex w-full flex-wrap gap-16">
          <label>
            <h3 className="mb-2 text-2xl font-semibold">제목</h3>
            <input
              required
              type="text"
              value={title}
              onChange={onTitleChange}
              placeholder="컬렉션 제목"
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            />
          </label>
          <label>
            <h3 className="mb-2 text-2xl font-semibold">영문 제목</h3>
            <input
              required
              type="text"
              value={enTitle}
              onChange={onEnTitleChange}
              placeholder="컬렉션 영문 제목"
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            />
          </label>
          <label>
            <h3 className="mb-2 text-2xl font-semibold">부제목</h3>
            <input
              required
              type="text"
              value={subTitle}
              onChange={onSubTitleChange}
              placeholder="컬렉션 부제목"
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-16">
          <label>
            <h3 className="mb-2 text-2xl font-semibold">제목 위치</h3>
            <select
              required
              onChange={onTitlePosChange}
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              value={titlePos}
              className="px-2 py-1"
            >
              <option value="top left">상단 좌측</option>
              <option value="top center">상단 중앙</option>
              <option value="top right">상단 우측</option>
              <option value="center left">중앙 좌측</option>
              <option value="center center">중앙</option>
              <option value="center right">중앙 우측</option>
              <option value="bottom left">하단 좌측</option>
              <option value="bottom center">하단 중앙</option>
              <option value="bottom right">하단 우측</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-16">
          <label>
            <h3 className="mb-2 text-2xl font-semibold">영상 링크</h3>
            <input
              required
              type="text"
              value={videoSrc}
              onChange={onVideoSrcChange}
              placeholder="영상 링크"
              style={{
                borderBottom: "1px solid #1f2937",
              }}
              className="px-2 py-1"
            />
          </label>
          <label className="w-fit">
            <h3 className="mb-2 text-2xl font-semibold">포스터</h3>
            {prevData && (
              <p className="mb-2">
                새로운 사진으로 변경할 경우에만 등록하고 기존 사진을 이용하실
                경우 비워두세요.
              </p>
            )}
            <input
              ref={filesInputRef}
              type="file"
              onChange={onPosterChange}
              required={!prevData}
              accept="image/*"
            />
          </label>
        </div>
        <label>
          <h3 className="mb-2 text-2xl font-semibold">컬렉션 설명</h3>
          <textarea
            required
            value={description}
            onChange={onDescriptionChange}
            style={{ border: "1px solid #1f2937" }}
            className="aspect-[5/2] min-w-[300px] rounded-sm px-2 py-1 text-base"
          />
        </label>
        <label>
          <h3 className="mb-2 text-2xl font-semibold">제품 목록</h3>
          <p>등록할 제품의 id를 줄바꿈으로 구분하여 입력해 주세요.</p>
          <p className="mb-2">
            최대 25개까지 등록 가능하며 슬라이드에는 10개의 제품만 표시됩니다.
          </p>
          <textarea
            required
            value={products}
            onChange={onProductsChange}
            style={{ border: "1px solid #1f2937" }}
            className="aspect-[5/4] w-full rounded-sm px-2 py-1 text-base"
          />
        </label>
        <div className="flex w-full gap-3">
          <Button theme="black">컬렉션 {prevData ? "수정" : "등록"}</Button>
          <Button
            onClick={
              prevData
                ? () => {}
                : (e) => {
                    e.preventDefault();
                    reset();
                  }
            }
            href={prevData ? `/collections/${prevData.id}` : ""}
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

export default FormCollection;
