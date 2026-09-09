"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function addTodo(formData: FormData) {
  const task = formData.get("task");
  if (typeof task !== "string" || task.trim() === "") return;

  const { error } = await supabase.from("todos").insert({ task: task.trim() });
  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function toggleTodo(id: number, isComplete: boolean) {
  const { error } = await supabase
    .from("todos")
    .update({ is_complete: isComplete })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
}
