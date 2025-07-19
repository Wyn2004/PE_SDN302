"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { UserForm } from "./UserForm";
import { User } from "@/interface/user.interface";

interface EditUserFormProps {
  userId: string;
}

export function EditUserForm({ userId }: EditUserFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUser = async () => {
    try {
      console.log(1231231, userId);
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <UserForm initialData={user} userId={userId} onSuccess={handleSuccess} />
  );
}
