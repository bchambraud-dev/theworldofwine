import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export function useActivity() {
  const { user } = useAuth();

  const track = useCallback(async (
    type: "guide_read" | "region_view" | "producer_view" | "journey_step",
    itemId: string,
    itemTitle?: string
  ) => {
    if (!user) return;
    // Upsert to avoid duplicates for the same item
    await supabase.from("user_activity").upsert({
      user_id: user.id,
      activity_type: type,
      item_id: itemId,
      item_title: itemTitle || itemId,
    }, { onConflict: "user_id,activity_type,item_id", ignoreDuplicates: true });
  }, [user]);

  return track;
}
