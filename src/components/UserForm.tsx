"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Loader2 } from "lucide-react";
import { UserFormData, userSchema } from "@/lib/validations/user.validation";
import { toast } from "sonner";
import { NextResponse } from "next/server";

interface UserFormProps {
  initialData?: {
    name: string;
    email: string;
    phone: string;
    group: string;
  };
  userId?: string;
  onSuccess?: () => void;
}

export function UserForm({ initialData, userId, onSuccess }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      group: initialData?.group || "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const url = userId ? `/api/users/${userId}` : "/api/users";
      const method = userId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });

      if (response.ok) {
        toast.success(`User ${userId ? "updated" : "created"} successfully`);
        onSuccess?.();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast.error(
        `Failed to ${userId ? "update" : "create"} user: ${error.message}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register("name")} placeholder="Enter post name" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" {...register("email")} placeholder="Enter email" />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input id="phone" {...register("phone")} placeholder="Enter phone" />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="group">Group *</Label>
        <Input id="group" {...register("group")} placeholder="Enter group" />
        {errors.group && (
          <p className="text-sm text-destructive">{errors.group.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {userId ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
