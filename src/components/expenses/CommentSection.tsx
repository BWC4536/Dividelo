"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Comment } from "@/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelativeDate } from "@/lib/utils/cn";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { mutate } from "swr";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
}

export function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const isOwn = comment.userId === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
    >
      <UserAvatar
        name={comment.user?.name}
        image={comment.user?.image}
        size="xs"
      />
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
        <div
          className={`rounded-2xl px-3 py-2 text-sm ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          }`}
        >
          {comment.content}
        </div>
        <p className="text-[10px] text-muted-foreground px-1">
          {comment.user?.name} · {formatRelativeDate(comment.createdAt)}
        </p>
      </div>
    </motion.div>
  );
}

interface CommentSectionProps {
  comments: Comment[];
  expenseId: string;
  groupId: string;
  currentUserId?: string;
}

export function CommentSection({
  comments,
  expenseId,
  groupId,
  currentUserId,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/groups/${groupId}/expenses/${expenseId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content.trim() }),
        }
      );
      if (res.ok) {
        setContent("");
        await mutate(`/api/groups/${groupId}/expenses/${expenseId}`);
      } else {
        toast.error("Error al enviar comentario");
      }
    } catch {
      toast.error("Error al enviar comentario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        Comentarios ({comments.length})
      </h3>

      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            Sin comentarios aún
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Añadir comentario..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1"
        />
        <Button
          size="icon"
          variant="gradient"
          onClick={handleSend}
          loading={loading}
          disabled={!content.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
