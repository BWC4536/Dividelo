import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileAvatarSection } from "@/components/profile/ProfileAvatarSection";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id as string },
    include: {
      _count: { select: { groupMembers: true, paidExpenses: true } },
    },
  });

  if (!user) redirect("/login");

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    currency: user.currency,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi perfil</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gestiona tu información personal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Foto de perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileAvatarSection user={userData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información personal</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={userData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{user._count.groupMembers}</p>
            <p className="text-xs text-muted-foreground">Grupos</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{user._count.paidExpenses}</p>
            <p className="text-xs text-muted-foreground">Gastos pagados</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <Badge variant="secondary">{user.currency}</Badge>
            <p className="text-xs text-muted-foreground mt-1">Moneda</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
