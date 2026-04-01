"use client";

import { ANSWER_HINTS } from "@features/faq/lib/answer-hints";
import { Button } from "@shared/components/ui/button";
import { Textarea } from "@shared/components/ui/textarea";
import type { FaqItem } from "@shared/types/api";
import {
  CheckCircle2,
  HelpCircle,
  Loader2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface FaqQuestionItemProps {
  item: FaqItem;
  onEdit: (id: string, data: { answer: string }) => Promise<void>;
  onDelete: (item: FaqItem) => void;
}

export function FaqQuestionItem({
  item,
  onEdit,
  onDelete,
}: FaqQuestionItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [syncedAnswer, setSyncedAnswer] = useState(item.answer);
  const [localAnswer, setLocalAnswer] = useState(item.answer ?? "");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  if (syncedAnswer !== item.answer) {
    setSyncedAnswer(item.answer);
    setLocalAnswer(item.answer ?? "");
  }

  const answerLen = localAnswer.length;
  const isValid = answerLen === 0 || answerLen >= 50;
  const hint = ANSWER_HINTS[item.question];
  const hasChanges = localAnswer !== (item.answer ?? "");

  const handleSave = async () => {
    setSaving(true);
    await onEdit(item.id, { answer: localAnswer });
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => {
      setExpanded(false);
      setTimeout(() => setJustSaved(false), 300);
    }, 600);
  };

  return (
    <div className="border border-gray-100 rounded-lg bg-gray-50/50">
      <div
        className="flex items-start gap-2 px-3 py-2.5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="mt-0.5 shrink-0 text-gray-400">
          {expanded ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">{item.question}</p>
          {!item.answer && !justSaved ? (
            <p className="text-xs text-gray-400 mt-0.5">No answer yet</p>
          ) : (justSaved || item.answer) && !expanded ? (
            <p className="text-xs text-green-500 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />{" "}
              {justSaved ? "Saved!" : "Answered"}
            </p>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-1">
          {hint && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-2 flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-600">{hint}</p>
            </div>
          )}
          <Textarea
            value={localAnswer}
            onChange={(e) => setLocalAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className={`h-28 resize-none text-sm ${!isValid ? "border-red-300 focus-visible:ring-red-300" : ""}`}
            maxLength={2000}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {!isValid && (
                <p className="text-xs text-red-500">
                  Minimum 50 characters required
                </p>
              )}
              <p className="text-xs text-gray-400">{answerLen}/2000</p>
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || !hasChanges || !isValid}
              className="bg-blue-500 hover:bg-blue-600 rounded-lg gap-1.5 h-8 px-4"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
