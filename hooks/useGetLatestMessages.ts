import {
  onSnapshot,
  query,
  getDocs,
  collectionGroup,
  orderBy,
} from "firebase/firestore";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { db } from "../fb";
import { ChatData, latestChatData } from "../types";

const useGetLatestMessages = (isAdmin: boolean) => {
  const queryClient = useQueryClient(),
    data = useQuery(["chatList", isAdmin], {
      queryFn: () => getLatestMessages(isAdmin),
    });

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collectionGroup(db, "summary"), orderBy("sendAt", "desc")),
      unsub = onSnapshot(q, async (snapshot) => {
        const data: Array<ChatData> = [];

        snapshot.forEach((doc) => {
          data.push(doc.data() as ChatData);
        });

        if (data.length !== 0) {
          queryClient.setQueryData(["chatList"], data);
        }
      });

    return () => {
      unsub();
    };
  }, [queryClient, isAdmin]);

  return data;
};

const getLatestMessages = async (isAdmin: boolean) => {
  if (!isAdmin) return;
  const latestMessages: Array<latestChatData> = [];

  const q = query(collectionGroup(db, "summary"));

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    latestMessages.push(doc.data() as latestChatData);
  });

  return latestMessages;
};

export default useGetLatestMessages;
