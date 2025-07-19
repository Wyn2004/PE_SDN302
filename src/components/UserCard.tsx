"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { User } from "@/interface/user.interface";

interface UserCardProps {
  user: User;
  onDelete: () => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{user.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {user.email}
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
