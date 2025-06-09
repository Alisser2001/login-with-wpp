import { signOut } from "@/utils/auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/signin')
  }
  return <p className="flex flex-col">Hello {data.user.email} <span className="cursor-pointer" onClick={signOut}>Cerrar Sesion</span></p>
}
