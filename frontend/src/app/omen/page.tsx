import { redirect } from "next/navigation";

/** The home screen's Omen Draw shortcut lands here; the game home is the menu. */
export default function OmenPage() {
  redirect("/");
}
