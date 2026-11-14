import { redirect } from "next/navigation";

/** The bottom tab bar's "Menu" entry lands here; the game home is the menu. */
export default function MenuPage() {
  redirect("/");
}
