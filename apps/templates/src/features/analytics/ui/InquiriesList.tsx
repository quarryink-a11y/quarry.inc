"use client";

import {
  useDeleteInquiry,
  useUpdateInquiry,
} from "@features/inquiries/api/use-inquiries";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Skeleton } from "@shared/components/ui/skeleton";
import { InquiryStatus, type ReferralSource } from "@shared/constants/enums";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_STYLES,
  REFERRAL_SOURCE_BADGE_STYLES,
  REFERRAL_SOURCE_LABELS,
} from "@shared/constants/mappers";
import type { Inquiry } from "@shared/types/api";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Phone,
  Ruler,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const STATUS_FILTERS = [
  { key: "all", label: "All", color: "bg-gray-100 text-gray-700" },
  {
    key: InquiryStatus.NEW,
    label: "New",
    color: "bg-blue-100 text-blue-700",
  },
  {
    key: InquiryStatus.IN_PROGRESS,
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    key: InquiryStatus.COMPLETED,
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
  {
    key: InquiryStatus.CANCELLED,
    label: "Cancelled",
    color: "bg-red-50 text-red-600",
  },
] as const;

interface InquiriesListProps {
  inquiries: Inquiry[];
  isLoading?: boolean;
  onDelete?: (id?: string) => void;
}

export function InquiriesList({
  inquiries,
  isLoading,
  onDelete,
}: InquiriesListProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceValue, setPriceValue] = useState("");

  const deleteInquiry = useDeleteInquiry();
  const updateInquiry = useUpdateInquiry();

  const handleDelete = async (inq: Inquiry) => {
    if (!confirm(`Delete inquiry from ${inq.first_name} ${inq.last_name}?`))
      return;
    setDeletingId(inq.id);
    await deleteInquiry.mutateAsync(inq.id);
    toast.success("Inquiry deleted");
    setDeletingId(null);
    onDelete?.(inq.id);
  };

  const handleStatusChange = async (inq: Inquiry, newStatus: InquiryStatus) => {
    if (newStatus === InquiryStatus.COMPLETED && !inq.final_price) {
      toast.error("Set a final price before marking as Completed");
      return;
    }
    try {
      await updateInquiry.mutateAsync({
        id: inq.id,
        status: newStatus,
      });
      toast.success(`Status updated to ${INQUIRY_STATUS_LABELS[newStatus]}`);
      onDelete?.();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePriceSave = async (inq: Inquiry) => {
    const price = parseFloat(priceValue);
    if (isNaN(price) || price < 0) {
      toast.error("Enter a valid price");
      return;
    }
    await updateInquiry.mutateAsync({ id: inq.id, final_price: price });
    toast.success("Price saved");
    setEditingPriceId(null);
    setPriceValue("");
    onDelete?.();
  };

  const availableSources = useMemo(() => {
    const sources = new Set(
      inquiries.map((i) => i.referral_source).filter(Boolean),
    );
    return Array.from(sources) as ReferralSource[];
  }, [inquiries]);

  const filtered = inquiries.filter((inq) => {
    const matchStatus = statusFilter === "all" || inq.status === statusFilter;
    const matchSource =
      sourceFilter === "all" || inq.referral_source === sourceFilter;
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      (inq.first_name || "").toLowerCase().includes(term) ||
      (inq.last_name || "").toLowerCase().includes(term) ||
      (inq.client_email || "").toLowerCase().includes(term);
    return matchStatus && matchSource && matchSearch;
  });

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: inquiries.length,
      [InquiryStatus.NEW]: 0,
      [InquiryStatus.IN_PROGRESS]: 0,
      [InquiryStatus.COMPLETED]: 0,
      [InquiryStatus.CANCELLED]: 0,
    };
    inquiries.forEach((inq) => {
      if (inq.status && counts[inq.status] !== undefined) counts[inq.status]++;
    });
    return counts;
  }, [inquiries]);

  return (
    <div>
      {/* Status quick filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === s.key
                ? `${s.color} ring-2 ring-offset-1 ring-gray-300`
                : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            {s.label}
            <span className="ml-1.5 text-xs opacity-60">
              {statusCounts[s.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search & source filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 border-gray-200 rounded-xl"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-44 border-gray-200 rounded-xl">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {availableSources.map((src) => (
              <SelectItem key={src} value={src}>
                {REFERRAL_SOURCE_LABELS[src] ?? src}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50/60 rounded-xl px-4 py-2.5 mb-4">
        <p className="text-sm text-gray-500">
          {filtered.length} inquiries found
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-64 mb-3" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => {
            const isExpanded = expandedId === inq.id;
            return (
              <div
                key={inq.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {inq.first_name} {inq.last_name}
                        </span>
                        {inq.status && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-medium ${INQUIRY_STATUS_STYLES[inq.status as InquiryStatus] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            {INQUIRY_STATUS_LABELS[
                              inq.status as InquiryStatus
                            ] ?? inq.status}
                          </span>
                        )}
                        {inq.referral_source && (
                          <Badge
                            className={`text-xs ${REFERRAL_SOURCE_BADGE_STYLES[inq.referral_source as ReferralSource] ?? "bg-gray-50 text-gray-600"}`}
                          >
                            <Megaphone className="w-3 h-3 mr-1" />
                            {REFERRAL_SOURCE_LABELS[
                              inq.referral_source as ReferralSource
                            ] ?? inq.referral_source}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        {inq.client_email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> {inq.client_email}
                          </span>
                        )}
                        {inq.client_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" /> {inq.client_phone}
                          </span>
                        )}
                        {inq.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {inq.city}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {inq.created_at
                          ? format(new Date(inq.created_at), "MMM d, yyyy")
                          : ""}
                      </span>
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : inq.id)
                        }
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {inq.placement && (
                      <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md text-xs">
                        {inq.placement}
                      </span>
                    )}
                    {inq.size_value && inq.size_unit && (
                      <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
                        <Ruler className="w-3 h-3" /> {inq.size_value}{" "}
                        {inq.size_unit}
                      </span>
                    )}
                    {inq.preferred_date && (
                      <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {format(new Date(inq.preferred_date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                    <Select
                      value={inq.status ?? InquiryStatus.NEW}
                      onValueChange={(val) =>
                        void handleStatusChange(inq, val as InquiryStatus)
                      }
                    >
                      <SelectTrigger className="w-36 h-8 text-xs border-gray-200 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={InquiryStatus.NEW}>New</SelectItem>
                        <SelectItem value={InquiryStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={InquiryStatus.COMPLETED}>
                          Completed
                        </SelectItem>
                        <SelectItem value={InquiryStatus.CANCELLED}>
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {editingPriceId === inq.id ? (
                      <div className="flex items-center gap-1.5">
                        <div className="relative w-28">
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <Input
                            type="number"
                            value={priceValue}
                            onChange={(e) => setPriceValue(e.target.value)}
                            placeholder="0"
                            className="pl-7 h-8 text-sm border-gray-200 rounded-lg"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") void handlePriceSave(inq);
                              if (e.key === "Escape") setEditingPriceId(null);
                            }}
                          />
                        </div>
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-green-500 hover:bg-green-600 px-3"
                          onClick={() => void handlePriceSave(inq)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs px-2"
                          onClick={() => setEditingPriceId(null)}
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingPriceId(inq.id);
                          setPriceValue(String(inq.final_price ?? ""));
                        }}
                        className={`h-8 text-xs flex items-center gap-1.5 px-3 rounded-lg transition-colors ${
                          (inq.final_price ?? 0) > 0
                            ? "bg-green-50 text-green-700 hover:bg-green-100 font-medium"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        }`}
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        {(inq.final_price ?? 0) > 0
                          ? `$${inq.final_price!.toLocaleString()}`
                          : "Set price"}
                      </button>
                    )}

                    <div className="ml-auto">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-red-300 hover:text-red-600 hover:bg-red-50"
                        onClick={() => void handleDelete(inq)}
                        disabled={deletingId === inq.id}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                    {inq.idea_description && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Idea description
                        </p>
                        <p className="text-sm text-gray-600">
                          {inq.idea_description}
                        </p>
                      </div>
                    )}
                    {inq.inspiration_urls &&
                      inq.inspiration_urls.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1.5">
                            Reference images
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {inq.inspiration_urls.map((url, i) => (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-gray-400 transition-colors"
                              >
                                <img
                                  src={url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
