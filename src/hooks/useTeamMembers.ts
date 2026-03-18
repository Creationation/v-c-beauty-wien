import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Artist } from "@/data/artists";

export interface TeamMember extends Artist {
  is_fixed: boolean;
  is_active: boolean;
  sort_order: number;
}

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase
      .from("team_members" as any)
      .select("*")
      .order("sort_order", { ascending: true });
    const mapped = ((data as any) || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      handle: m.handle,
      role: m.role,
      experience: m.experience,
      languages: m.languages || [],
      bio: m.bio,
      instagram: m.instagram,
      whatsapp: m.whatsapp,
      specialties: m.specialties || [],
      rating: Number(m.rating),
      reviews: m.reviews,
      emoji: m.emoji,
      is_fixed: m.is_fixed,
      is_active: m.is_active,
      sort_order: m.sort_order,
    }));
    setMembers(mapped);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("team_members" as any).update({ is_active: active } as any).eq("id", id);
    await fetch();
  };

  const add = async (member: Partial<TeamMember>) => {
    const id = member.name?.toLowerCase().replace(/\s+/g, "-") || `member-${Date.now()}`;
    await supabase.from("team_members" as any).insert({
      id,
      name: member.name || "",
      handle: member.handle || "",
      role: member.role || "",
      emoji: member.emoji || "🌟",
      is_fixed: false,
      is_active: true,
      sort_order: members.length,
    } as any);
    await fetch();
  };

  const remove = async (id: string) => {
    await supabase.from("team_members" as any).delete().eq("id", id);
    await fetch();
  };

  const activeMembers = members.filter((m) => m.is_active);
  const activeArtists: Artist[] = activeMembers.map(({ is_fixed, is_active, sort_order, ...a }) => a);

  return { members, activeMembers, activeArtists, loading, toggle, add, remove, refetch: fetch };
}
