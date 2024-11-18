"use client";
import { useEffect } from "react";
import { createClient } from "~/utils/supabase/client";
export default function CompositionsPage() {
  const supabase = createClient();

  useEffect(() => {
    console.log("Fetching compositions...");

    async function fetchCompositions() {
      try {
        const { data, error } = await supabase
          .from("compositions")
          .select("*")
          .eq("id", "53f9a39e-40dd-4509-8f93-2404ac422c94")
          .single();
        console.log({ data });

        if (error) throw error;
      } catch (error) {
        console.error("Error fetching compositions:", error);
      } finally {
      }
    }

    fetchCompositions();
  }, []);

  return <div>HEY THERE</div>;
}
