import { FirebaseError } from "firebase/app";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  startAfter,
  getDocs,
  limit,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { db } from "../fb";
import { ChatData, ChattingData } from "../types";

const useGetChatting = (chatId: string, uid: string) => {
  const queryClient = useQueryClient(),
    {
      data: prevChattingData,
      fetchNextPage,
      isFetched,
    } = useGetPrevChatting(chatId),
    { data: unread } = useGetUnreadCount(chatId, uid),
    [chattingData, setChattingData] = useState<ChattingData>([]),
    { data: count } = useGetMessageCount(chatId);

  // 채팅 infinity query 데이터에서 채팅 데이터만 빼서 상태에 저장
  useEffect(() => {
    const prevChatting: ChattingData = [];

    prevChattingData?.pages.forEach((chatData) => {
      prevChatting.push(...chatData.chatting);
    });

    setChattingData(prevChatting);
  }, [prevChattingData]);

  // 새로운 메세지 업데이트 수신 대기
  // 업데이트 수신 후 채팅 데이터에 포함시킨다.
  useEffect(() => {
    if (!isFetched || !chatId) return;

    const coll = collection(db, "chat", chatId, "messages"),
      q = query(
        coll,
        orderBy("sendAt", "asc"),
        startAfter(
          prevChattingData?.pages[0]?.chatting[0]?.sendAt || Date.now() - 10000
        )
      ),
      unsub = onSnapshot(q, async (snapshot) => {
        const data: ChattingData = [];
        snapshot.forEach((doc) => {
          data.push(doc.data() as ChatData);
        });

        if (data.length !== 0) {
          const newChattingData = {
            pageParams: [
              undefined,
              data[0]?.sendAt,
              ...(prevChattingData?.pageParams.slice(1) || []),
            ],
            pages: [
              { chatting: data, lastVisible: data[0].sendAt },
              ...(prevChattingData?.pages || []),
            ],
          };

          queryClient.setQueryData(["chat", chatId], newChattingData);
          queryClient.invalidateQueries(["unreadMessage", chatId]);
          queryClient.invalidateQueries(["messageCount", chatId]);
        }
      });

    return () => {
      unsub();
    };
  }, [chattingData, isFetched, prevChattingData, queryClient, chatId]);

  return {
    data: { chatting: chattingData, unread: unread || 0, messageCount: count },
    fetchNextPage,
  };
};

// 이전 체팅 불러오기
const useGetPrevChatting = (uid: string) => {
    const data = useInfiniteQuery<any, FirebaseError>({
      queryKey: ["chat", uid],
      queryFn: async ({ pageParam }) => getPrevChatting(uid, pageParam),
      getNextPageParam: (lastPage, pages) => lastPage?.lastVisible,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
      keepPreviousData: true,
      onError: (error) => console.error(error),
    });

    return data;
  },
  getPrevChatting = async (uid: string, pageParam: number) => {
    const result: {
      chatting: ChattingData;
      lastVisible: number | null;
      hasNextPage: boolean;
    } = {
      chatting: [],
      lastVisible: null,
      hasNextPage: true,
    };

    if (!uid) return result;

    const count = 15,
      coll = collection(db, "chat", uid, "messages"),
      queries = [orderBy("sendAt", "desc"), limit(count)];

    if (pageParam) queries.push(startAfter(pageParam));

    const q = query(coll, ...queries),
      snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      result.chatting.push(doc.data() as ChatData);
    });

    if (snapshot.empty || snapshot.size < count) result.hasNextPage = false;

    result.lastVisible = (
      snapshot.docs[snapshot.docs.length - 1]?.data() as ChatData
    )?.sendAt;

    return result;
  };

// 안읽은 채팅 개수 불러오기
const getUnreadCount = async (chatId: string, uid: string) => {
    if (!chatId || !uid) return 0;

    const coll = collection(db, "chat", chatId, "messages"),
      q = query(coll, where("senderId", "!=", uid), where("read", "==", false)),
      snapshot = await getCountFromServer(q);

    return snapshot.data().count;
  },
  useGetUnreadCount = (chatId: string, uid: string) => {
    const data = useQuery(["unreadMessage", chatId, uid], {
      queryFn: () => getUnreadCount(chatId, uid),
    });

    return data;
  };

// 전체 채팅 개수 불러오기
const getMessageCount = async (chatId: string) => {
    if (!chatId) return 0;

    const coll = collection(db, "chat", chatId, "messages"),
      q = query(coll),
      snapshot = await getCountFromServer(q);

    return snapshot.data().count;
  },
  useGetMessageCount = (chatId: string) => {
    const data = useQuery(["messageCount", chatId], {
      queryFn: () => getMessageCount(chatId),
    });

    return data;
  };

export default useGetChatting;
