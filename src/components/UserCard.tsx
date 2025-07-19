"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { User } from "@/interface/user.interface";
import { useConfirm } from "@/provider/ConfirmModal";

interface UserCardProps {
  user: User;
  onDelete: () => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  const { confirm } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete User",
      description: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Delete button in top right corner */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-sm line-clamp-3">
          Phone: {user?.phone || "N/A"}
        </p>
        <p className="text-muted-foreground text-sm line-clamp-3">
          Group: {user?.group || "N/A"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/edit/${user._id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
