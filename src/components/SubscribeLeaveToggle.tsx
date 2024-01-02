"use client";

import React, { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubideavibePayload } from "@/lib/validators/subideavibe";
import axios, { AxiosError } from "axios";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  subideavibeId: string;
  subideavibeName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<Props> = ({
  subideavibeId,
  subideavibeName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToasts();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubideavibePayload = {
        subideavibeId,
      };

      const { data } = await axios.post("/api/subideavibe/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: "Subscribed!",
        description: `You are now subscribed to r/${subideavibeName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubideavibePayload = {
        subideavibeId,
      };

      const { data } = await axios.post(
        "/api/subideavibe/unsubscribe",
        payload
      );
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: "Unsubscribed!",
        description: `You are now unsubscribed from r/${subideavibeName}`,
      });
    },
  });

  return (
    <>
      {isSubscribed ? (
        <Button
          onClick={() => unsubscribe()}
          isLoading={isUnSubLoading}
          className=" w-full mt-1 mb-4"
        >
          Leave Community
        </Button>
      ) : (
        <Button
          onClick={() => subscribe()}
          isLoading={isSubLoading}
          className=" w-full mt-1 mb-4"
        >
          Join Community
        </Button>
      )}
    </>
  );
};

export default SubscribeLeaveToggle;
