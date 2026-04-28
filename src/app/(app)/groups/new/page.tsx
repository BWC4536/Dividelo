import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupForm } from "@/components/groups/GroupForm";

export const metadata: Metadata = { title: "Nuevo grupo" };

export default function NewGroupPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nuevo grupo</h1>
          <p className="text-sm text-muted-foreground">
            Crea un grupo para dividir gastos
          </p>
        </div>
      </div>
      <GroupForm />
    </div>
  );
}
